import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
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
}
