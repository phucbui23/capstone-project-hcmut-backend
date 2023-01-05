import { Prisma } from '@prisma/client';
import { CreatePatientDto } from 'src/auth/dto/create-patient.dto';

export const PATIENTS: CreatePatientDto[] = [
  {
    phoneNumber: '0789130657',
    password: '0789130657',
  },
  {
    phoneNumber: '0902008753',
    password: '0902008753',
  },
];
