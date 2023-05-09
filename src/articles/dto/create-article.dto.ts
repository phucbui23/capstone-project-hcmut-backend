import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  hospitalId: number;

  @IsArray()
  @IsOptional()
  tags: string[];
}
