import { Module } from '@nestjs/common';

import { ChatService } from 'src/chat/chat.service';
import { DoctorManagesPatientsService } from 'src/doctor-manages-patients/doctor-manages-patients.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MedicationPlansController } from './medication-plans.controller';
import { MedicationPlansService } from './medication-plans.service';

@Module({
  imports: [PrismaModule],
  controllers: [MedicationPlansController],
  providers: [
    MedicationPlansService,
    ChatService,
    DoctorManagesPatientsService,
    PrismaService,
    FirebaseService,
  ],
  exports: [MedicationPlansService],
})
export class MedicationPlansModule {}
