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
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PAGINATION } from 'src/constant';
import { CreateMedicationDto } from './dto/medications.dto';

import { MedicationsService } from './medications.service';

@ApiTags('medications')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

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
    enum: ['id', 'code', 'name', 'description', 'updatedAt', 'createdAt'],
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
    required: false,
    type: String,
    description: 'Query keyword',
  })
  @Roles(UserRole.PATIENT, UserRole.DOCTOR)
  @Get()
  async getListMedications(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = PAGINATION.PERPAGE,
    @Query('field') field: string = 'updatedAt',
    @Query('order') order: string = 'desc',
    @Query('keyword') keyword: string = '',
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.medicationsService.findAll(
      page,
      perPage,
      field,
      order,
      keyword,
    );

    res.set('X-Total-Count', String(result.meta.total));
    return result;
  }

  @ApiBody({ type: CreateMedicationDto })
  @Post('create')
  async createOne(@Body() data: Prisma.MedicationCreateInput) {
    return await this.medicationsService.createOne(data);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Medication id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicationsService.findOne({ id: +id });
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Medication id',
  })
  @ApiBody({ type: CreateMedicationDto })
  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() data: Prisma.MedicationUpdateInput,
  ) {
    return await this.medicationsService.updateOne({
      data,
      where: { id: +id },
    });
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Medication id',
  })
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return await this.medicationsService.deleteOne({ id: +id });
  }
}
