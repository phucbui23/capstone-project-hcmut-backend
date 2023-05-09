import { IsNotEmpty, IsNumber } from 'class-validator';

export class PatientSavesArticleDto {
  @IsNumber()
  @IsNotEmpty()
  patientAccountId: number;

  @IsNumber()
  @IsNotEmpty()
  articleId: number;
}
