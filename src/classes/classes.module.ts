import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from './class.model';

@Module({
  imports: [SequelizeModule.forFeature([Class])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
