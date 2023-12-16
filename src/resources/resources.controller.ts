import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Resource, UserRole } from '@prisma/client';

import { Roles } from 'src/guard/roles.guard';
import { ResourcesService } from './resources.service';

@ApiTags('resources')
@Controller('resources')
@ApiBearerAuth()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get()
  async findAll(): Promise<Resource[]> {
    return await this.resourcesService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Resource> {
    return await this.resourcesService.findOne({ id });
  }
}
