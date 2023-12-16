import { ExampleObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UserRole } from '@prisma/client';
import { CreateOperatorDto } from 'src/auth/dto/create-operator.dto';
import { OperatorAuthDto } from 'src/auth/dto/operator-auth.dto';

// The hospitalId must be valid
export const DOCTORS: CreateOperatorDto[] = [
  {
    firstName: 'sample',
    lastName: 'doctor',
    role: UserRole.DOCTOR,
    hospitalId: 1,
  },
  {
    firstName: 'sample',
    lastName: 'doctor',
    role: UserRole.DOCTOR,
    hospitalId: 2,
  },
];

export const DOCTORS_EXAMPLES = Object.fromEntries(
  DOCTORS.map(({ firstName, lastName }, index) => [
    `Doctor ${index + 1}`,
    {
      description: `An example account of doctor ${index + 1}`,
      value: {
        username: `${firstName}.${lastName}.${index + 1}`,
        password: `${process.env.DOCTOR_PASSWORD}`,
      } as OperatorAuthDto,
    } as ExampleObject,
  ]),
);
