import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PAGINATION } from 'src/constant';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async getListPatients(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = PAGINATION.PERPAGE,
    @Query('field') field: string = 'updatedAt',
    @Query('order') order: string = 'desc',
    @Query('keyword') keyword: string = '',
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.patientsService.findAll(
      page,
      perPage,
      field,
      order,
      keyword,
    );
    res.set('X-Total-Count', String(result.meta.total));
    return result;
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
