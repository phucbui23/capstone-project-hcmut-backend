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

import { ChatService } from 'src/chat/chat.service';
import { DoctorManagesPatientsService } from 'src/doctor-manages-patients/doctor-manages-patients.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicationPlanDto } from './dto/create-medication-plan.dto';
import { MedicationPlansService } from './medication-plans.service';

@ApiTags('medication plans')
@Controller('medication-plans')
export class MedicationPlansController {
  constructor(
    private readonly medicationPlansService: MedicationPlansService,
    private readonly doctorManagesPatientsService: DoctorManagesPatientsService,
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiQuery({
    name: 'patientId',
    type: Number,
    required: false,
  })
  @Get()
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicationPlansService.findOne({ id });
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOne(
    @Body()
    createDto: CreateMedicationPlanDto,
  ) {
    // pre-process: check and create management
    const { doctorId, patientId } = createDto;
    await this.doctorManagesPatientsService.create({ doctorId, patientId });

    const medicationPlan = await this.medicationPlansService.createOne(
      createDto,
    );

    // post: create conversation between doctor and patient about this medication plan
    const doctor = await this.prismaService.userAccount.findUnique({
      where: { id: doctorId },
    });
    const patient = await this.prismaService.userAccount.findUnique({
      where: { id: patientId },
    });
    const conversation = await this.chatService.createRoom(
      patient.code,
      doctor.code,
    );

    medicationPlan['roomId'] = conversation.roomId;

    return medicationPlan;
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicationPlansService.deleteOne({ id });
  }
}
