import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class StudentDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date_of_birth: Date;
}

export class CreateStudentDto extends OmitType(StudentDto, ['id'] as const) {}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
