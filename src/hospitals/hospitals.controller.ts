import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Hospital, UserRole } from '@prisma/client';

import { Roles } from 'src/guard/roles.guard';
import { HospitalsService } from './hospitals.service';
import { PAGINATION } from 'src/constant';
import { PaginatedResult } from 'prisma-pagination';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
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
      'name',
      'doctorAccountId',
      'patientAccountId',
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
  @ApiQuery({
    name: 'keyword',
    type: String,
    required: false,
  })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE)) perPage: number,
    @Query('field', new DefaultValuePipe('id')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
    @Query('keyword') keyword?: string,
  ): Promise<PaginatedResult<Hospital>> {
    return await this.hospitalsService.findAll(page, perPage, field, order, {
      where: {
        name: {
          mode: 'insensitive',
          contains: keyword,
        },
      },
    });
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Hospital> {
    return await this.hospitalsService.findOne({ id: +id });
  }
}
