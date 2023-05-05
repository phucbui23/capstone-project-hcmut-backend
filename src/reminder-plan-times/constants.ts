import { Prisma } from '@prisma/client';

export const reminderPlanTimeIncludeFields: Prisma.ReminderPlanTimeInclude = {
  patientAccount: false,
  reminderPlan: {
    select: {
      localMedicationName: true,
      medication: {
        select: {
          name: true,
        },
      },
    },
  },
};
// TODO: Cast from type Prisma.ReminderPlanTimeSelect to plain object
// Plain object in temporarily necessary for now to type the response correctly
export const reminderPlanTimeSelectFields = {
  dosage: true,
  isSkipped: true,
  isTaken: true,
  patientAccountId: true,
  reminderPlanMedicationId: true,
  reminderPlanMedicationPlanId: true,
  sentAt: true,
  time: true,
  reminderPlan: {
    select: {
      localMedicationName: true,
      medication: {
        select: {
          name: true,
        },
      },
    },
  },
};
