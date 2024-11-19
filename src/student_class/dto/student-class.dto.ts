import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class EnrollmentDto {
  @IsNotEmpty()
  @IsNumber()
  student_id: number;

  @IsNotEmpty()
  @IsNumber()
  class_id: number;
}

export class EnrollStudentsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  students: number[];
}
