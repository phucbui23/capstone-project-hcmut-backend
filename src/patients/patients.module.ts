import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtStrategy } from 'src/guard/jwt/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserAccountsModule } from 'src/user-accounts/user-accounts.module';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [JwtModule, PrismaModule, UserAccountsModule],
  controllers: [PatientsController],
  providers: [PatientsService, JwtStrategy, FirebaseService],
  exports: [PatientsService],
})
export class PatientsModule {}
