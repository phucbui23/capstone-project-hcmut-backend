import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ReminderPlanTimesService } from './reminder-plan-times.service';

export class UpdateReminderPlanTimeDto {
  isTaken?: boolean;
  isSkipped?: boolean;
  time?: Date;
  dosage?: number;
}

@ApiTags('reminder plan times')
@Controller('reminder-plan-times')
export class ReminderPlanTimesController {
  constructor(
    private readonly reminderPlanTimesService: ReminderPlanTimesService,
  ) {}

  @Patch('mark-reminder-plan-time')
  async markReminderPlanTime(
    @Body()
    {
      reminderPlanMedicationPlanId,
      reminderPlanMedicationId,
      time,
      type,
    }: {
      reminderPlanMedicationPlanId: number;
      reminderPlanMedicationId: number;
      time: Date;
      type: string;
    },
  ) {
    const updatedReminder = await this.reminderPlanTimesService.findOne({
      reminderPlanMedicationPlanId_reminderPlanMedicationId_time: {
        reminderPlanMedicationPlanId,
        reminderPlanMedicationId,
        time,
      },
    });

    if (updatedReminder.isTaken || updatedReminder.isSkipped) {
      throw new BadRequestException('Reminder is already taken or skipped');
    }

    const data = type == 'isTaken' ? { isTaken: true } : { isSkipped: true };
    return await this.reminderPlanTimesService.updateOne({
      where: {
        reminderPlanMedicationPlanId,
        reminderPlanMedicationId,
        time,
      },
      data,
    });
  }
}
