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
import { Pagination, PaginationResponse } from 'src/utils/pagination.dto';
import { StudentFilter } from './dto/filter.dto';
import { Op } from 'sequelize';

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

  async findAll(
    pagination_options: Pagination,
    filter: StudentFilter,
  ): Promise<PaginationResponse<StudentDto>> {
    const { page = 1, limit = 2 } = pagination_options;
    const offset = (page - 1) * limit;

    const where_filter: any = {};

    if (filter.name) {
      where_filter.first_name = {
        [Op.startsWith]: `${filter.name}`,
      };
    }

    const { count, rows } = await this.studentModel.findAndCountAll({
      limit: +limit,
      offset,
      where: where_filter,
    });

    return {
      items: rows as StudentDto[],
      limit,
      total: count,
      page: page,
    };
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
