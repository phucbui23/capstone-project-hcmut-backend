import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HospitalAdminsService } from './hospital-admins.service';

@ApiTags('hospital admins')
@Controller('hospital-admins')
export class HospitalAdminsController {
  constructor(private readonly hospitalAdminsService: HospitalAdminsService) {}

  @Get()
  async findAll() {
    return await this.hospitalAdminsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hospitalAdminsService.findOne({ userAccountId: +id });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.hospitalAdminsService.deleteOne({ operatorAccountId: +id });
  }
}
