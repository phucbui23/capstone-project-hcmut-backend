import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma, UserRole } from '@prisma/client';
import { PAGINATION } from 'src/constant';
import { CreateMedicationDto } from './dto/medications.dto';

import { Roles } from 'src/guard/roles.guard';
import { MedicationsService } from './medications.service';

@ApiTags('medications')
@Controller('medications')
@ApiBearerAuth()
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
  @Roles(
    UserRole.PATIENT,
    UserRole.DOCTOR,
    UserRole.ADMIN,
    UserRole.HOSPITAL_ADMIN,
  )
  @Get()
  @ApiQuery({name: 'page', required: false, type: Number})
  @ApiQuery({name: 'perPage', required: false, type: Number})
  @ApiQuery({name: 'field', required: false, type: String})
  @ApiQuery({name: 'order', required: false, type: String})
  @ApiQuery({name: 'keyword', required: false, type: String})
  async getListMedications(
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE)) perPage?: number,
    @Query('field', new DefaultValuePipe('updatedAt')) field?: string,
    @Query('order', new DefaultValuePipe('desc')) order?: string,
    @Query('keyword', new DefaultValuePipe('')) keyword?: string,
  ) {
    const result = await this.medicationsService.findAll(
      page,
      perPage,
      field,
      order,
      keyword,
    );
    return result;
  }

  @ApiBody({ type: CreateMedicationDto })
  @Roles(UserRole.ADMIN)
  @Post()
  async createOne(@Body() data: Prisma.MedicationCreateInput) {
    return await this.medicationsService.createOne(data);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Medication id',
  })
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicationsService.findOne({ id });
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Medication id',
  })
  @ApiBody({ type: CreateMedicationDto })
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.MedicationUpdateInput,
  ) {
    return await this.medicationsService.updateOne({
      data,
      where: { id },
    });
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Medication id',
  })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicationsService.deleteOne({ id });
  }
}
