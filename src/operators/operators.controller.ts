import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
import { UpdateOperatorAccountDto } from 'src/user-accounts/dto/user-account.dto';
import { UserAccountsService } from 'src/user-accounts/user-accounts.service';
import { OperatorsService } from './operators.service';

@ApiTags('operators')
@Controller('operators')
@ApiBearerAuth()
export class OperatorsController {
  constructor(
    private readonly operatorsService: OperatorsService,
    private readonly userAccountsService: UserAccountsService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.operatorsService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.operatorsService.findOne({ userAccountId: id });
  }

  @ApiBody({
    description: 'Update field',
    type: UpdateOperatorAccountDto,
  })
  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Patch(':id')
  async updateOperatorAccountInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOperatorAccountDto,
  ) {
    return this.userAccountsService.updateOperator(id, data);
  }
}
