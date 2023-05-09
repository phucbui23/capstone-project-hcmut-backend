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
import { Roles } from 'src/guard/roles.guard';
import { UserRole } from '@prisma/client';
@Controller('patient-saves-articles')
export class PatientSavesArticlesController {
  constructor(
    private readonly patientSavesArticlesService: PatientSavesArticlesService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PATIENT)
  @Post('save')
  async saveArticle(@Body() patientSavesArticleDto: PatientSavesArticleDto) {
    return this.patientSavesArticlesService.create(patientSavesArticleDto);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PATIENT)
  @Delete('unsave')
  async unsaveArticle(@Body() patientSavesArticleDto: PatientSavesArticleDto) {
    return this.patientSavesArticlesService.remove(patientSavesArticleDto);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @Get()
  findAll() {
    return this.patientSavesArticlesService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientSavesArticlesService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
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
