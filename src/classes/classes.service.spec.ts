import { Test, TestingModule } from '@nestjs/testing';
import { ClassesService } from './classes.service';
import { getModelToken } from '@nestjs/sequelize';
import { ClassModel } from './class.model';

describe('ClassesService', () => {
  let service: ClassesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        { provide: getModelToken(ClassModel), useValue: {} },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
  });

  describe('findAll', () => {
    it('should list all classes', () => {
      const list = service.findAll();
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
