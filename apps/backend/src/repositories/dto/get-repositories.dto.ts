import { IsString, IsNotEmpty, IsISO8601, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetRepositoriesDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsISO8601()
  @IsNotEmpty()
  createdAfter: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 20))
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
