import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll() {
    return await this.patientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.patientsService.findOne({ userAccountId: +id });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.patientsService.deleteOne({ userAccountId: +id });
  }
}
