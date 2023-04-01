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

import { UserRole } from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
import { CreateMedicationPlanDto } from './dto/create-medication-plan.dto';
import { MedicationPlansService } from './medication-plans.service';

@ApiTags('medication plans')
@Controller('medication-plans')
export class MedicationPlansController {
  constructor(
    private readonly medicationPlansService: MedicationPlansService,
  ) {}

  @ApiQuery({
    name: 'patientId',
    type: Number,
    required: false,
  })
  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  async findAll(
    @Query('patientId', new DefaultValuePipe(-1), ParseIntPipe)
    patientId: number,
  ) {
    return this.medicationPlansService.findAll({
      where: {
        AND: {
          patientAccountId: patientId === -1 ? undefined : patientId,
        },
      },
    });
  }

  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicationPlansService.findOne({ id });
  }

  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOne(
    @Body()
    createDto: CreateMedicationPlanDto,
  ) {
    return await this.medicationPlansService.createOne(createDto);
  }

  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicationPlansService.deleteOne({ id });
  }
}
