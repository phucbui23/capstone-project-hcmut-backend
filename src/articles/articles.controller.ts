import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PAGINATION } from 'src/constant';
import { Roles } from 'src/guard/roles.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async createArticle(
    @Body('data') data: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const jsonField = JSON.parse(data);
    const createArticleDto = plainToClass(CreateArticleDto, jsonField);
    const errors = await validate(createArticleDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.articlesService.create(file, createArticleDto);
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
  ) {
    const result = await this.articlesService.findAll(
      page,
      perPage,
      field,
      order,
      keyword,
    );
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
