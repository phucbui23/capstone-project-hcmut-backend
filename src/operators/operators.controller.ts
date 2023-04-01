import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OperatorsService } from './operators.service';
import { Roles } from 'src/guard/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('operators')
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.operatorsService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.operatorsService.findOne({ userAccountId: +id });
  }
}
