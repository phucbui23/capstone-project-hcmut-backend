import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/guard/jwt/jwt.strategy';

@Module({
  imports: [JwtModule, PrismaModule],
  controllers: [PatientsController],
  providers: [PatientsService, JwtStrategy],
  exports: [PatientsService],
})
export class PatientsModule {}
