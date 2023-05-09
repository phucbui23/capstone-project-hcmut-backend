import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';

import { DoctorsModule } from 'src/doctors/doctors.module';
import { JwtStrategy } from 'src/guard/jwt/jwt.strategy';
import { OperatorLocalStrategy } from 'src/guard/operator/local.strategy';
import { PatientLocalStrategy } from 'src/guard/patient/local.strategy';
import { HospitalAdminsModule } from 'src/hospital-admins/hospital-admins.module';
import { OperatorsModule } from 'src/operators/operators.module';
import { PatientsModule } from 'src/patients/patients.module';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    PatientsModule,
    DoctorsModule,
    PassportModule,
    OperatorsModule,
    HospitalAdminsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRES_IN || '10 mins',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    PatientLocalStrategy,
    OperatorLocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
