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
