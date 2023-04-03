import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { JwtAuthGuard } from './guard/jwt/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { HospitalAdminsModule } from './hospital-admins/hospital-admins.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { MedicationPlansModule } from './medication-plans/medication-plans.module';
import { MedicationsModule } from './medications/medications.module';
import { OperatorsModule } from './operators/operators.module';
import { PatientSavesArticlesModule } from './patient-saves-articles/patient-saves-articles.module';
import { PatientsModule } from './patients/patients.module';
import { ReminderPlanTimesModule } from './reminder-plan-times/reminder-plan-times.module';
import { ReminderPlansModule } from './reminder-plans/reminder-plans.module';
import { ResourcesModule } from './resources/resources.module';
import { RolesModule } from './roles/roles.module';
import { UserAccountsModule } from './user-accounts/user-accounts.module';

@Module({
  imports: [
    AuthModule,
    PatientsModule,
    DoctorsModule,
    HospitalAdminsModule,
    OperatorsModule,
    HospitalsModule,
    RolesModule,
    ResourcesModule,
    MedicationsModule,
    MedicationPlansModule,
    ReminderPlanTimesModule,
    ReminderPlansModule,
    ConfigModule.forRoot(),
    ArticlesModule,
    PatientSavesArticlesModule,
    UserAccountsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
