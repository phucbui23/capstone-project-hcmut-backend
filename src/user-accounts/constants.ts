import { Prisma } from '@prisma/client';

export const UserAccountIncludeFields: Prisma.UserAccountInclude = {
  attachment: {
    select: {
      filePath: true,
    },
  },
  role: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
  operatorAccount: true,
  patientAccount: true,
};
