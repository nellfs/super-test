import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClassDto, CreateClassDto, UpdateClassDTO } from './dto/class.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ClassModel } from './class.model';
import { instanceToPlain } from 'class-transformer';
import { StudentClassModel } from '../student_class/student-class.model';
import { EnrollStudentsDto } from 'src/student_class/dto/student-class.dto';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../constants/messages.constants';
import { Op } from 'sequelize';
import { Pagination, PaginationResponse } from 'src/utils/pagination.dto';
import { ClassFilter } from './dto/filter.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(ClassModel)
    private classModel: typeof ClassModel,

    @InjectModel(StudentClassModel)
    private enrollmentModel: typeof StudentClassModel,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<ClassDto> {
    const existingClass = await this.classModel.findOne({
      where: { name: createClassDto.name },
    });

    if (existingClass) {
      throw new BadRequestException(ERROR_MESSAGES.CLASS_ALREADY_EXISTS);
    }

    const class_data = instanceToPlain(createClassDto);

    const created_class = await this.classModel.create(class_data);

    return created_class as ClassDto;
  }

  async findAll(
    pagination_options: Pagination,
    filter: ClassFilter,
  ): Promise<PaginationResponse<ClassDto>> {
    const { page = 1, limit = 2 } = pagination_options;
    const offset = (page - 1) * limit;

    const where_filter: any = {};

    if (filter.name) {
      where_filter.name = {
        [Op.startsWith]: filter.name,
      };
    }

    if (filter.description) {
      where_filter.description = {
        [Op.startsWith]: filter.description,
      };
    }

    const { count, rows } = await this.classModel.findAndCountAll({
      limit: +limit,
      offset,
      where: where_filter,
    });

    return {
      items: rows as ClassDto[],
      limit,
      total: count,
      page: page,
    };
  }

  async findOne(id: number): Promise<ClassDto> {
    const existingClass = await this.classModel.findOne({ where: { id } });
    if (!existingClass) {
      throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
    }
    return existingClass as ClassDto;
  }

  async update(id: number, updateClassDto: UpdateClassDTO): Promise<ClassDto> {
    await this.findOne(id);

    await this.classModel.update(updateClassDto, {
      where: { id },
    });
    return updateClassDto as ClassDto;
  }

  async remove(id: number) {
    const classes_affected = await this.classModel.destroy({ where: { id } });
    if (classes_affected === 0) {
      throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
    }
    return { message: SUCCESS_MESSAGES.CLASS_REMOVED };
  }

  async enrollStudents(enroll_students: EnrollStudentsDto, class_id: number) {
    const enrollments = enroll_students.students.map((student_id) => ({
      student_id,
      class_id,
    }));

    await this.enrollmentModel.bulkCreate(enrollments, {
      ignoreDuplicates: true,
    });

    return { message: SUCCESS_MESSAGES.STUDENTS_ENROLLED };
  }
}
