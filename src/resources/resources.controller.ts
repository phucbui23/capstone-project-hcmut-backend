import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Resource } from '@prisma/client';
import { ResourcesService } from './resources.service';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  async findAll(): Promise<Resource[]> {
    return await this.resourcesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Resource> {
    return await this.resourcesService.findOne({ id: +id });
  }
}
