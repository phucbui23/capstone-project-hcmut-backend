import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { Roles } from 'src/guard/roles.guard';
import { SkipAuth } from 'src/guard/skip-auth.guard';
import { HospitalAdminsService } from './hospital-admins.service';

export class SystemReportDto {
  @IsNotEmpty()
  hospitalId: number;
}
@ApiTags('hospital admins')
@Controller('hospital-admins')
export class HospitalAdminsController {
  constructor(private readonly hospitalAdminsService: HospitalAdminsService) {}

  @SkipAuth()
  // @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get('system-report')
  async systemReport(@Body() systemReportDto: SystemReportDto) {
    return await this.hospitalAdminsService.getSystemReport(systemReportDto);
  }

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
