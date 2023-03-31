import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Medication, Prisma, UserRole } from '@prisma/client';
import { Roles, RolesGuard } from 'src/guard/roles.guard';

import { MedicationsService } from './medications.service';

@ApiTags('medications')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
  })
  @Roles(UserRole.PATIENT, UserRole.DOCTOR)
  @Get()
  async findAll(@Query('keyword') keyword?: string): Promise<Medication[]> {
    return await this.medicationsService.findAll({
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Medication> {
    return await this.medicationsService.findOne({ id: +id });
  }

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

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<Medication> {
    return await this.medicationsService.deleteOne({ id: +id });
  }
}
