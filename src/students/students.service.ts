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
import { Student } from './student.model';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) {}

  async create(createStudentDTO: CreateStudentDto): Promise<StudentDto> {
    const student = await this.studentModel.findOne({
      where: { email: createStudentDTO.email },
    });
    if (student) {
      throw new BadRequestException(`Student already exists`);
    }

    const studentData = instanceToPlain(createStudentDTO);

    const createdStudent = await this.studentModel.create(studentData);

    return createdStudent as StudentDto;
  }

  async findAll(): Promise<StudentDto[]> {
    return (await this.studentModel.findAll()) as StudentDto[];
  }

  async findOne(id: number): Promise<StudentDto> {
    return (await this.studentModel.findOne({ where: { id } })) as StudentDto;
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    await this.studentModel.update(updateStudentDto, { where: { id } });
    return updateStudentDto as StudentDto;
  }

  async remove(id: number) {
    const studentsAffected = await this.studentModel.destroy({ where: { id } });
    if (studentsAffected === 0) {
      throw new NotFoundException('Student not found');
    }
    return {message:`Student removed`}
  }
}
