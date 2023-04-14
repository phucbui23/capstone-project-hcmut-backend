import { Prisma } from '@prisma/client';

import { roleIncludeFields } from 'src/roles/constants';

export const operatorIncludeFields: Prisma.UserAccountInclude = {
  attachment: true,
  role: {
    include: roleIncludeFields,
  },
  operatorAccount: {
    include: {
      hospital: true,
      doctorAccount: true,
      hospitalAdminAccount: true,
    },
  },
};
