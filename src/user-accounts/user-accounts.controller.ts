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

import { Roles } from 'src/guard/roles.guard';
import {
  UpdateDoctorAccountDto,
  UpdateOperatorAccountDto,
  UpdatePasswordDto,
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
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
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
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userAccountsService.findOne({ id });
  }

  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Get('profile/:code')
  async getProfile(@Param('code') code: string) {
    return this.userAccountsService.getProfile(code);
  }

  @ApiBody({
    description: 'Update field',
    type: UpdatePasswordDto,
  })
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Patch('update-password/:code')
  async updatePassword(
    @Param('code') code: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userAccountsService.updatePassword(code, updatePasswordDto);
  }

  @ApiBody({
    description: 'Update field',
    type: UpdateOperatorAccountDto,
  })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
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
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.PATIENT)
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
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR)
  @Patch('update-doctor/:id')
  async updateDoctorAccountInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDoctorAccountDto,
  ) {
    return this.userAccountsService.updateDoctor(id, data);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userAccountsService.remove(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Patch('reset-pwd/:id')
  async resetPassword(@Param('id', ParseIntPipe) id: number) {
    return this.userAccountsService.update(id, {
      passwordHash: await this.authHelper.encodePassword(
        process.env.DEFAULT_PASSWORD,
      ),
    });
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
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
