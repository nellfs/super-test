import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import {
  CreateStudentDto,
  StudentDto,
  UpdateStudentDto,
} from './dto/student.dto';
import { ClassDto } from 'src/classes/dto/class.dto';
import { Pagination } from '../utils/pagination.dto';
import { StudentFilter } from './dto/filter.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto): Promise<StudentDto> {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: Pagination,
    @Query() filterDto: StudentFilter,
  ) {
    return this.studentsService.findAll(paginationDto, filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string): Promise<StudentDto> {
    return this.studentsService.findOne(+id);
  }

  @Get(':id/classes')
  listClasses(@Param('id', ParseIntPipe) id: number): Promise<ClassDto[]> {
    return this.studentsService.listClasses(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.studentsService.remove(+id);
  }
}
