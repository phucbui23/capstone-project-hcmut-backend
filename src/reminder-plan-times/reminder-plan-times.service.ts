import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, ReminderPlanTime } from '@prisma/client';
import { MILLISECONDS_PER_DAY } from 'src/constant';

import { MedicationPlansService } from 'src/medication-plans/medication-plans.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReminderPlansService } from 'src/reminder-plans/reminder-plans.service';
import { reminderPlanTimeIncludeFields } from './constants';

@Injectable()
export class ReminderPlanTimesService {
  constructor(
    private readonly prismaSerivce: PrismaService,
    private readonly medicationPlansService: MedicationPlansService,
    private readonly reminderPlansService: ReminderPlansService,
  ) {}

  async findOne(
    where: Prisma.ReminderPlanTimeWhereUniqueInput,
  ): Promise<ReminderPlanTime> {
    return await this.prismaSerivce.reminderPlanTime.findUnique({
      where,
      include: reminderPlanTimeIncludeFields,
    });
  }

  async markOne(
    where: Prisma.ReminderPlanTimeReminderPlanMedicationPlanIdReminderPlanMedicationIdTimeCompoundUniqueInput,
  ): Promise<ReminderPlanTime> {
    const matchedReminderPlanTime =
      await this.prismaSerivce.reminderPlanTime.findUnique({
        where: {
          reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
        },
      });
    if (
      Date.now() - matchedReminderPlanTime.sentAt.getTime() >
      MILLISECONDS_PER_DAY
    ) {
      throw new BadRequestException({
        status: HttpStatus.FORBIDDEN,
        error: 'Can not modify after 24 hours',
      });
    }

    const updatedReminderPlanTime =
      await this.prismaSerivce.reminderPlanTime.update({
        where: {
          reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
        },
        data: {
          isTaken: true,
        },
        include: reminderPlanTimeIncludeFields,
      });
    const { reminderPlanMedicationId, reminderPlanMedicationPlanId } = where;
    const reminderPlan = await this.reminderPlansService.findOne({
      medicationPlanId_medicationId: {
        medicationPlanId: reminderPlanMedicationPlanId,
        medicationId: reminderPlanMedicationId,
      },
    });
    await this.reminderPlansService.updateOne({
      where: {
        medicationPlanId_medicationId: {
          medicationPlanId: reminderPlanMedicationPlanId,
          medicationId: reminderPlanMedicationId,
        },
      },
      data: {
        stock: reminderPlan.stock - updatedReminderPlanTime.dosage,
      },
    });

    return updatedReminderPlanTime;
  }

  async skipOne(
    where: Prisma.ReminderPlanTimeReminderPlanMedicationPlanIdReminderPlanMedicationIdTimeCompoundUniqueInput,
  ): Promise<ReminderPlanTime> {
    return await this.prismaSerivce.reminderPlanTime.update({
      where: {
        reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
      },
      data: {
        isSkipped: true,
      },
      include: reminderPlanTimeIncludeFields,
    });
  }

  async revertOne(
    where: Prisma.ReminderPlanTimeReminderPlanMedicationPlanIdReminderPlanMedicationIdTimeCompoundUniqueInput,
  ): Promise<ReminderPlanTime> {
    const matchedReminderPlanTime =
      await this.prismaSerivce.reminderPlanTime.findUnique({
        where: {
          reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
        },
      });
    if (
      Date.now() - matchedReminderPlanTime.sentAt.getTime() >
      MILLISECONDS_PER_DAY
    ) {
      throw new BadRequestException({
        status: HttpStatus.FORBIDDEN,
        error: 'Can not revert action after 24 hours',
      });
    }

    const updatedReminderPlanTime =
      await this.prismaSerivce.reminderPlanTime.update({
        where: {
          reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
        },
        data: {
          isTaken: false,
          isSkipped: false,
        },
        include: reminderPlanTimeIncludeFields,
      });
    const { reminderPlanMedicationId, reminderPlanMedicationPlanId } = where;
    const reminderPlan = await this.reminderPlansService.findOne({
      medicationPlanId_medicationId: {
        medicationPlanId: reminderPlanMedicationPlanId,
        medicationId: reminderPlanMedicationId,
      },
    });
    await this.reminderPlansService.updateOne({
      where: {
        medicationPlanId_medicationId: {
          medicationPlanId: reminderPlanMedicationPlanId,
          medicationId: reminderPlanMedicationId,
        },
      },
      data: {
        stock: reminderPlan.stock + updatedReminderPlanTime.dosage,
      },
    });

    return updatedReminderPlanTime;
  }

  async deleteOne(
    where: Prisma.ReminderPlanTimeReminderPlanMedicationPlanIdReminderPlanMedicationIdTimeCompoundUniqueInput,
  ): Promise<string> {
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

    return 'Deleted';
  }
}
