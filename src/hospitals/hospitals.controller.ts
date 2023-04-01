import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Hospital, UserRole } from '@prisma/client';

import { Roles } from 'src/guard/roles.guard';
import { HospitalsService } from './hospitals.service';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Roles(
    UserRole.ADMIN,
    UserRole.HOSPITAL_ADMIN,
  )
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

  @Roles(
    UserRole.ADMIN,
    UserRole.HOSPITAL_ADMIN,
  )
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Hospital> {
    return await this.hospitalsService.findOne({ id: +id });
  }
}
