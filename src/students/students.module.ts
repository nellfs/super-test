import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentModel } from './student.model';

@Module({
  imports: [SequelizeModule.forFeature([StudentModel])],
  controllers: [StudentsController],
  providers: [StudentsService],  
})
export class StudentsModule {}
