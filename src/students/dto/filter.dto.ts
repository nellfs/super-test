import { IsOptional, IsString } from 'class-validator';

export class StudentFilter {
  @IsOptional()
  @IsString()
  name?: string;
}
