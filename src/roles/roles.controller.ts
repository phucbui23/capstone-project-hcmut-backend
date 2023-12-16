import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, UserRole } from '@prisma/client';

import { Roles } from 'src/guard/roles.guard';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get()
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return await this.rolesService.findOne({ id });
  }
}
