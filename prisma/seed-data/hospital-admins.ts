import { ExampleObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UserRole } from '@prisma/client';

import { CreateOperatorDto } from 'src/auth/dto/create-operator.dto';
import { OperatorAuthDto } from 'src/auth/dto/operator-auth.dto';
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

export const HOSPITAL_ADMIN_EXAMPLES = Object.fromEntries(
  HOSPITAL_ADMINS.map(({ username, password }, index) => [
    `Hospital admin ${index + 1}`,
    {
      description: `An example account of hospital admin ${index + 1}`,
      value: {
        username,
        password,
      } as OperatorAuthDto,
    } as ExampleObject,
  ]),
);
