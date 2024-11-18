import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentModel } from './student.model';
import { StudentClassModel } from '../student_class/student-class.model';

@Module({
  imports: [
    SequelizeModule.forFeature([StudentModel]),
    SequelizeModule.forFeature([StudentClassModel]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
