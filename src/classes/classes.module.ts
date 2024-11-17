import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassModel } from './class.model';
import { StudentClassModel } from 'src/student_class/student-class.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ClassModel]),
    SequelizeModule.forFeature([StudentClassModel]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
