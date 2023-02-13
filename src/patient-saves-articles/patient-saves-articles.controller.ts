import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatientSavesArticlesService } from './patient-saves-articles.service';
import { PatientSavesArticleDto } from './dto/patient-saves-article.dto';
import { UpdatePatientSavesArticleDto } from './dto/update-patient-saves-article.dto';
@Controller('patient-saves-articles')
export class PatientSavesArticlesController {
  constructor(
    private readonly patientSavesArticlesService: PatientSavesArticlesService,
  ) {}

  @Post('save')
  async saveArticle(@Body() patientSavesArticleDto: PatientSavesArticleDto) {
    return this.patientSavesArticlesService.create(patientSavesArticleDto);
  }

  @Delete('unsave')
  async unsaveArticle(@Body() patientSavesArticleDto: PatientSavesArticleDto) {
    return this.patientSavesArticlesService.remove(patientSavesArticleDto);
  }

  @Get()
  findAll() {
    return this.patientSavesArticlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientSavesArticlesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientSavesArticleDto: UpdatePatientSavesArticleDto,
  ) {
    return this.patientSavesArticlesService.update(
      +id,
      updatePatientSavesArticleDto,
    );
  }
}
