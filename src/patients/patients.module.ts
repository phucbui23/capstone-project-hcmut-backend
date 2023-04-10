import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtStrategy } from 'src/guard/jwt/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [JwtModule, PrismaModule],
  controllers: [PatientsController],
  providers: [PatientsService, JwtStrategy, FirebaseService],
  exports: [PatientsService],
})
export class PatientsModule {}
