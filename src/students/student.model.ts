import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
})
export class Student extends Model {
  id: number;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  email: string;

  @Column
  date_of_birth: Date;
}
