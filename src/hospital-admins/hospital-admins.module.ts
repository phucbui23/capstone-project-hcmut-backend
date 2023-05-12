import { Module } from '@nestjs/common';

import { HospitalAdminsService } from './hospital-admins.service';
import { HospitalAdminsController } from './hospital-admins.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [PrismaModule],
  controllers: [HospitalAdminsController],
  providers: [HospitalAdminsService, FirebaseService],
  exports: [HospitalAdminsService],
})
export class HospitalAdminsModule {}
