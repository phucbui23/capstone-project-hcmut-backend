import { Prisma } from '@prisma/client';
import { roleIncludeFields } from 'src/roles/constants';

export const doctorBaseFieldIncludes: Prisma.DoctorAccountInclude = {
  doctorManagesPatients: true,
  medicationPlans: true,
  qualifications: true,
};

export const doctorFieldIncludes: Prisma.UserAccountInclude = {
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
      doctorAccount: {
        include: doctorBaseFieldIncludes,
      },
    },
  },
};
