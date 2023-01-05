import { UserRole } from '@prisma/client';

import { CreateOperatorDto } from 'src/auth/dto/create-operator.dto';
import { HOSPITALS } from './hospitals';

// The hospitalId must be valid
export const HOSPITAL_ADMINS: CreateOperatorDto[] = [
  {
    username: 'hospital.admin.1',
    password: '123456',
    role: UserRole.HOSPITAL_ADMIN,
    hospitalId: 1,
  },
  {
    username: 'hospital.admin.2',
    password: '123456',
    role: UserRole.HOSPITAL_ADMIN,
    hospitalId: 2,
  },
];
