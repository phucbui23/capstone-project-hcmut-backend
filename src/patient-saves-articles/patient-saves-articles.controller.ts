import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
import { PatientSavesArticleDto } from './dto/patient-saves-article.dto';
import { PatientSavesArticlesService } from './patient-saves-articles.service';

@ApiTags('patient-saves-articles')
@Controller('patient-saves-articles')
@ApiBearerAuth()
export class PatientSavesArticlesController {
  constructor(
    private readonly patientSavesArticlesService: PatientSavesArticlesService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  @Post('save')
  async saveArticle(@Body() patientSavesArticleDto: PatientSavesArticleDto) {
    return this.patientSavesArticlesService.create(patientSavesArticleDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  @Delete('unsave')
  async unsaveArticle(@Body() patientSavesArticleDto: PatientSavesArticleDto) {
    return this.patientSavesArticlesService.remove(patientSavesArticleDto);
  }

  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  @Get(':patientCode')
  async findAll(@Param('patientCode') patientCode: string) {
    return await this.patientSavesArticlesService.findAll(patientCode);
  }

  // @Roles(
  //   UserRole.ADMIN,
  //   UserRole.HOSPITAL_ADMIN,
  //   UserRole.DOCTOR,
  //   UserRole.PATIENT,
  // )
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.patientSavesArticlesService.findOne(+id);
  // }

  // @Roles(
  //   UserRole.ADMIN,
  //   UserRole.HOSPITAL_ADMIN,
  //   UserRole.DOCTOR,
  //   UserRole.PATIENT,
  // )
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePatientSavesArticleDto: UpdatePatientSavesArticleDto,
  // ) {
  //   return this.patientSavesArticlesService.update(
  //     +id,
  //     updatePatientSavesArticleDto,
  //   );
  // }
}
