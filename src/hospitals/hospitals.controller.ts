import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Hospital } from '@prisma/client';
import { HospitalsService } from './hospitals.service';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get()
  async findAll(): Promise<Hospital[]> {
    return await this.hospitalsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Hospital> {
    return await this.hospitalsService.findOne({ id: +id });
  }
}
