import { Module } from '@nestjs/common';
import { PatientSavesArticlesService } from './patient-saves-articles.service';
import { PatientSavesArticlesController } from './patient-saves-articles.controller';

@Module({
  controllers: [PatientSavesArticlesController],
  providers: [PatientSavesArticlesService]
})
export class PatientSavesArticlesModule {}
