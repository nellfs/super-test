import {
  BelongsToMany,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';
import { ClassModel } from '../classes/class.model';
import { StudentClassModel } from '../student_class/student-class.model';

@Table({
  modelName: 'Students',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
})
export class StudentModel extends Model {
  id: number;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  email: string;

  @Column
  date_of_birth: Date;

  @BelongsToMany(() => ClassModel, () => StudentClassModel) 
  classes: ClassModel[];
}

