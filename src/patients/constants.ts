import { Prisma } from '@prisma/client';
import { roleIncludeFields } from 'src/roles/constants';

export const patientBaseIncludeFields: Prisma.PatientAccountInclude = {
  doctorManagesPatients: true,
  medicationPlans: true,
  patientSavesArticles: true,
};

export const patientIncludeFields: Prisma.UserAccountInclude = {
  attachments: true,
  role: {
    include: roleIncludeFields,
  },
  patientAccount: {
    include: patientBaseIncludeFields,
  },
};
