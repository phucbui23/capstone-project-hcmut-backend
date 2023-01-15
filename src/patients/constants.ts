import { Prisma } from '@prisma/client';
import { medicationPlanIncludeFields } from 'src/medication-plans/medication-plans.service';
import { roleIncludeFields } from 'src/roles/constants';

export const patientBaseIncludeFields: Prisma.PatientAccountInclude = {
  doctorManagesPatients: true,
  medicationPlans: {
    include: medicationPlanIncludeFields,
  },
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
