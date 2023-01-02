import { Module } from '@nestjs/common';
import { HospitalAdminsService } from './hospital-admins.service';
import { HospitalAdminsController } from './hospital-admins.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HospitalAdminsController],
  providers: [HospitalAdminsService],
  exports: [HospitalAdminsService],
})
export class HospitalAdminsModule {}
