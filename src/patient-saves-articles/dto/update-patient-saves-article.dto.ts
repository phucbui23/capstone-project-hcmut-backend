import { PartialType } from '@nestjs/swagger';
import { PatientSavesArticleDto } from './patient-saves-article.dto';

export class UpdatePatientSavesArticleDto extends PartialType(
  PatientSavesArticleDto,
) {}
