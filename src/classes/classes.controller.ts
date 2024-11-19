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
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDTO } from './dto/class.dto';
import { EnrollStudentsDto } from '../student_class/dto/student-class.dto';
import { Pagination } from '../utils/pagination.dto';
import { ClassFilter } from './dto/filter.dto';


@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll(@Query() paginationDto: Pagination, @Query() filterDto: ClassFilter) {
    return this.classesService.findAll(paginationDto, filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateClassDto: UpdateClassDTO,
  ) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.classesService.remove(+id);
  }

  @Post(':id/enroll')
  enroll(
    @Param('id', ParseIntPipe) id: string,
    @Body() students: EnrollStudentsDto,
  ) {
    return this.classesService.enrollStudents(students, +id);
  }
}
