import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserRole } from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
import { OperatorsService } from './operators.service';

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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.operatorsService.findOne({ userAccountId: id });
  }
}
