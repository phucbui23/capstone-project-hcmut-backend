import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreateMedicationPlanDto } from './dto/create-medication-plan.dto';
import { MedicationPlansService } from './medication-plans.service';

@ApiTags('medication plans')
@Controller('medication-plans')
export class MedicationPlansController {
  constructor(
    private readonly medicationPlansService: MedicationPlansService,
  ) {}

  @Get()
  @ApiQuery({
    name: 'patientId',
    required: false,
    description: "Patient's id",
  })
  async findAll(
    @Query('patientId', new DefaultValuePipe(-1), ParseIntPipe)
    patientId?: number,
  ) {
    if (patientId == -1) {
      return this.medicationPlansService.findAll({});
    }
    return this.medicationPlansService.findAll({
      where: {
        patientAccountId: {
          equals: patientId,
        },
      },
    });
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOne(
    @Body()
    createDto: CreateMedicationPlanDto,
  ) {
    // console.log(JSON.stringify(createDto, null, 2));
    return await this.medicationPlansService.createOne(createDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicationPlansService.deleteOne({ id });
  }
}
