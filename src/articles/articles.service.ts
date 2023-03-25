import { BadRequestException, Injectable } from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { articleIncludeFields } from './constants';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    const existArticle = await this.prismaService.article.findUnique({
      where: {
        title: createArticleDto.title,
      },
    });

    if (existArticle) {
      throw new BadRequestException('Article title already existed');
    }
    const newArticle = await this.prismaService.article.create({
      data: createArticleDto,
      include: articleIncludeFields,
    });
    return newArticle;
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

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
