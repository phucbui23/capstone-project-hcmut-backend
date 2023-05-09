import { Prisma } from '@prisma/client';

export const hospitalIncludeFields: Prisma.HospitalInclude = {
  operatorAccounts: {
    include: {
      doctorAccount: true,
      hospitalAdminAccount: true,
    },
  },
};
