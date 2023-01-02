import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/guard/jwt/jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [PatientsController],
  providers: [PatientsService, JwtStrategy],
  exports: [PatientsService],
})
export class PatientsModule {}
