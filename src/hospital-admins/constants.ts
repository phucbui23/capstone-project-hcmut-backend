import { Prisma } from '@prisma/client';
import { roleIncludeFields } from 'src/roles/constants';

export const hospitalAdminIncludeFields: Prisma.UserAccountInclude = {
  attachments: true,
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
