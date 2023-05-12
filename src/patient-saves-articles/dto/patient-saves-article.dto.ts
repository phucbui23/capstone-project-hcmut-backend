import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PatientSavesArticleDto {
  @ApiProperty({
    description: "Patient's id",
  })
  @IsNumber()
  @IsNotEmpty()
  patientAccountId: number;

  @ApiProperty({
    description: "Article's id",
  })
  @IsNumber()
  @IsNotEmpty()
  articleId: number;
}
