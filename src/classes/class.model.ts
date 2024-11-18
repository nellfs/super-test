import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { StudentClassModel } from '../student_class/student-class.model';
import { StudentModel } from '../students/student.model';

@Table({
  modelName: 'Classes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
})
export class ClassModel extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @Column
  start_date: Date;

  @Column
  end_date: Date;

  @BelongsToMany(() => StudentModel, () => StudentClassModel)
  students: StudentModel[];
}
