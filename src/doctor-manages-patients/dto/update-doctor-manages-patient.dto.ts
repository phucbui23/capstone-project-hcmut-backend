import { PartialType } from '@nestjs/swagger';
import { CreateDoctorManagesPatientDto } from './create-doctor-manages-patient.dto';

export class UpdateDoctorManagesPatientDto extends PartialType(
  CreateDoctorManagesPatientDto,
) {}
