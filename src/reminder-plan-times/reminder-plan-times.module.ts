import { Module } from '@nestjs/common';

import { ChatModule } from 'src/chat/chat.module';
import { MedicationPlansModule } from 'src/medication-plans/medication-plans.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReminderPlansModule } from 'src/reminder-plans/reminder-plans.module';
import { ReminderPlanTimesController } from './reminder-plan-times.controller';
import { ReminderPlanTimesService } from './reminder-plan-times.service';

@Module({
  imports: [
    PrismaModule,
    MedicationPlansModule,
    ReminderPlansModule,
    ChatModule,
  ],
  controllers: [ReminderPlanTimesController],
  providers: [ReminderPlanTimesService],
})
export class ReminderPlanTimesModule {}
