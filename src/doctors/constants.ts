import { Prisma } from '@prisma/client';
import { roleIncludeFields } from 'src/roles/constants';

export const doctorFieldIncludes: Prisma.UserAccountInclude = {
  attachments: true,
  role: {
    include: roleIncludeFields,
  },
  operatorAccount: {
    include: {
      hospital: true,
      doctorAccount: {
        include: {
          doctorManagesPatients: true,
          medicationPlans: true,
          qualifications: true,
        },
      },
    },
  },
};
