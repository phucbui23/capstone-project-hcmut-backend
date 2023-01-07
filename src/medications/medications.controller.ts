import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Medication, Prisma } from '@prisma/client';
import { MedicationsService } from './medications.service';

@ApiTags('medications')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Get()
  async findAll(): Promise<Medication[]> {
    return await this.medicationsService.findAll({});
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
