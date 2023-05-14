import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { MedicationPlan, UserRole } from '@prisma/client';
import { ArrayMinSize, IsNotEmpty } from 'class-validator';
import { doc, updateDoc } from 'firebase/firestore';
import { PaginatedResult } from 'prisma-pagination';
import { ChatService } from 'src/chat/chat.service';
import { PAGINATION } from 'src/constant';
import { DoctorManagesPatientsService } from 'src/doctor-manages-patients/doctor-manages-patients.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Roles } from 'src/guard/roles.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateLocalMedicationPlanDto,
  CreateMedicationPlanDto,
} from './dto/create-medication-plan.dto';
import { MedicationPlansService } from './medication-plans.service';

export class CheckInteractionDto {
  @ApiProperty({
    description: 'Medication Id list',
    minItems: 2,
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @IsNotEmpty()
  @ArrayMinSize(2)
  medicationIdList: number[];
}

@ApiTags('medication plans')
@Controller('medication-plans')
export class MedicationPlansController {
  constructor(
    private readonly medicationPlansService: MedicationPlansService,
    private readonly doctorManagesPatientsService: DoctorManagesPatientsService,
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
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

  @ApiQuery({
    name: 'patientId',
    type: Number,
    required: false,
  })
  @Get('patient-find-all')
  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  async patientFindAll(
    @Query('patientId', new DefaultValuePipe(-1), ParseIntPipe)
    patientId: number,
  ): Promise<MedicationPlan[]> {
    return await this.medicationPlansService.patientFindAll(
      patientId === -1 ? undefined : patientId,
    );
  }

  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Get('report/:medicationPlanId')
  async medicationPlanReport(
    @Param('medicationPlanId', ParseIntPipe) medicationPlanId: number,
  ) {
    return await this.medicationPlansService.getPatientReport({
      id: medicationPlanId,
    });
  }

  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  @Get('local/report/:medicationPlanId')
  async localMedicationPlanReport(
    @Param('medicationPlanId', ParseIntPipe) medicationPlanId: number,
  ) {
    return await this.medicationPlansService.getLocalPatientReport({
      id: medicationPlanId,
    });
  }

  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Get('check-interaction')
  async checkInteraction(@Body() data: CheckInteractionDto) {
    const medicationCodeList = [];
    for (const medicationId of data.medicationIdList) {
      const medication = await this.prismaService.medication.findUnique({
        where: { id: medicationId },
      });
      if (!medication) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: `Error with finding medication id ${medicationId}`,
        });
      }
      medicationCodeList.push(medication.code);
    }

    const reactions = await this.medicationPlansService.checkInteractions(
      medicationCodeList,
    );

    return { reactions };
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
  @Get('associated-med-plans/:doctorCode')
  async getAssociatedMedicationPlans(
    @Param('doctorCode') doctorCode: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(PAGINATION.PERPAGE), ParseIntPipe)
    perPage: number,
    @Query('field', new DefaultValuePipe('updatedAt')) field: string,
    @Query('order', new DefaultValuePipe('desc')) order: string,
  ) {
    return await this.medicationPlansService.getAssociatedMedicationPlans(
      doctorCode,
      page,
      perPage,
      field,
      order,
    );
  }

  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicationPlansService.findOne({ id });
  }

  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
  @Post('/upload/:medicationPlanId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBill(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10240000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('medicationPlanId', ParseIntPipe) medicationPlanId: number,
  ) {
    return await this.medicationPlansService.uploadMedicationPlanBill(
      file,
      medicationPlanId,
    );
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

        // update room name on firebase
        await updateDoc(
          doc(this.firebaseService.firestoreRef, 'rooms', conversation.roomId),
          {
            name: medicationPlan.name,
          },
        );

        // Update room id and countTotal
        let total: number = 0;
        const { reminderPlans, id } = medicationPlan;

        for (const reminderPlan of reminderPlans) {
          total += reminderPlan.stock;
        }

        await this.prismaService.medicationPlan.update({
          where: {
            id,
          },
          data: {
            roomId: conversation.roomId,
            countTotal: total,
          },
        });

        const ret = { ...medicationPlan, roomId: conversation.roomId };
        return ret;
      } else {
        const medicationPlan = await this.medicationPlansService.createOne(
          createDto,
        );

        // Update countTotal
        const { reminderPlans, id } = medicationPlan;
        let total: number = 0;

        for (const reminderPlan of reminderPlans) {
          total += reminderPlan.stock;
        }

        await this.prismaService.medicationPlan.update({
          where: {
            id,
          },
          data: {
            countTotal: total,
          },
        });

        return medicationPlan;
      }
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  }

  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  @Post('local/:patientCode')
  async addLocalMed(
    @Param('patientCode') patientCode: string,
    @Body()
    createDto: CreateLocalMedicationPlanDto,
  ) {
    try {
      const { localReminderPlans, patientId } = createDto;

      // get patient uncompleted medication plans prescribed by doctor
      const uncompletedMedicationPlans =
        await this.prismaService.medicationPlan.findMany({
          where: {
            patientAccountId: patientId,
            doctorAccountId: {
              not: null,
            },
            completed: false,
          },
          select: {
            id: true,
            doctorAccountId: true,
            roomId: true,
          },
        });

      // Alert all doctors prescribes unfinished medication plan
      for (const medicationPlan of uncompletedMedicationPlans) {
        await this.chatService.sendMsg(
          `I'm adding a new drug called ${localReminderPlans[0].localMedicationName} into medication plan ${medicationPlan.id}.\n
          Could you please check if this has any reactions with my current medicines.`,
          patientCode,
          medicationPlan.roomId,
        );
      }
      const medicationPlan = await this.medicationPlansService.createLocalOne(
        createDto,
      );

      // Update countTotal
      const { reminderPlans, id } = medicationPlan;
      let total: number = 0;

      for (const reminderPlan of reminderPlans) {
        total += reminderPlan.stock;
      }

      await this.prismaService.medicationPlan.update({
        where: {
          id,
        },
        data: {
          countTotal: total,
        },
      });
      return medicationPlan;
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
