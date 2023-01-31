import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MedicationPlansService } from 'src/medication-plans/medication-plans.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReminderPlansService } from 'src/reminder-plans/reminder-plans.service';
import { ReminderPlanTimesSerializer } from './reminder-plan-times.serializer';

const reminderPlanTimeIncludeFields: Prisma.ReminderPlanTimeInclude = {};

function exclude<reminderPlanTime, Key extends keyof reminderPlanTime>(
  _reminderPlanTime: reminderPlanTime,
  keys: Key[],
): Omit<reminderPlanTime, Key> {
  for (let key of keys) {
    delete _reminderPlanTime[key];
  }
  return _reminderPlanTime;
}
@Injectable()
export class ReminderPlanTimesService {
  constructor(
    private readonly prismaSerivce: PrismaService,
    private readonly medicationPlansService: MedicationPlansService,
    private readonly reminderPlansService: ReminderPlansService,
  ) {}

  async findOne(where: Prisma.ReminderPlanTimeWhereUniqueInput) {
    return await this.prismaSerivce.reminderPlanTime.findUnique({ where });
  }

  async updateOne({
    where,
    data,
  }: {
    where: Prisma.ReminderPlanTimeReminderPlanMedicationPlanIdReminderPlanMedicationIdTimeCompoundUniqueInput;
    data: Prisma.ReminderPlanTimeUpdateWithoutReminderPlanInput;
  }) {
    const updatedReminderPlanTime =
      await this.prismaSerivce.reminderPlanTime.update({
        where: {
          reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
        },
        data,
      });

    const reminderPlan = await this.reminderPlansService.findOne({
      medicationPlanId_medicationId: {
        medicationId: where.reminderPlanMedicationId,
        medicationPlanId: where.reminderPlanMedicationPlanId,
      },
    });

    // Reduce pill in stock

    if (data.isTaken) {
      await this.medicationPlansService.updateOne({
        where: { id: where.reminderPlanMedicationPlanId },
        data: {
          reminderPlans: {
            update: {
              where: {
                medicationPlanId_medicationId: {
                  medicationId: where.reminderPlanMedicationId,
                  medicationPlanId: where.reminderPlanMedicationPlanId,
                },
              },
              data: {
                stock: reminderPlan.stock - updatedReminderPlanTime.dosage,
              },
            },
          },
        },
      });
    }

    return exclude(updatedReminderPlanTime, ['isTaken', 'isSkipped']);
  }

  async revertOne({
    where,
  }: {
    where: Prisma.ReminderPlanTimeReminderPlanMedicationPlanIdReminderPlanMedicationIdTimeCompoundUniqueInput;
  }) {
    const updatedReminderPlanTime =
      await this.prismaSerivce.reminderPlanTime.update({
        where: {
          reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
        },
        data: {
          isTaken: false,
        },
      });

    const reminderPlan = await this.reminderPlansService.findOne({
      medicationPlanId_medicationId: {
        medicationId: where.reminderPlanMedicationId,
        medicationPlanId: where.reminderPlanMedicationPlanId,
      },
    });

    // Revert pill in stock
    await this.medicationPlansService.updateOne({
      where: { id: where.reminderPlanMedicationPlanId },
      data: {
        reminderPlans: {
          update: {
            where: {
              medicationPlanId_medicationId: {
                medicationId: where.reminderPlanMedicationId,
                medicationPlanId: where.reminderPlanMedicationPlanId,
              },
            },
            data: {
              stock: reminderPlan.stock + updatedReminderPlanTime.dosage,
            },
          },
        },
      },
    });

    return updatedReminderPlanTime;
  }

  async deleteOne(
    where: Prisma.ReminderPlanTimeReminderPlanMedicationPlanIdReminderPlanMedicationIdTimeCompoundUniqueInput,
  ) {
    const deleteReminderPlanTime =
      await this.prismaSerivce.reminderPlanTime.delete({
        where: {
          reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
        },
      });

    const reminderPlan = await this.reminderPlansService.findOne({
      medicationPlanId_medicationId: {
        medicationId: where.reminderPlanMedicationId,
        medicationPlanId: where.reminderPlanMedicationPlanId,
      },
    });

    await this.medicationPlansService.updateOne({
      where: { id: where.reminderPlanMedicationPlanId },
      data: {
        reminderPlans: {
          update: {
            where: {
              medicationPlanId_medicationId: {
                medicationId: where.reminderPlanMedicationId,
                medicationPlanId: where.reminderPlanMedicationPlanId,
              },
            },
            data: {
              stock: reminderPlan.stock - deleteReminderPlanTime.dosage,
            },
          },
        },
      },
    });
  }
}
