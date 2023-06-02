import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientSavesArticleDto } from './dto/patient-saves-article.dto';
import { UpdatePatientSavesArticleDto } from './dto/update-patient-saves-article.dto';

@Injectable()
export class PatientSavesArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(patientSavesArticleDto: PatientSavesArticleDto) {
    return this.prismaService.patientSavesArticle.create({
      data: patientSavesArticleDto,
    });
  }

  async remove(patientSavesArticleDto: PatientSavesArticleDto) {
    const article = await this.prismaService.patientSavesArticle.findUnique({
      where: {
        patientAccountId_articleId: {
          patientAccountId: patientSavesArticleDto.patientAccountId,
          articleId: patientSavesArticleDto.articleId,
        },
      },
    });

    if (!article) {
      throw new BadRequestException('Patient has not save article');
    }

    return this.prismaService.patientSavesArticle.delete({
      where: {
        patientAccountId_articleId: {
          patientAccountId: patientSavesArticleDto.patientAccountId,
          articleId: patientSavesArticleDto.articleId,
        },
      },
    });
  }

  async findAll(patientCode: string) {
    return await this.prismaService.patientSavesArticle.findMany({
      where: {
        patientAccount: {
          userAccount: {
            code: patientCode,
          },
        },
      },
      include: {
        article: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} patientSavesArticle`;
  }

  update(
    id: number,
    updatePatientSavesArticleDto: UpdatePatientSavesArticleDto,
  ) {
    return `This action updates a #${id} patientSavesArticle`;
  }
}
