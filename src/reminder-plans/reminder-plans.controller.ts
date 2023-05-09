import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ReminderPlansService } from './reminder-plans.service';

@ApiTags('reminder plans')
@Controller('reminder-plans')
export class ReminderPlansController {
  constructor(private readonly reminderPlansService: ReminderPlansService) {}
}
