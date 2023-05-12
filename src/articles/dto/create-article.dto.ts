import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: "Article's title",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Article's content",
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: "Article's belongs to which hospital",
  })
  @IsNumber()
  @IsNotEmpty()
  hospitalId: number;

  @ApiProperty({
    description: 'Array of tags',
  })
  @IsArray()
  @IsOptional()
  tags: string[];
}
