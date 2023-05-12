import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';
import { PAGINATION } from 'src/constant';
import { Roles } from 'src/guard/roles.guard';
import { DoctorsService } from './doctors.service';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page of list',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Number of record per page',
  })
  @ApiQuery({
    name: 'field',
    required: false,
    enum: [
      'id',
      'code',
      'roleId',
      'firstName',
      'lastName',
      'updatedAt',
      'createdAt',
    ],
    type: String,
    description: 'Sorting field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['desc', 'asc'],
    type: String,
    description: 'Sorting order',
  })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE)) perPage: number,
    @Query('field', new DefaultValuePipe('id')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
  ) {
    return await this.doctorsService.findAll(page, perPage, field, order);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.doctorsService.findOne({ userAccountId: id });
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.deleteOne({ operatorAccountId: id });
  }
}
