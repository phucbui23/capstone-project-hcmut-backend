import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PAGINATION } from 'src/constant';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('create')
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  async getListArticles(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = PAGINATION.PERPAGE,
    @Query('field') field: string = 'createdAt',
    @Query('order') order: string = 'desc',
    @Query('keyword') keyword: string = '',
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  async removeArticle(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @Patch()
  async saveArticle() {}

  @Patch()
  async unsaveArticle() {}
}
