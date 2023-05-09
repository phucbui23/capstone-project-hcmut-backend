import { Module } from '@nestjs/common';

import { ReminderPlansService } from './reminder-plans.service';
import { ReminderPlansController } from './reminder-plans.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReminderPlansController],
  providers: [ReminderPlansService],
  exports: [ReminderPlansService],
})
export class ReminderPlansModule {}
