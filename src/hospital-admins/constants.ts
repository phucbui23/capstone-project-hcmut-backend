import { Prisma } from '@prisma/client';

import { roleIncludeFields } from 'src/roles/constants';

export const hospitalAdminIncludeFields: Prisma.UserAccountInclude = {
  attachment: {
    select: {
      filePath: true,
    },
  },
  role: {
    include: roleIncludeFields,
  },
  operatorAccount: {
    include: {
      hospital: true,
      hospitalAdminAccount: true,
    },
  },
};

export type firebaseActivation = {
  code: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'DOCTOR' | 'HOSPITAL_ADMIN';
};
