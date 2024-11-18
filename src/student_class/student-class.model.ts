import { Model, PrimaryKey } from 'sequelize-typescript';
import { Column, ForeignKey, Table } from 'sequelize-typescript';
import { ClassModel } from '../classes/class.model';
import { StudentModel } from '../students/student.model';

@Table({
  modelName: 'StudentClasses',
  timestamps: false,
})
export class StudentClassModel extends Model {
  @PrimaryKey
  @ForeignKey(() => StudentModel)
  @Column
  student_id: number;

  @PrimaryKey
  @ForeignKey(() => ClassModel)
  @Column
  class_id: number;
}
