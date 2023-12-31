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
  attachment: {
    select: {
      filePath: true,
    },
  },
  role: {
    include: roleIncludeFields,
  },
  patientAccount: {
    include: patientBaseIncludeFields,
  },
};

export const patientBaseSelectedFields: Prisma.PatientAccountSelect = {
  insuranceNumber: true,
  occupation: true,
  phoneNumber: true,
  username: true,
  doctorManagesPatients: true,
};

export const patientSelectedFields: Prisma.UserAccountSelect = {
  id: true,
  passwordHash: false,
  code: true,
  email: true,
  firstName: true,
  lastName: true,
  gender: true,
  address: true,
  socialSecurityNumber: true,
  nationality: true,
  birthday: true,
  lastActive: true,
  createdAt: true,
  updatedAt: true,
  roleId: true,
  attachment: {
    select: {
      filePath: true,
    },
  },
  operatorAccount: true,
  patientAccount: {
    select: {
      insuranceNumber: true,
      occupation: true,
      phoneNumber: true,
      medicationPlans: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export const patientList: Prisma.UserAccountSelect = {
  id: true,
  code: true,
  firstName: true,
  lastName: true,
  email: true,
  patientAccount: {
    select: {
      phoneNumber: true,
      username: true,
    },
  },
};
