import { Model, PrimaryKey } from 'sequelize-typescript';
import { Column, ForeignKey, Table } from 'sequelize-typescript';
import { ClassModel } from 'src/classes/class.model';
import { StudentModel } from 'src/students/student.model';

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
