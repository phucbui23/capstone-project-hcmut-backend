import { BadRequestException, Body, Controller, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReminderPlanTime } from '@prisma/client';
import { MarkReminderPlanTimeDto } from './dto/mark-reminder-plan-time.dto';
import { ReminderPlanTimesService } from './reminder-plan-times.service';

@ApiTags('reminder plan times')
@Controller('reminder-plan-times')
export class ReminderPlanTimesController {
  constructor(
    private readonly reminderPlanTimesService: ReminderPlanTimesService,
  ) {}

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
}
