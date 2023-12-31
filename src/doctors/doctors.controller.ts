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
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';
import { PAGINATION } from 'src/constant';
import { Roles } from 'src/guard/roles.guard';
import { UpdateDoctorAccountDto } from 'src/user-accounts/dto/user-account.dto';
import { UserAccountsService } from 'src/user-accounts/user-accounts.service';
import { DoctorsService } from './doctors.service';

@ApiTags('doctors')
@Controller('doctors')
@ApiBearerAuth()
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly userAccountsService: UserAccountsService,
  ) {}

  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page of list',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Number of record per page',
  })
  @ApiQuery({
    name: 'field',
    required: false,
    enum: [
      'id',
      'code',
      'roleId',
      'firstName',
      'lastName',
      'updatedAt',
      'createdAt',
    ],
    type: String,
    description: 'Sorting field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['desc', 'asc'],
    type: String,
    description: 'Sorting order',
  })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get()
  @ApiQuery({name: 'page', required: false, type: Number})
  @ApiQuery({name: 'perPage', required: false, type: Number})
  @ApiQuery({name: 'field', required: false, type: String})
  @ApiQuery({name: 'order', required: false, type: String})
  @ApiQuery({name: 'keyword', required: false, type: String})
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page?: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE)) perPage?: number,
    @Query('field', new DefaultValuePipe('id')) field?: string,
    @Query('order', new DefaultValuePipe('desc')) order?: string,
    @Query('keyword', new DefaultValuePipe('')) keyword?: string,
  ) {
    return await this.doctorsService.findAll(
      page,
      perPage,
      field,
      order,
      keyword,
    );
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.doctorsService.findOne({ userAccountId: id });
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.deleteOne({ operatorAccountId: id });
  }

  @ApiBody({
    description: 'Update field',
    type: UpdateDoctorAccountDto,
  })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR)
  @Patch(':id')
  async updateDoctorAccountInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDoctorAccountDto,
  ) {
    return this.userAccountsService.updateDoctor(id, data);
  }
}
