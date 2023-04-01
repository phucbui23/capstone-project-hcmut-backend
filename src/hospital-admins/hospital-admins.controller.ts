import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HospitalAdminsService } from './hospital-admins.service';
import { Roles } from 'src/guard/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('hospital admins')
@Controller('hospital-admins')
export class HospitalAdminsController {
  constructor(private readonly hospitalAdminsService: HospitalAdminsService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.hospitalAdminsService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hospitalAdminsService.findOne({ userAccountId: +id });
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.hospitalAdminsService.deleteOne({ operatorAccountId: +id });
  }
}
