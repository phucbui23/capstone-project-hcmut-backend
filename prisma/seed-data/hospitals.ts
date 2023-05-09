import { Prisma } from '@prisma/client';

export const HOSPITALS: Prisma.HospitalCreateManyInput[] = [
  {
    name: 'Tan Phu District Hospital',
    description: '609-611 Au Co street, Phu Trung Ward, Tan Phu District, HCMC',
  },
  {
    name: 'Perfect Hospital',
    description: '27 Ky Dong street, Ward 9, District 3, HCMC',
  },
];
