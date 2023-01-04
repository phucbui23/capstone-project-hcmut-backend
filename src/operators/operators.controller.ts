import { Controller, Get } from '@nestjs/common';
import { OperatorsService } from './operators.service';

@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Get()
  async findAll() {
    return await this.operatorsService.findAll();
  }
}
