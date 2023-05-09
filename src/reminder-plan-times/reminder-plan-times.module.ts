import { Module } from '@nestjs/common';

import { ReminderPlanTimesService } from './reminder-plan-times.service';
import { ReminderPlanTimesController } from './reminder-plan-times.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MedicationPlansModule } from 'src/medication-plans/medication-plans.module';
import { ReminderPlansModule } from 'src/reminder-plans/reminder-plans.module';

@Module({
  imports: [PrismaModule, MedicationPlansModule, ReminderPlansModule],
  controllers: [ReminderPlanTimesController],
  providers: [ReminderPlanTimesService],
})
export class ReminderPlanTimesModule {}
