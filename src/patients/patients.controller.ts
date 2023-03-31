import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE), ParseIntPipe)
    perPage: number,
    @Query('field', new DefaultValuePipe('updatedAt')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
    @Query('keyword', new DefaultValuePipe('')) keyword: string,
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
  async findOne(
    @Param('phoneNumber') phoneNumber: string,
  ) {
    return await this.patientsService.findOne({
      phoneNumber,
    });
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
