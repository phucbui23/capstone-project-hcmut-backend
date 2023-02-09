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
import { MarkReminderPlanTimeDto } from './dto/mark-reminder-plan-time.dto';
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
    markReminderPlanTimeDto: MarkReminderPlanTimeDto,
  ) {
    const { reminderPlanMedicationPlanId, reminderPlanMedicationId, time } =
      markReminderPlanTimeDto;
    const updatedReminder = await this.reminderPlanTimesService.findOne({
      reminderPlanMedicationPlanId_reminderPlanMedicationId_time: {
        reminderPlanMedicationPlanId,
        reminderPlanMedicationId,
        time,
      },
    });

    if (updatedReminder.isTaken) {
      throw new BadRequestException('Reminder is already taken');
    }

    if (updatedReminder.isSkipped) {
      throw new BadRequestException('Reminder is already skipped');
    }

    return await this.reminderPlanTimesService.updateOne({
      where: {
        reminderPlanMedicationPlanId,
        reminderPlanMedicationId,
        time,
      },
      data: {
        isTaken: true,
      },
    });
  }

  @Patch('revert-reminder-plan-time')
  async revertReminderPlanTime(
    @Body()
    revertReminderPlanTimeDto: MarkReminderPlanTimeDto,
  ) {
    const { reminderPlanMedicationPlanId, reminderPlanMedicationId, time } =
      revertReminderPlanTimeDto;

    const updatedReminder = await this.reminderPlanTimesService.findOne({
      reminderPlanMedicationPlanId_reminderPlanMedicationId_time: {
        reminderPlanMedicationPlanId,
        reminderPlanMedicationId,
        time,
      },
    });

    if (!updatedReminder.isTaken) {
      throw new BadRequestException('Reminder has not been taken');
    }

    if (updatedReminder.isSkipped) {
      throw new BadRequestException('Reminder is skipped');
    }

    if (updatedReminder.isTaken) {
      return await this.reminderPlanTimesService.revertOne({
        where: {
          reminderPlanMedicationPlanId,
          reminderPlanMedicationId,
          time,
        },
      });
    }
  }
}
