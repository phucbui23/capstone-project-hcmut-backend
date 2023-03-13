import { BadRequestException, Injectable } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from 'src/prisma/prisma.service';
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
      select: {
        id: true,
        hospitalId: true,
        title: true,
      },
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
    const result = await paginate(
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
        select: {
          id: true,
          title: true,
          articleIncludesAttachments: true,
          updatedAt: true,
        },
        orderBy: {
          [field]: order,
        },
      },
      { page },
    );
    return result;
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
