import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { StudentModel } from './student.model';
import { getModelToken } from '@nestjs/sequelize';

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getModelToken(StudentModel),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
