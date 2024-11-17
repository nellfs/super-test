import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClassDto, CreateClassDto, UpdateClassDTO } from './dto/class.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ClassModel } from './class.model';
import { instanceToPlain } from 'class-transformer';
import { StudentClassModel } from 'src/student_class/student-class.model';
import { EnrollStudentsDto } from 'src/student_class/dto/student-class.dto';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/constants/messages.constants';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(ClassModel)
    private classModel: typeof ClassModel,

    @InjectModel(StudentClassModel)
    private enrollmentModel: typeof StudentClassModel,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<ClassDto> {
    const student = await this.classModel.findOne({
      where: { name: createClassDto.name },
    });
    if (student) {
      throw new BadRequestException(ERROR_MESSAGES.CLASS_ALREADY_EXISTS);
    }

    const student_data = instanceToPlain(createClassDto);

    const created_student = await this.classModel.create(student_data);

    return created_student as ClassDto;
  }

  async findAll(): Promise<ClassDto[]> {
    return (await this.classModel.findAll()) as ClassDto[];
  }

  async findOne(id: number): Promise<ClassDto> {
    const student = await this.classModel.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
    }
    return student as ClassDto;
  }

  async update(id: number, updateClassDto: UpdateClassDTO): Promise<ClassDto> {
    const student = await this.classModel.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
    }

    await this.classModel.update(updateClassDto, {
      where: { id },
    });
    return updateClassDto as ClassDto;
  }

  async remove(id: number) {
    const students_affected = await this.classModel.destroy({ where: { id } });
    if (students_affected === 0) {
      throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
    }
    return { message: SUCCESS_MESSAGES.CLASS_REMOVED };
  }

  // TODO: go back here later
  async enrollStudents(enroll_students: EnrollStudentsDto, class_id: number) {
    const enrollments = enroll_students.students.map((student_id) => ({
      student_id,
      class_id,
    }));

    await this.enrollmentModel.bulkCreate(enrollments, {
      ignoreDuplicates: true,
    });

    return { message: 'Students enrolled' };
  }
}
