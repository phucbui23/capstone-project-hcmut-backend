import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('search')
  async searchArticleByKeyword(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
  ) {
    if (keyword) {
      return this.articlesService.filterByKeyword(keyword, page);
    }
    return this.articlesService.findAll(page);
  }

  @Post('create')
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  async getAllArticles(@Query('page') page: number = 1) {
    return this.articlesService.findAll(page);
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
