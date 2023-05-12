import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { Roles } from 'src/guard/roles.guard';
import { firebaseActivation } from './constants';
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
  @Get('report/:hospitalId')
  async systemReport(@Param('hospitalId', ParseIntPipe) hospitalId: number) {
    return await this.hospitalAdminsService.getSystemReport(hospitalId);
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

  @Roles(UserRole.HOSPITAL_ADMIN)
  @Post('activateFirebase')
  async activateFB(@Body() body: firebaseActivation) {
    return await this.hospitalAdminsService.activateFirebase(
      body.firstName,
      body.lastName,
      body.username,
      body.code,
      body.role,
    );
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.hospitalAdminsService.deleteOne({ operatorAccountId: +id });
  }
}
