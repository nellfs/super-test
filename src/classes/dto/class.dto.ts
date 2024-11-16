import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ClassDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  start_date: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  end_date: Date;
}

export class CreateClassDto extends OmitType(ClassDto, ['id'] as const) {}

export class UpdateClassDTO extends PartialType(CreateClassDto) {} {}
