import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { HospitalAdminsModule } from './hospital-admins/hospital-admins.module';
import { OperatorsModule } from './operators/operators.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { RolesModule } from './roles/roles.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    AuthModule,
    PatientsModule,
    DoctorsModule,
    HospitalAdminsModule,
    OperatorsModule,
    ConfigModule.forRoot(),
    HospitalsModule,
    RolesModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
