import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { articleIncludeFields } from './constants';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  async create(file: Express.Multer.File, createArticleDto: CreateArticleDto) {
    const { content, hospitalId, tags, title } = createArticleDto;
    const articleTags = [];
    const newArticleIncludesTag = [];

    if (
      await this.prismaService.article.findFirst({
        where: {
          title: {
            equals: title,
            mode: 'insensitive',
          },
        },
      })
    ) {
      throw new BadRequestException('Article title already existed');
    } else {
      // Create article tags
      for (const tag of tags) {
        const existedTag = await this.prismaService.tag.findFirst({
          where: {
            name: {
              contains: tag,
              mode: 'insensitive',
            },
          },
        });
        if (existedTag) {
          articleTags.push(existedTag);
        } else {
          articleTags.push(
            await this.prismaService.tag.create({
              data: {
                name: tag,
              },
            }),
          );
        }
      }

      const articleAttachment =
        await this.attachmentsService.uploadArticleAttachment(file);

      // Create new article
      const newArticle = await this.prismaService.article.create({
        data: {
          title,
          content,
          hospitalId,
          attachment: {
            connect: {
              id: articleAttachment.id,
            },
          },
        },
      });

      // create articleIncludesTag for each tags and newArticle
      for (const articleTag of articleTags) {
        newArticleIncludesTag.push(
          await this.prismaService.articleIncludesTag.create({
            data: {
              articleId: newArticle.id,
              tagId: articleTag.id,
            },
          }),
        );
      }

      return await this.prismaService.article.findUnique({
        where: {
          id: newArticle.id,
        },
        include: articleIncludeFields,
      });
    }
  }

  async findAll(
    page: number,
    perPage: number,
    field: string,
    order: string,
    keyword: string,
  ) {
    const paginate = createPaginator({ perPage });
    if (keyword.length > 0) {
      return await paginate<Article, Prisma.ArticleFindManyArgs>(
        this.prismaService.article,
        {
          where: {
            OR: [
              {
                title: {
                  contains: keyword,
                },
              },
              {
                content: {
                  contains: keyword,
                },
              },
            ],
          },
          include: articleIncludeFields,
          orderBy: {
            [field]: order,
          },
        },
        { page },
      );
    }

    return await paginate<Article, Prisma.ArticleFindManyArgs>(
      this.prismaService.article,
      {
        orderBy: {
          [field]: order,
        },
        include: articleIncludeFields,
      },
      { page },
    );
  }

  async findOne(id: number) {
    return await this.prismaService.article.findUnique({
      where: {
        id,
      },
      include: articleIncludeFields,
    });
  }

  async recommendArticles(patientAccountId: number) {
    const medicationPlan = await this.prismaService.medicationPlan.findFirst({
      where: {
        patientAccountId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!medicationPlan) {
      return {
        message: 'No medication plan prescribed by doctor',
      };
    }

    const reminders = await this.prismaService.reminderPlan.findMany({
      where: {
        medicationPlanId: medicationPlan.id,
      },
      select: {
        medication: true,
      },
    });

    const retArticles = [];

    reminders.forEach(async (reminder) => {
      console.log(reminder);
      const articles = await this.prismaService.article.findMany({
        where: {
          articleIncludesTags: {
            every: {
              tag: {
                id: reminder.medication.id,
              },
            },
          },
        },
        include: articleIncludeFields,
      });
      console.log(articles);
    });

    return { retArticles };
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const { content, hospitalId, tags, title } = updateArticleDto;
    return await this.prismaService.article.update({
      where: {
        id,
      },
      data: {
        content,
        hospitalId,
        title,
      },
      include: articleIncludeFields,
    });
  }

  async remove(id: number) {
    await this.prismaService.article.delete({
      where: {
        id,
      },
    });
    return 'Delete successfully';
  }

  async saveArticle(articleId: number, patientAccountId: number) {
    try {
      const article = await this.prismaService.article.findFirst({
        where: {
          id: articleId,
        },
      });

      const patient = await this.prismaService.patientAccount.findFirst({
        where: {
          userAccountId: patientAccountId,
        },
      });

      if (!article || !patient) {
        return {
          message: 'Save article unsuccessfully',
        };
      }
      await this.prismaService.patientSavesArticle.create({
        data: {
          article: {
            connect: {
              id: article.id,
            },
          },
          patientAccount: {
            connect: {
              userAccountId: patient.userAccountId,
            },
          },
        },
      });

      return {
        message: 'Save article successfully',
      };
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Save article unsuccessfully.',
      });
    }
  }

  async unsaveArticle(articleId: number, patientAccountId: number) {
    try {
      await this.prismaService.patientSavesArticle.delete({
        where: {
          patientAccountId_articleId: {
            articleId,
            patientAccountId,
          },
        },
      });
      return {
        message: 'Unsave article successfully',
      };
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Unsave article unsuccessfully.',
      });
    }
  }
}
