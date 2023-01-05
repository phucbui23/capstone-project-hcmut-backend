import { UserRole } from '@prisma/client';
import { CreateOperatorDto } from 'src/auth/dto/create-operator.dto';

// The hospitalId must be valid
export const DOCTORS: CreateOperatorDto[] = [
  {
    username: 'sample.doctor.1',
    password: '123456',
    role: UserRole.DOCTOR,
    hospitalId: 1,
  },
  {
    username: 'sample.doctor.2',
    password: '123456',
    role: UserRole.DOCTOR,
    hospitalId: 2,
  },
];
