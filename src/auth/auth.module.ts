import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { PatientsModule } from 'src/patients/patients.module';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { PatientLocalStrategy } from 'src/guard/patient/local.strategy';
import { JwtStrategy } from 'src/guard/jwt/jwt.strategy';
import { OperatorsModule } from 'src/operators/operators.module';
import { OperatorLocalStrategy } from 'src/guard/operator/local.strategy';
import { HospitalAdminsModule } from 'src/hospital-admins/hospital-admins.module';
import { AuthHelper } from './auth.helper';

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
        expiresIn: '60s',
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
