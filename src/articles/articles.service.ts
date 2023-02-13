import { BadRequestException, Injectable } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';
import { PAGINATION } from 'src/constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

const paginate = createPaginator({ perPage: PAGINATION.PERPAGE });

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  async filterByKeyword(keyword: string, page: number) {
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
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          articleIncludesAttachments: true,
          updatedAt: true,
        },
      },
      {
        page,
      },
    );

    return result;
  }

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

  async findAll(page: number) {
    const result = await paginate(
      this.prismaService.article,
      {
        select: {
          id: true,
          title: true,
          articleIncludesAttachments: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
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
