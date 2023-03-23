import { Prisma } from '@prisma/client';

export type UpdateReminderPlanParams = Pick<
  Prisma.ReminderPlanUpdateArgs,
  'where' | 'data'
>;
