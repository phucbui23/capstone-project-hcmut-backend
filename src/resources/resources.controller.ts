import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Resource, UserRole } from '@prisma/client';

import { ResourcesService } from './resources.service';
import { Roles } from 'src/guard/roles.guard';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get()
  async findAll(): Promise<Resource[]> {
    return await this.resourcesService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Resource> {
    return await this.resourcesService.findOne({ id: +id });
  }
}
