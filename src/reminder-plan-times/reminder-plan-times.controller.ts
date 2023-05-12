import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  LocalReminderPlanTime,
  ReminderPlanTime,
  UserRole,
} from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
import { toDate } from 'src/utils/date';
import {
  MarkLocalReminderPlanTimeDto,
  MarkReminderPlanTimeDto,
} from './dto/mark-reminder-plan-time.dto';
import { ReminderPlanTimesService } from './reminder-plan-times.service';

@ApiTags('reminder plan times')
@Controller('reminder-plan-times')
export class ReminderPlanTimesController {
  constructor(
    private readonly reminderPlanTimesService: ReminderPlanTimesService,
  ) {}

  @Roles(UserRole.PATIENT, UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Patch('mark')
  async markOne(
    @Body()
    where: MarkReminderPlanTimeDto,
  ): Promise<ReminderPlanTime> {
    const existingReminderPlanTime =
      await this.reminderPlanTimesService.findOne({
        reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
      });

    if (!existingReminderPlanTime) {
      throw new BadRequestException('Reminder plan time not found');
    }

    if (existingReminderPlanTime.isTaken) {
      throw new BadRequestException(
        'Reminder plan time is already taken, revert first',
      );
    }

    if (existingReminderPlanTime.isSkipped) {
      throw new BadRequestException(
        'Reminder plan time is skipped, revert first',
      );
    }

    return await this.reminderPlanTimesService.markOne(where);
  }

  @Roles(UserRole.PATIENT, UserRole.ADMIN)
  @Patch('local/mark')
  async localMarkOne(
    @Body()
    where: MarkLocalReminderPlanTimeDto,
  ): Promise<LocalReminderPlanTime> {
    const existingReminderPlanTime =
      await this.reminderPlanTimesService.localFindOne({
        localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
          where,
      });

    if (!existingReminderPlanTime) {
      throw new BadRequestException('Reminder plan time not found');
    }

    if (existingReminderPlanTime.isTaken) {
      throw new BadRequestException(
        'Reminder plan time is already taken, revert first',
      );
    }

    if (existingReminderPlanTime.isSkipped) {
      throw new BadRequestException(
        'Reminder plan time is skipped, revert first',
      );
    }

    return await this.reminderPlanTimesService.localMarkOne(where);
  }

  @Roles(UserRole.PATIENT, UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Patch('skip')
  async skipOne(
    @Body()
    where: MarkReminderPlanTimeDto,
  ): Promise<ReminderPlanTime> {
    const existingReminderPlanTime =
      await this.reminderPlanTimesService.findOne({
        reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
      });

    if (!existingReminderPlanTime) {
      throw new BadRequestException('Reminder plan time not found');
    }

    if (existingReminderPlanTime.isSkipped) {
      throw new BadRequestException(
        'Reminder plan time is already skipped, revert first',
      );
    }

    if (existingReminderPlanTime.isTaken) {
      throw new BadRequestException(
        'Reminder plan time is taken, revert first',
      );
    }

    return await this.reminderPlanTimesService.skipOne(where);
  }

  @Roles(UserRole.PATIENT, UserRole.ADMIN)
  @Patch('local/skip')
  async localSkipOne(
    @Body()
    where: MarkLocalReminderPlanTimeDto,
  ): Promise<LocalReminderPlanTime> {
    const existingReminderPlanTime =
      await this.reminderPlanTimesService.localFindOne({
        localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
          where,
      });

    if (!existingReminderPlanTime) {
      throw new BadRequestException('Reminder plan time not found');
    }

    if (existingReminderPlanTime.isSkipped) {
      throw new BadRequestException(
        'Reminder plan time is already skipped, revert first',
      );
    }

    if (existingReminderPlanTime.isTaken) {
      throw new BadRequestException(
        'Reminder plan time is taken, revert first',
      );
    }

    return await this.reminderPlanTimesService.localSkipOne(where);
  }

  @Roles(UserRole.PATIENT, UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Patch('revert')
  async revertOne(
    @Body()
    where: MarkReminderPlanTimeDto,
  ): Promise<ReminderPlanTime> {
    const existingReminderPlanTime =
      await this.reminderPlanTimesService.findOne({
        reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
      });

    if (!existingReminderPlanTime) {
      throw new BadRequestException('Reminder plan time not found');
    }

    if (
      !existingReminderPlanTime.isTaken &&
      !existingReminderPlanTime.isSkipped
    ) {
      throw new BadRequestException('Reminder is neither taken nor skipped');
    }

    return await this.reminderPlanTimesService.revertOne(where);
  }

  @Roles(UserRole.PATIENT, UserRole.ADMIN)
  @Patch('local/revert')
  async localRevertOne(
    @Body()
    where: MarkLocalReminderPlanTimeDto,
  ): Promise<LocalReminderPlanTime> {
    const existingReminderPlanTime =
      await this.reminderPlanTimesService.localFindOne({
        localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
          where,
      });

    if (!existingReminderPlanTime) {
      throw new BadRequestException('Reminder plan time not found');
    }

    if (
      !existingReminderPlanTime.isTaken &&
      !existingReminderPlanTime.isSkipped
    ) {
      throw new BadRequestException('Reminder is neither taken nor skipped');
    }

    return await this.reminderPlanTimesService.localRevertOne(where);
  }

  @ApiQuery({
    type: String,
    name: 'start',
    required: true,
    description: 'To query reminder plan times after this date',
  })
  @ApiQuery({
    type: String,
    name: 'end',
    required: true,
    description: 'To query reminder plan times before this date',
  })
  @ApiQuery({
    type: Number,
    name: 'patientAccountId',
    required: true,
    description: 'To query reminders belonging to this patient account id',
  })
  @Get()
  @Roles(UserRole.PATIENT)
  async findAll(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('patientAccountId', ParseIntPipe) patientAccountId: number,
  ) {
    return await this.reminderPlanTimesService.findAll({
      AND: [
        {
          patientAccountId: { equals: patientAccountId },
        },
        {
          time: { gte: toDate(start) },
        },
        {
          time: { lte: toDate(end) },
        },
      ],
    });
  }
}
