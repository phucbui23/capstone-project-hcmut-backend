import { ExampleObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { Prisma } from '@prisma/client';
import { PatientAuthDto } from 'src/auth/dto/patient-auth.dto';

export const PATIENTS: PatientAuthDto[] = [
  {
    phoneNumber: '0789130657',
    password: '0789130657',
  },
  {
    phoneNumber: '0902008753',
    password: '0902008753',
  },
];

export const PATIENTS_EXAMPLES = Object.fromEntries(
  PATIENTS.map(({ phoneNumber, password }, index) => [
    `Patient ${index + 1}`,
    {
      description: `An example account of patient ${index + 1}`,
      value: {
        phoneNumber,
        password,
      } as PatientAuthDto,
    } as ExampleObject,
  ]),
);
