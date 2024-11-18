import { Test, TestingModule } from '@nestjs/testing';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { getModelToken } from '@nestjs/sequelize';
import { ClassModel } from './class.model';
import { StudentClassModel } from 'src/student_class/student-class.model';

describe('ClassesController', () => {
  let controller: ClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesController],
      providers: [
        ClassesService,
        {
          provide: getModelToken(ClassModel),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getModelToken(StudentClassModel),
          useValue: { findAll: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ClassesController>(ClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of classes', async () => {
      expect(controller.findAll).toBeDefined();
    });
  });
});
