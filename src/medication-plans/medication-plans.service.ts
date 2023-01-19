import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicationPlanDto } from './dto/create-medication-plan.dto';

function getDateAndTime(str: string): [number, number] {
  const [hour, minutes, ...rest] = str
    .split(':')
    .map((amount) => parseInt(amount));

  return [hour, minutes];
}

export const medicationPlanIncludeFields: Prisma.MedicationPlanInclude = {
  reminderPlans: {
    include: {
      medication: true,
      reminderPlanTimes: true,
    },
  },
};

@Injectable()
export class MedicationPlansService {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async findAll() {
    return await this.prismaSerivce.medicationPlan.findMany({
      include: medicationPlanIncludeFields,
    });
  }

  async createOne({
    name,
    patientId,
    remindersPlans,
    doctorId,
    note,
  }: CreateMedicationPlanDto) {
    return await this.prismaSerivce.medicationPlan.create({
      data: {
        name,
        note,
        patientAccount: { connect: { userAccountId: patientId } },
        doctorAccount: { connect: { operatorAccountId: doctorId } },
        reminderPlans: {
          create: remindersPlans.map((reminderPlan) => {
            const {
              startDate,
              endDate,
              stock,
              reminderPlanTime,
              interval,
              selectedDays,
              frequency,
              medicationId,
              // TODO: Add logic to create self-defined medication name
              localMedicationName,
              note,
            } = reminderPlan;
            let totalStock = 0;
            let selectedInterval =
              frequency === 'MONTH_INTERVAL' ? 30 : interval;
            const createdReminderPlanTimes: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput[] =
              [];
            startDate.setHours(0, 0, 0);
            if (endDate) {
              endDate.setHours(0, 0, 0);
              // Make the end day inclusive
              for (
                let d = new Date(startDate);
                d < endDate;
                d.setDate(d.getDate() + selectedInterval)
              ) {
                if (selectedDays.includes(d.getDay())) {
                  reminderPlan.reminderPlanTime.forEach(
                    ({ dosage, time, sentAt }) => {
                      const [hour, minutes] = getDateAndTime(time);
                      const timestamp = new Date(d);
                      timestamp.setHours(hour);
                      timestamp.setMinutes(minutes);
                      timestamp.setMilliseconds(0);
                      const createdReminderPlanTime: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput =
                        {
                          dosage,
                          time: timestamp,
                          patientAccount: {
                            connect: { userAccountId: patientId },
                          },
                        };
                      createdReminderPlanTimes.push(createdReminderPlanTime);
                      totalStock += dosage;
                    },
                  );
                }
              }
            } else if (stock && stock > 0) {
              totalStock = stock;
              // TODO: Medication plan creation logic base on stock
              let count = stock;
              const d = new Date(startDate);
              while (reminderPlanTime.some(({ dosage }) => dosage <= count)) {
                if (selectedDays.includes(d.getDate())) {
                  reminderPlanTime.forEach(({ dosage, time, sentAt }) => {
                    if (dosage <= count) {
                      const [hour, minutes] = getDateAndTime(time);
                      const timestamp = new Date(d);
                      timestamp.setHours(hour);
                      timestamp.setMinutes(minutes);
                      timestamp.setMilliseconds(0);
                      const createdReminderPlanTime: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput =
                        {
                          dosage,
                          time: timestamp,
                          patientAccount: {
                            connect: { userAccountId: patientId },
                          },
                        };
                      createdReminderPlanTimes.push(createdReminderPlanTime);
                      count -= dosage;
                    }
                  });
                  d.setDate(d.getDate() + selectedInterval);
                }
              }
            }

            const createdReminderPlan: Prisma.ReminderPlanCreateWithoutMedicationPlanInput =
              {
                frequency,
                startDate,
                endDate,
                note,
                medication: { connect: { id: medicationId } },
                stock: totalStock,
                reminderPlanTimes: {
                  create: createdReminderPlanTimes,
                },
              };

            return createdReminderPlan;
          }),
        },
      },
      include: medicationPlanIncludeFields,
    });
  }

  async updateOne({
    where,
    data,
  }: {
    where: Prisma.MedicationPlanWhereUniqueInput;
    data: Prisma.MedicationPlanUpdateInput;
  }) {
    return await this.prismaSerivce.medicationPlan.update({
      where,
      data,
    });
  }

  async deleteOne(where: Prisma.MedicationPlanWhereUniqueInput) {
    const reminderPlanTimesToDelete =
      this.prismaSerivce.reminderPlanTime.deleteMany({
        where: {
          reminderPlanMedicationPlanId: { equals: where.id },
        },
      });

    const reminderPlansToDelete = this.prismaSerivce.reminderPlan.deleteMany({
      where: {
        medicationPlanId: { equals: where.id },
      },
    });

    const medicationPlanToDelete = this.prismaSerivce.medicationPlan.delete({
      where: { id: where.id },
    });

    await this.prismaSerivce.$transaction([
      reminderPlanTimesToDelete,
      reminderPlansToDelete,
      medicationPlanToDelete,
    ]);

    return 'Deleted';
  }
}