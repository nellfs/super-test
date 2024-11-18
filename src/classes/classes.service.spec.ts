import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { getModelToken } from '@nestjs/sequelize';
import { ClassModel } from './class.model';
import { StudentClassModel } from 'src/student_class/student-class.model';
import { ClassDto, CreateClassDto, UpdateClassDTO } from './dto/class.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/constants/messages.constants';

export const class_list: ClassDto[] = [
  {
    id: 1,
    name: 'Javascript & Typescript Basics',
    description: 'Learn JS and TS',
    start_date: new Date('2024-01-10'),
    end_date: new Date('2024-04-10'),
  },
  {
    id: 2,
    name: 'Sequelize ORM',
    description: 'How to setup Sequelize',
    start_date: new Date('2024-02-15'),
    end_date: null,
  },
  {
    id: 3,
    name: 'SQL and MySQL',
    description: 'Learn SQL and use it with MySQL',
    start_date: new Date('2024-03-01'),
    end_date: new Date('2024-07-01'),
  },
];
describe('ClassesService', () => {
  let service: ClassesService;
  let classModel: typeof ClassModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: getModelToken(ClassModel),
          useValue: {
            findAll: jest.fn().mockResolvedValue(class_list),
            findOne: jest.fn().mockImplementation((query) => {
              if (query.where.id) {
                return Promise.resolve(class_list[0]);
              }
              if (query.where.name === 'Future Class') {
                return Promise.resolve(null);
              }
              return Promise.resolve(class_list[0]);
            }),
            create: jest.fn().mockImplementation((data) => {
              return Promise.resolve({
                id: 4,
                ...data,
              });
            }),
            update: jest.fn().mockResolvedValue(class_list[1]),
            destroy: jest.fn().mockImplementation((query) => {
              const classExists = class_list.some(
                (c) => c.id === query.where.id,
              );
              return Promise.resolve(classExists ? 1 : 0);
            }),
          },
        },
        {
          provide: getModelToken(StudentClassModel),
          useValue: { findAll: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
    classModel = module.get(getModelToken(ClassModel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(classModel).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list with all classes', async () => {
      const list = await service.findAll();

      expect(list).toEqual(class_list);

      expect(classModel.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return just a class', async () => {
      const result = await service.findOne(0);

      expect(result).toEqual(class_list[0]);
      expect(classModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new class', async () => {
      const data: CreateClassDto = {
        name: 'Future Class',
        description: 'To be defined',
        start_date: new Date('2024-11-17'),
        end_date: new Date('2024-11-17'),
      };

      const result = await service.create(data);

      expect(classModel.findOne).toHaveBeenCalledWith({
        where: { name: data.name },
      });

      expect(classModel.create).toHaveBeenCalledWith(data);

      expect(result).toEqual({
        id: 4,
        ...data,
      });
    });

    it('should throw an bad request expection when sending already created class', () => {
      const already_created: CreateClassDto = {
        name: 'Javascript & Typescript Basics',
        description: 'Learn JS and TS',
        start_date: new Date('2024-01-10'),
        end_date: new Date('2024-04-10'),
      };

      const result = service.create(already_created);

      expect(result).rejects.toEqual(
        new BadRequestException(ERROR_MESSAGES.CLASS_ALREADY_EXISTS),
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Class',
      description: 'Updated Description',
    };

    it('should update an existing class', async () => {
      const result = await service.update(1, updateDto);

      expect(classModel.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(classModel.update).toHaveBeenCalledWith(updateDto, {
        where: { id: 1 },
      });
      expect(result).toEqual(updateDto);
    });

    it('should throw not found expection when updating non existent class', async () => {
      jest.spyOn(classModel, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND),
      );

      expect(classModel.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(classModel.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully remove an existing class', async () => {
      -jest.spyOn(classModel, 'destroy').mockResolvedValueOnce(1);

      const result = await service.remove(1);

      expect(result).toEqual({ message: SUCCESS_MESSAGES.CLASS_REMOVED });
      expect(classModel.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw not found expection when removing non-existent class', async () => {
      jest.spyOn(classModel, 'destroy').mockResolvedValueOnce(0);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND),
      );

      expect(classModel.destroy).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});
