import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PatientsService } from './patients.service';

@ApiTags('patients')
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

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body()
    {
      address,
      email,
      insuranceNumber,
    }: { insuranceNumber: string; email: string; address: string },
  ) {
    return await this.patientsService.updateOne({
      where: { id: +id },
      data: {
        address,
        email,
        patientAccount: { update: { insuranceNumber } },
      },
    });
  }
}
