import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { AuthHelper } from 'src/auth/auth.helper';
import { PAGINATION } from 'src/constant';

import {
  UpdateDoctorAccountDto,
  UpdateOperatorAccountDto,
  UpdatePatientAccountDto,
} from './dto/user-account.dto';
import { UserAccountsService } from './user-accounts.service';

@ApiTags('user-accounts')
@Controller('user-accounts')
export class UserAccountsController {
  constructor(
    private readonly userAccountsService: UserAccountsService,
    private readonly authHelper: AuthHelper,
  ) {}

  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    schema: {
      default: 1,
    },
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    schema: {
      default: PAGINATION.PERPAGE,
    },
  })
  @ApiQuery({
    name: 'field',
    required: false,
    type: String,
    schema: {
      default: 'createdAt',
    },
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    schema: {
      default: 'desc',
    },
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    schema: {
      default: '',
    },
  })
  @Get()
  async getListUserAccounts(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE), ParseIntPipe)
    perPage: number,
    @Query('field', new DefaultValuePipe('createdAt')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
    @Query('keyword', new DefaultValuePipe('')) keyword: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.userAccountsService.findAll(
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userAccountsService.findOne({ id });
  }

  @ApiBody({
    description: 'Update field',
    type: UpdateOperatorAccountDto,
  })
  @Patch('update-operator/:id')
  async updateOperatorAccountInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOperatorAccountDto,
  ) {
    return this.userAccountsService.updateOperator(id, data);
  }

  @ApiBody({
    description: 'Update field',
    type: UpdatePatientAccountDto,
  })
  @Patch('update-patient/:id')
  async updatePatientAccountInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePatientAccountDto,
  ) {
    return this.userAccountsService.updatePatient(id, data);
  }

  @ApiBody({
    description: 'Update field',
    type: UpdateDoctorAccountDto,
  })
  @Patch('update-doctor/:id')
  async updateDoctorAccountInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDoctorAccountDto,
  ) {
    return this.userAccountsService.updateDoctor(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userAccountsService.remove(+id);
  }

  @Patch('reset-pwd/:id')
  async resetPassword(@Param('id', ParseIntPipe) id: number) {
    return this.userAccountsService.update(id, {
      passwordHash: await this.authHelper.encodePassword(
        process.env.DEFAULT_PASSWORD,
      ),
    });
  }

  @Patch('update-role/:id')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('newRole', ParseIntPipe) newRole: number,
  ) {
    const user = await this.findOne(id);

    if (newRole === 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Can not change to system admin role',
      });
    }

    if (user.role.name === UserRole.PATIENT) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Can not change role of patient',
      });
    }

    return await this.userAccountsService.update(id, {
      role: {
        connect: { id: newRole },
      },
    });
  }
}
