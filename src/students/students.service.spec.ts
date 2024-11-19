import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { StudentModel } from './student.model';
import { getModelToken } from '@nestjs/sequelize';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/constants/messages.constants';
import { ClassModel } from 'src/classes/class.model';
import { Op } from 'sequelize';

describe('StudentsService', () => {
  let service: StudentsService;
  let student_model: typeof StudentModel;

  const mock_student_list = [
    {
      id: 1,
      first_name: 'Heron',
      last_name: 'X',
      email: 'heronx@email.com',
      date_of_birth: new Date('2000-08-08'),
    },
    {
      id: 2,
      first_name: 'Ricardo',
      last_name: 'A',
      email: 'ricardoa@email.com',
      date_of_birth: new Date('1990-11-11'),
    },
    {
      id: 3,
      first_name: 'Dio',
      last_name: 'Dio',
      email: 'dio@email.com',
      date_of_birth: new Date('1993-10-10'),
    },
  ];

  const mock_classes = [
    {
      id: 1,
      name: 'class 1',
      description: 'description 1',
    },
    {
      id: 2,
      name: 'class 2',
      description: 'description 2',
    },
  ];

  const mockStudentWithClasses = {
    id: 1,
    first_name: 'Heron',
    last_name: 'X',
    email: 'heronx@email.com',
    date_of_birth: new Date('2000-08-08'),
    classes: mock_classes,
  };

  const mock_student_service = {
    findAndCountAll: jest.fn().mockResolvedValue(mock_student_list),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn().mockImplementation((query) => {
      const classExists = mock_student_list.some(
        (c) => c.id === query.where.id,
      );
      return Promise.resolve(classExists ? 1 : 0);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getModelToken(StudentModel),
          useValue: mock_student_service,
        },
        {
          provide: getModelToken(ClassModel),
          useValue: {
            findAll: jest.fn(),
            bulkCreate: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    student_model = module.get(getModelToken(StudentModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(student_model).toBeDefined();
  });
  describe('findAll', () => {
    it('should return paginated results without filters', async () => {
      const mockResponse = {
        count: mock_student_list.length,
        rows: mock_student_list.slice(0, 2),
      };
      jest
        .spyOn(student_model, 'findAndCountAll')
        .mockResolvedValueOnce(mockResponse as any);

      const result = await service.findAll({ page: 1, limit: 2 }, {});

      expect(result).toEqual({
        items: mock_student_list.slice(0, 2),
        limit: 2,
        total: mock_student_list.length,
        page: 1,
      });
      expect(student_model.findAndCountAll).toHaveBeenCalledWith({
        limit: 2,
        offset: 0,
        where: {},
      });
    });

    it('should apply name filter', async () => {
      const mockResponse = {
        count: 1,
        rows: [mock_student_list[0]],
      };
      jest
        .spyOn(student_model, 'findAndCountAll')
        .mockResolvedValueOnce(mockResponse as any);

      const result = await service.findAll(
        { page: 1, limit: 2 },
        { name: 'Heron' },
      );

      expect(result).toEqual({
        items: [mock_student_list[0]],
        limit: 2,
        total: 1,
        page: 1,
      });
      expect(student_model.findAndCountAll).toHaveBeenCalledWith({
        limit: 2,
        offset: 0,
        where: {
          first_name: {
            [Op.startsWith]: 'Heron',
          },
        },
      });
    });

    it('should handle pagination offset correctly', async () => {
      const mockResponse = {
        count: mock_student_list.length,
        rows: mock_student_list.slice(2, 3),
      };
      jest
        .spyOn(student_model, 'findAndCountAll')
        .mockResolvedValueOnce(mockResponse as any);

      const result = await service.findAll({ page: 2, limit: 2 }, {});

      expect(result).toEqual({
        items: mock_student_list.slice(2, 3),
        limit: 2,
        total: mock_student_list.length,
        page: 2,
      });
      expect(student_model.findAndCountAll).toHaveBeenCalledWith({
        limit: 2,
        offset: 2,
        where: {},
      });
    });
  });

  describe('findOne', () => {
    it('should find and return an student by id', async () => {
      const id = 0;
      jest
        .spyOn(student_model, 'findOne')
        .mockResolvedValue(mock_student_list[id] as any);

      const result = await service.findOne(id);

      expect(student_model.findOne).toHaveBeenCalledWith({ where: { id: id } });
      expect(result).toEqual(mock_student_list[id]);
    });

    it('should throw NotFoundException if student id does not exist', async () => {
      const id = 10;
      jest.spyOn(student_model, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(10)).rejects.toThrow(
        new NotFoundException(ERROR_MESSAGES.STUDENT_NOT_FOUND),
      );

      expect(student_model.findOne).toHaveBeenCalledWith({ where: { id: id } });
    });
  });

  describe('create', () => {
    it('should create and return a student', async () => {
      const new_student: CreateStudentDto = {
        first_name: 'student name',
        last_name: 'student last name',
        email: 'ftsdgsdfgdfgd@email.com',
        date_of_birth: new Date('1999-10-10'),
      };
      jest.spyOn(student_model, 'findOne').mockResolvedValueOnce(null);

      jest.spyOn(student_model, 'create').mockImplementationOnce((data) => {
        return Promise.resolve({
          id: 4,
          ...data,
        });
      });

      const result = await service.create(new_student);
      expect(student_model.findOne).toHaveBeenCalledWith({ where: { id: 0 } });
      expect(student_model.create).toHaveBeenCalledWith(new_student);

      expect(result).toEqual({
        id: 4,
        ...new_student,
      });
    });

    it('should throw an bad request expection when sending already created student', () => {
      const created_student: CreateStudentDto = {
        first_name: 'Heron',
        last_name: 'X',
        email: 'heronx@email.com',
        date_of_birth: new Date('2000-08-08'),
      };

      jest
        .spyOn(student_model, 'findOne')
        .mockResolvedValueOnce(mock_student_list[0] as any);

      const result = service.create(created_student);

      expect(result).rejects.toEqual(
        new BadRequestException(ERROR_MESSAGES.STUDENT_EMAIL_EXISTS),
      );
    });
  });

  describe('update', () => {
    const update_student: UpdateStudentDto = {
      first_name: 'updated first name',
      last_name: 'updated last name',
      email: 'Updated student',
    };

    it('should update an existing student', async () => {
      const result = await service.update(1, update_student);

      expect(student_model.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(student_model.update).toHaveBeenCalledWith(update_student, {
        where: { id: 1 },
      });
      expect(result).toEqual(update_student);
    });
  });

  describe('remove', () => {
    it('should successfully remove an existing student', async () => {
      jest.spyOn(student_model, 'destroy').mockResolvedValueOnce(1);

      const result = await service.remove(1);

      expect(result).toEqual({ message: SUCCESS_MESSAGES.STUDENT_REMOVED });
      expect(student_model.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('listClasses', () => {
    it('should return classes for a valid student', async () => {
      mock_student_service.findByPk.mockResolvedValue(mockStudentWithClasses);

      const result = await service.listClasses(1);

      expect(result).toEqual(mock_classes);
      expect(mock_student_service.findByPk).toHaveBeenCalledWith(1, {
        include: [ClassModel],
      });
    });
  });
});
