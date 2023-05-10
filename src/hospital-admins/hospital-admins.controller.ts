import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { Roles } from 'src/guard/roles.guard';
import { HospitalAdminsService } from './hospital-admins.service';

export class SystemReportDto {
  @ApiProperty({
    description: 'Hospital id',
  })
  @IsNotEmpty()
  hospitalId: number;
}
@ApiTags('hospital admins')
@Controller('hospital-admins')
export class HospitalAdminsController {
  constructor(private readonly hospitalAdminsService: HospitalAdminsService) {}

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get('report')
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
