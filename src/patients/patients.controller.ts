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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PAGINATION } from 'src/constant';
import { Roles } from 'src/guard/roles.guard';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
  @Get()
  async getListPatients(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE), ParseIntPipe)
    perPage: number,
    @Query('field', new DefaultValuePipe('updatedAt')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
    @Query('keyword', new DefaultValuePipe('')) keyword: string,
  ) {
    const result = await this.patientsService.findAll(
      page,
      perPage,
      field,
      order,
      keyword,
    );
    return result;
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
  @Get('associated-patients/:doctorCode')
  async getAssociatedPatients(
    @Param('doctorCode') doctorCode: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE), ParseIntPipe)
    perPage: number,
    @Query('field', new DefaultValuePipe('updatedAt')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
  ) {
    return await this.patientsService.getAssociatedPatients(
      doctorCode,
      page,
      perPage,
      field,
      order,
    );
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
  @Get('byphone/:phoneNumber')
  async findOneByPhoneNum(@Param('phoneNumber') phoneNumber: string) {
    return await this.patientsService.findOne({
      phoneNumber,
    });
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.patientsService.findOne({
      userAccountId: +id,
    });
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.patientsService.deleteOne({ userAccountId: +id });
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
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
