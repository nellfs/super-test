import {
  Column,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ modelName: 'Classes', createdAt: 'created_at', updatedAt: 'updated_at' })
export class Class extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @Column
  start_date: Date;

  @Column
  end_date: Date;
}
