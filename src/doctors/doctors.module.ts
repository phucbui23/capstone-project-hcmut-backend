import { Module } from '@nestjs/common';

import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
