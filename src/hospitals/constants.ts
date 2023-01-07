import { Prisma } from '@prisma/client';
import { roleIncludeFields } from 'src/roles/constants';

export const hospitalIncludeFields: Prisma.HospitalInclude = {
  operatorAccounts: {
    include: {
      doctorAccount: true,
      hospitalAdminAccount: true,
    },
  },
};
