import { Module } from '@nestjs/common';
import { ReminderPlansService } from './reminder-plans.service';
import { ReminderPlansController } from './reminder-plans.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MedicationPlansModule } from 'src/medication-plans/medication-plans.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReminderPlansController],
  providers: [ReminderPlansService],
  exports: [ReminderPlansService],
})
export class ReminderPlansModule {}
