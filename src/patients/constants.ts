import { Prisma } from '@prisma/client';
import { roleIncludeFields } from 'src/roles/constants';

export const patientIncludeFields: Prisma.UserAccountInclude = {
  attachments: true,
  role: {
    include: roleIncludeFields,
  },
  patientAccount: {
    include: {
      doctorManagesPatients: true,
      medicationPlans: true,
      patientSavesArticles: true,
      reminderPlans: true,
    },
  },
};
