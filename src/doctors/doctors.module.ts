import { Module } from '@nestjs/common';

import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorsController],
  providers: [DoctorsService, FirebaseService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
