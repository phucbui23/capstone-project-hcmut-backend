import { Module } from '@nestjs/common';

import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HospitalsController],
  providers: [HospitalsService],
})
export class HospitalsModule {}
