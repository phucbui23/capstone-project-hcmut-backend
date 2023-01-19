import { ExampleObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UserRole } from '@prisma/client';
import { CreateOperatorDto } from 'src/auth/dto/create-operator.dto';
import { OperatorAuthDto } from 'src/auth/dto/operator-auth.dto';

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

export const DOCTORS_EXAMPLES = Object.fromEntries(
  DOCTORS.map(({ username, password }, index) => [
    `Doctor ${index + 1}`,
    {
      description: `An example account of doctor ${index + 1}`,
      value: {
        username,
        password,
      } as OperatorAuthDto,
    } as ExampleObject,
  ]),
);
