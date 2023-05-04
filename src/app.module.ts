import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AuthModule } from './auth/auth.module';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { DoctorManagesPatientsModule } from './doctor-manages-patients/doctor-manages-patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { FirebaseService } from './firebase/firebase.service';
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
import { LastActiveMiddleware } from './middleware/LastActiveMiddleware';
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
    AttachmentsModule,
    DoctorManagesPatientsModule,
    ChatModule,
  ],
  controllers: [AppController, ChatController],
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
    FirebaseService,
  ],
})
// export class AppModule {}
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LastActiveMiddleware).forRoutes('*');
  }
}
