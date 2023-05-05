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
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { MedicationPlan, UserRole } from '@prisma/client';
import { PaginatedResult } from 'prisma-pagination';
import { ChatService } from 'src/chat/chat.service';
import { PAGINATION } from 'src/constant';
import { DoctorManagesPatientsService } from 'src/doctor-manages-patients/doctor-manages-patients.service';
import { Roles } from 'src/guard/roles.guard';
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page of list',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Number of record per page',
  })
  @ApiQuery({
    name: 'field',
    required: false,
    enum: [
      'id',
      'name',
      'doctorAccountId',
      'patientAccountId',
      'updatedAt',
      'createdAt',
    ],
    type: String,
    description: 'Sorting field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['desc', 'asc'],
    type: String,
    description: 'Sorting order',
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
    @Query('page', new DefaultValuePipe(1))
    page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE)) perPage: number,
    @Query('field', new DefaultValuePipe('id')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
  ): Promise<PaginatedResult<MedicationPlan>> {
    return this.medicationPlansService.findAll(page, perPage, field, order, {
      where: {
        AND: [
          {
            patientAccountId: patientId === -1 ? undefined : patientId,
          },
        ],
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
    try {
      const { doctorId, patientId } = createDto;

      if (doctorId) {
        // pre-process: check and create management
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

        const ret = { ...medicationPlan, roomId: conversation.roomId };
        return ret;
      } else {
        return await this.medicationPlansService.createOne(createDto);
      }
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
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
