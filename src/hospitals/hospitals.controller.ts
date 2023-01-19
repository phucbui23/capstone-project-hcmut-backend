import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Hospital } from '@prisma/client';

import { HospitalsService } from './hospitals.service';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @ApiQuery({
    name: 'keyword',
    type: String,
    required: false,
  })
  @Get()
  async findAll(@Query('keyword') keyword?: string): Promise<Hospital[]> {
    return await this.hospitalsService.findAll({
      where: {
        name: {
          mode: 'insensitive',
          contains: keyword,
        },
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Hospital> {
    return await this.hospitalsService.findOne({ id: +id });
  }
}
