import { Injectable } from '@nestjs/common';
import { CreateClassDto, UpdateClassDTO } from './dto/class.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from './class.model';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class)
    private userModel: typeof Class,
  ) {}

  async create(createClassDto: CreateClassDto) {
    return 'next';
  }

  async findAll(): Promise<Class[]> {
    return this.userModel.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto: UpdateClassDTO) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
