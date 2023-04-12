import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PAGINATION } from 'src/constant';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Roles } from 'src/guard/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    schema: {
      default: 1,
    },
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    type: Number,
    schema: {
      default: PAGINATION.PERPAGE,
    },
  })
  @ApiQuery({
    name: 'field',
    required: true,
    type: String,
    schema: {
      default: 'createdAt',
    },
  })
  @ApiQuery({
    name: 'order',
    required: true,
    type: String,
    schema: {
      default: 'desc',
    },
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    schema: {
      default: '',
    },
  })
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Get()
  async getListArticles(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE)) perPage: number,
    @Query('field', new DefaultValuePipe('createdAt')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
    @Query('keyword', new DefaultValuePipe('')) keyword: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.articlesService.findAll(
      page,
      perPage,
      field,
      order,
      keyword,
    );
    res.set('X-Total-Count', String(result.meta.total));
    return result;
  }

  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Patch(':id')
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Delete(':id')
  async removeArticle(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PATIENT)
  @Patch()
  async saveArticle() {}

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PATIENT)
  @Patch()
  async unsaveArticle() {}
}
