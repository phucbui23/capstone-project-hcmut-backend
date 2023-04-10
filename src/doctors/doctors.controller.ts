import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
import { DoctorsService } from './doctors.service';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get()
  async findAll() {
    return await this.doctorsService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.doctorsService.findOne({ userAccountId: +id });
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.doctorsService.deleteOne({ operatorAccountId: +id });
  }
}
