import { Module } from '@nestjs/common';
import { DoctorManagesPatientsController } from './doctor-manages-patients.controller';
import { DoctorManagesPatientsService } from './doctor-manages-patients.service';

@Module({
  controllers: [DoctorManagesPatientsController],
  providers: [DoctorManagesPatientsService],
})
export class DoctorManagesPatientsModule {}
