import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateStudentDto,
  StudentDto,
  UpdateStudentDto,
} from './dto/student.dto';
import { InjectModel } from '@nestjs/sequelize';
import { StudentModel } from './student.model';
import { instanceToPlain } from 'class-transformer';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../constants/messages.constants';
import { ClassModel } from '../classes/class.model';
import { ClassDto } from 'src/classes/dto/class.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(StudentModel)
    private studentModel: typeof StudentModel,
  ) {}

  async create(createStudentDTO: CreateStudentDto): Promise<StudentDto> {
    const student = await this.studentModel.findOne({
      where: { email: createStudentDTO.email },
    });
    if (student) {
      throw new BadRequestException(ERROR_MESSAGES.STUDENT_EMAIL_EXISTS);
    }

    const student_data = instanceToPlain(createStudentDTO);

    const created_student = await this.studentModel.create(student_data);

    return created_student as StudentDto;
  }

  async findAll(): Promise<StudentDto[]> {
    return (await this.studentModel.findAll()) as StudentDto[];
  }

  async findOne(id: number): Promise<StudentDto> {
    const student = await this.studentModel.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }
    return student as StudentDto;
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    await this.findOne(id);

    await this.studentModel.update(updateStudentDto, {
      where: { id },
    });
    return updateStudentDto as StudentDto;
  }

  async remove(id: number) {
    const students_affected = await this.studentModel.destroy({
      where: { id },
    });
    if (students_affected === 0) {
      throw new NotFoundException(ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }
    return { message: SUCCESS_MESSAGES.STUDENT_REMOVED };
  }

  async listClasses(student_id: number): Promise<ClassDto[]> {
    const student = await this.studentModel.findByPk(student_id, {
      include: [ClassModel],
    });

    if (!student) {
      throw new NotFoundException(ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }

    return student.classes as ClassDto[];
  }
}
