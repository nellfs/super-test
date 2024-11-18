import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { getModelToken } from '@nestjs/sequelize';
import { ClassModel } from './class.model';
import { StudentClassModel } from 'src/student_class/student-class.model';
import { ClassDto, CreateClassDto } from './dto/class.dto';

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
  });
});
