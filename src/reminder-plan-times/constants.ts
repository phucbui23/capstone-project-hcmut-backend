import { Prisma } from '@prisma/client';

export const reminderPlanTimeIncludeFields: Prisma.ReminderPlanTimeInclude = {
  patientAccount: false,
  reminderPlan: false,
};
