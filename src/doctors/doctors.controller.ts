import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async findAll() {
    return await this.doctorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.doctorsService.findOne({ userAccountId: +id });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.doctorsService.deleteOne({ operatorAccountId: +id });
  }
}
