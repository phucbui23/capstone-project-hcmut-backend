import { Module } from '@nestjs/common';
import { MedicationPlansService } from './medication-plans.service';
import { MedicationPlansController } from './medication-plans.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MedicationPlansController],
  providers: [MedicationPlansService],
  exports: [MedicationPlansService],
})
export class MedicationPlansModule {}
