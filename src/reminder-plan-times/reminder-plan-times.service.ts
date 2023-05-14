import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  LocalReminderPlanTime,
  Prisma,
  ReminderPlanTime,
} from '@prisma/client';
import { MILLISECONDS_PER_DAY } from 'src/constant';

import { MedicationPlansService } from 'src/medication-plans/medication-plans.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReminderPlansService } from 'src/reminder-plans/reminder-plans.service';
import {
  localReminderPlanTimeIncludeFields,
  reminderPlanTimeIncludeFields,
  reminderPlanTimeSelectFields,
} from './constants';

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

  async localFindOne(
    where: Prisma.LocalReminderPlanTimeWhereUniqueInput,
  ): Promise<LocalReminderPlanTime> {
    return await this.prismaSerivce.localReminderPlanTime.findUnique({
      where,
      include: localReminderPlanTimeIncludeFields,
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

    const reminderPlan = await this.prismaSerivce.reminderPlan.findUnique({
      where: {
        medicationPlanId_medicationId: {
          medicationPlanId: where.reminderPlanMedicationPlanId,
          medicationId: where.reminderPlanMedicationId,
        },
      },
    });

    // Update stock
    await this.prismaSerivce.reminderPlan.update({
      where: {
        medicationPlanId_medicationId: {
          medicationPlanId: where.reminderPlanMedicationPlanId,
          medicationId: where.reminderPlanMedicationId,
        },
      },
      data: {
        stock: reminderPlan.stock - updatedReminderPlanTime.dosage,
      },
      select: {
        stock: true,
      },
    });

    // Update countTaken
    const medicationPlan = await this.prismaSerivce.medicationPlan.update({
      where: {
        id: where.reminderPlanMedicationPlanId,
      },
      data: {
        countTaken: {
          increment: updatedReminderPlanTime.dosage,
        },
      },
      select: {
        countTotal: true,
        countTaken: true,
        countSkipped: true,
      },
    });

    // update completed
    if (
      medicationPlan.countTotal ==
      medicationPlan.countSkipped + medicationPlan.countTaken
    ) {
      await this.prismaSerivce.medicationPlan.update({
        where: {
          id: where.reminderPlanMedicationPlanId,
        },
        data: { completed: true },
      });
    }

    return updatedReminderPlanTime;
  }

  async localMarkOne(
    where: Prisma.LocalReminderPlanTimeLocalReminderPlanMedicationPlanIdLocalReminderPlanLocalMedicationNameTimeCompoundUniqueInput,
  ): Promise<LocalReminderPlanTime> {
    const matchedLocalReminderPlanTime =
      await this.prismaSerivce.localReminderPlanTime.findUnique({
        where: {
          localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
            where,
        },
      });
    if (
      Date.now() - matchedLocalReminderPlanTime.sentAt.getTime() >
      MILLISECONDS_PER_DAY
    ) {
      throw new BadRequestException({
        status: HttpStatus.FORBIDDEN,
        error: 'Can not modify after 24 hours',
      });
    }

    const updatedLocalReminderPlanTime =
      await this.prismaSerivce.localReminderPlanTime.update({
        where: {
          localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
            where,
        },
        data: {
          isTaken: true,
        },
        include: localReminderPlanTimeIncludeFields,
      });

    const localReminderPlan =
      await this.prismaSerivce.localReminderPlan.findUnique({
        where: {
          medicationPlanId_localMedicationName: {
            medicationPlanId: where.localReminderPlanMedicationPlanId,
            localMedicationName: where.localReminderPlanLocalMedicationName,
          },
        },
      });

    // Update stock
    await this.prismaSerivce.localReminderPlan.update({
      where: {
        medicationPlanId_localMedicationName: {
          medicationPlanId: where.localReminderPlanMedicationPlanId,
          localMedicationName: where.localReminderPlanLocalMedicationName,
        },
      },
      data: {
        stock: localReminderPlan.stock - updatedLocalReminderPlanTime.dosage,
      },
      select: {
        stock: true,
      },
    });

    // Update countTaken
    const medicationPlan = await this.prismaSerivce.medicationPlan.update({
      where: {
        id: where.localReminderPlanMedicationPlanId,
      },
      data: {
        countTaken: {
          increment: updatedLocalReminderPlanTime.dosage,
        },
      },
      select: {
        countTotal: true,
        countTaken: true,
        countSkipped: true,
      },
    });

    // update completed
    if (
      medicationPlan.countTotal ==
      medicationPlan.countSkipped + medicationPlan.countTaken
    ) {
      await this.prismaSerivce.medicationPlan.update({
        where: {
          id: where.localReminderPlanMedicationPlanId,
        },
        data: { completed: true },
      });
    }

    return updatedLocalReminderPlanTime;
  }

  async skipOne(
    where: Prisma.ReminderPlanTimeReminderPlanMedicationPlanIdReminderPlanMedicationIdTimeCompoundUniqueInput,
  ): Promise<ReminderPlanTime> {
    const updatedReminderPlanTime =
      await this.prismaSerivce.reminderPlanTime.update({
        where: {
          reminderPlanMedicationPlanId_reminderPlanMedicationId_time: where,
        },
        data: {
          isSkipped: true,
        },
        include: reminderPlanTimeIncludeFields,
      });
    // Update countSkipped
    const medicationPlan = await this.prismaSerivce.medicationPlan.update({
      where: {
        id: where.reminderPlanMedicationPlanId,
      },
      data: {
        countSkipped: {
          increment: updatedReminderPlanTime.dosage,
        },
      },
      select: {
        countTotal: true,
        countTaken: true,
        countSkipped: true,
      },
    });

    // update completed
    if (
      medicationPlan.countTotal ==
      medicationPlan.countSkipped + medicationPlan.countTaken
    ) {
      await this.prismaSerivce.medicationPlan.update({
        where: {
          id: where.reminderPlanMedicationPlanId,
        },
        data: { completed: true },
      });
    }
    return updatedReminderPlanTime;
  }

  async localSkipOne(
    where: Prisma.LocalReminderPlanTimeLocalReminderPlanMedicationPlanIdLocalReminderPlanLocalMedicationNameTimeCompoundUniqueInput,
  ): Promise<LocalReminderPlanTime> {
    const updatedReminderPlanTime =
      await this.prismaSerivce.localReminderPlanTime.update({
        where: {
          localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
            where,
        },
        data: {
          isSkipped: true,
        },
        include: localReminderPlanTimeIncludeFields,
      });
    // Update countSkipped
    const medicationPlan = await this.prismaSerivce.medicationPlan.update({
      where: {
        id: where.localReminderPlanMedicationPlanId,
      },
      data: {
        countSkipped: {
          increment: updatedReminderPlanTime.dosage,
        },
      },
      select: {
        countTotal: true,
        countTaken: true,
        countSkipped: true,
      },
    });

    // update completed
    if (
      medicationPlan.countTotal ==
      medicationPlan.countSkipped + medicationPlan.countTaken
    ) {
      await this.prismaSerivce.medicationPlan.update({
        where: {
          id: where.localReminderPlanMedicationPlanId,
        },
        data: { completed: true },
      });
    }
    return updatedReminderPlanTime;
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
    const reminderPlan = await this.reminderPlansService.findOne({
      medicationPlanId_medicationId: {
        medicationPlanId: where.reminderPlanMedicationPlanId,
        medicationId: where.reminderPlanMedicationId,
      },
    });
    await this.reminderPlansService.updateOne({
      where: {
        medicationPlanId_medicationId: {
          medicationPlanId: where.reminderPlanMedicationPlanId,
          medicationId: where.reminderPlanMedicationId,
        },
      },
      data: {
        stock: reminderPlan.stock + updatedReminderPlanTime.dosage,
      },
    });

    // Update countTaken
    const medicationPlan = await this.prismaSerivce.medicationPlan.update({
      where: {
        id: where.reminderPlanMedicationPlanId,
      },
      data: {
        countTaken: {
          decrement: updatedReminderPlanTime.dosage,
        },
      },
      select: {
        countTotal: true,
        countTaken: true,
        countSkipped: true,
      },
    });

    // update completed
    if (
      medicationPlan.countTotal >
      medicationPlan.countSkipped + medicationPlan.countTaken
    ) {
      await this.prismaSerivce.medicationPlan.update({
        where: {
          id: where.reminderPlanMedicationPlanId,
        },
        data: { completed: false },
      });
    }

    return updatedReminderPlanTime;
  }

  async localRevertOne(
    where: Prisma.LocalReminderPlanTimeLocalReminderPlanMedicationPlanIdLocalReminderPlanLocalMedicationNameTimeCompoundUniqueInput,
  ): Promise<LocalReminderPlanTime> {
    const matchedLocalReminderPlanTime =
      await this.prismaSerivce.localReminderPlanTime.findUnique({
        where: {
          localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
            where,
        },
      });
    if (
      Date.now() - matchedLocalReminderPlanTime.sentAt.getTime() >
      MILLISECONDS_PER_DAY
    ) {
      throw new BadRequestException({
        status: HttpStatus.FORBIDDEN,
        error: 'Can not revert action after 24 hours',
      });
    }

    const updatedLocalReminderPlanTime =
      await this.prismaSerivce.localReminderPlanTime.update({
        where: {
          localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
            where,
        },
        data: {
          isTaken: false,
          isSkipped: false,
        },
        include: localReminderPlanTimeIncludeFields,
      });

    const localReminderPlan =
      await this.prismaSerivce.localReminderPlan.findUnique({
        where: {
          medicationPlanId_localMedicationName: {
            localMedicationName: where.localReminderPlanLocalMedicationName,
            medicationPlanId: where.localReminderPlanMedicationPlanId,
          },
        },
      });

    await this.prismaSerivce.localReminderPlan.update({
      where: {
        medicationPlanId_localMedicationName: {
          medicationPlanId: where.localReminderPlanMedicationPlanId,
          localMedicationName: where.localReminderPlanLocalMedicationName,
        },
      },
      data: {
        stock: localReminderPlan.stock + updatedLocalReminderPlanTime.dosage,
      },
    });

    // Update countTaken
    const medicationPlan = await this.prismaSerivce.medicationPlan.update({
      where: {
        id: where.localReminderPlanMedicationPlanId,
      },
      data: {
        countTaken: {
          decrement: updatedLocalReminderPlanTime.dosage,
        },
      },
      select: {
        countTotal: true,
        countTaken: true,
        countSkipped: true,
      },
    });

    // update completed
    if (
      medicationPlan.countTotal >
      medicationPlan.countSkipped + medicationPlan.countTaken
    ) {
      await this.prismaSerivce.medicationPlan.update({
        where: {
          id: where.localReminderPlanMedicationPlanId,
        },
        data: { completed: false },
      });
    }

    return updatedLocalReminderPlanTime;
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

  async localDeleteOne(
    where: Prisma.LocalReminderPlanTimeLocalReminderPlanMedicationPlanIdLocalReminderPlanLocalMedicationNameTimeCompoundUniqueInput,
  ): Promise<string> {
    const deleteLocalReminderPlanTime =
      await this.prismaSerivce.localReminderPlanTime.delete({
        where: {
          localReminderPlanMedicationPlanId_localReminderPlanLocalMedicationName_time:
            where,
        },
      });

    const localReminderPlan =
      await this.prismaSerivce.localReminderPlan.findUnique({
        where: {
          medicationPlanId_localMedicationName: {
            localMedicationName: where.localReminderPlanLocalMedicationName,
            medicationPlanId: where.localReminderPlanMedicationPlanId,
          },
        },
      });

    await this.medicationPlansService.updateOne({
      where: { id: where.localReminderPlanMedicationPlanId },
      data: {
        localReminderPlans: {
          update: {
            where: {
              medicationPlanId_localMedicationName: {
                localMedicationName: where.localReminderPlanLocalMedicationName,
                medicationPlanId: where.localReminderPlanMedicationPlanId,
              },
            },
            data: {
              stock:
                localReminderPlan.stock - deleteLocalReminderPlanTime.dosage,
            },
          },
        },
      },
    });

    return 'Deleted';
  }

  // TODO: Unnest object
  async findAll(where: Prisma.ReminderPlanTimeWhereInput) {
    const reminderPlanTimes =
      await this.prismaSerivce.reminderPlanTime.findMany({
        where,
        select: reminderPlanTimeSelectFields,
      });

    const results = reminderPlanTimes.map((reminderPlanTime) => {
      const { reminderPlan, ...restReminderPlanTime } = reminderPlanTime;
      const { medication, ...restReminderPlan } = reminderPlan;
      const { name } = medication;

      return {
        ...restReminderPlanTime,
        ...restReminderPlan,
        name,
      };
    });

    return results;
  }
}
