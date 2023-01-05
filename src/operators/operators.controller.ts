import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OperatorsService } from './operators.service';

@ApiTags('operators')
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Get()
  async findAll() {
    return await this.operatorsService.findAll();
  }
}
