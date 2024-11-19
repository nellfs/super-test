import { IsOptional, IsString } from "class-validator";

export class ClassFilter {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  description?: string;
}
