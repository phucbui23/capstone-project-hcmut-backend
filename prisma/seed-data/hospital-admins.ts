import { ExampleObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UserRole } from '@prisma/client';

import { CreateOperatorDto } from 'src/auth/dto/create-operator.dto';
import { OperatorAuthDto } from 'src/auth/dto/operator-auth.dto';

// The hospitalId must be valid
export const HOSPITAL_ADMINS: CreateOperatorDto[] = [
  {
    firstName: 'hospital',
    lastName: 'admin',
    role: UserRole.HOSPITAL_ADMIN,
    hospitalId: 1,
  },
  {
    firstName: 'hospital',
    lastName: 'admin',
    role: UserRole.HOSPITAL_ADMIN,
    hospitalId: 2,
  },
];

export const HOSPITAL_ADMIN_EXAMPLES = Object.fromEntries(
  HOSPITAL_ADMINS.map(({ firstName, lastName }, index) => [
    `Hospital admin ${index + 1}`,
    {
      description: `An example account of hospital admin ${index + 1}`,
      value: {
        username: `${firstName}.${lastName}.${index + 1}`,
        password: `${process.env.HOSPITAL_ADMIN_PASSWORD}`
      } as OperatorAuthDto,
    } as ExampleObject,
  ]),
);
