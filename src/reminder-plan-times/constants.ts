import { Prisma } from '@prisma/client';

export const reminderPlanTimeIncludeFields: Prisma.ReminderPlanTimeInclude = {
  patientAccount: false,
  reminderPlan: false,
};

export const localReminderPlanTimeIncludeFields: Prisma.LocalReminderPlanTimeInclude =
  {
    patientAccount: true,
    LocalReminderPlan: true,
  };
