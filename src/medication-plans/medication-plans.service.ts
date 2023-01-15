import { Injectable } from '@nestjs/common';
import { Frequency, Prisma } from '@prisma/client';
import { doctorBaseFieldIncludes } from 'src/doctors/constants';
import { patientBaseIncludeFields } from 'src/patients/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicationPlanDto } from './medication-plans.controller';

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
    try {
      const medicationPlan = await this.prismaSerivce.medicationPlan.create({
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
              } = reminderPlan;
              let totalStock = 0;
              const createdReminderPlanTimes: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput[] =
                [];
              startDate.setHours(0, 0, 0);
              if (endDate) {
                endDate.setHours(0, 0, 0);
                // Include the end day
                for (
                  let d = new Date(startDate);
                  d < endDate;
                  d.setDate(d.getDate() + interval)
                ) {
                  console.log(
                    `Day ${d.toLocaleString()} has day value ${d.getDay()}, and selected days are ${selectedDays}`,
                  );
                  if (selectedDays.includes(d.getDay())) {
                    reminderPlan.reminderPlanTime.forEach(
                      (reminderPlanTime) => {
                        const [hour, minutes] = getDateAndTime(
                          reminderPlanTime.time,
                        );
                        const time = new Date(d);
                        time.setHours(hour);
                        time.setMinutes(minutes);
                        time.setMilliseconds(0);
                        const createdReminderPlanTime: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput =
                          {
                            time,
                            patientAccount: {
                              connect: { userAccountId: patientId },
                            },
                            dosage: reminderPlanTime.dosage,
                          };
                        createdReminderPlanTimes.push(createdReminderPlanTime);
                        totalStock += reminderPlanTime.dosage;
                      },
                    );
                  }
                }
              } else if (stock && stock > 0) {
                totalStock = stock;
                // TODO: Medication plan creation logic base on stock
                let count = stock;
                const d = new Date(startDate);
                while (
                  reminderPlanTime.some(
                    (reminderPlanTime) => reminderPlanTime.dosage <= count,
                  )
                ) {
                  if (selectedDays.includes(d.getDate())) {
                    reminderPlanTime.forEach((reminderPlanTime) => {
                      if (reminderPlanTime.dosage <= count) {
                        const [hour, minutes] = getDateAndTime(
                          reminderPlanTime.time,
                        );
                        const time = new Date(d);
                        time.setHours(hour);
                        time.setMinutes(minutes);
                        time.setMilliseconds(0);
                        const createdReminderPlanTime: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput =
                          {
                            time,
                            patientAccount: {
                              connect: { userAccountId: patientId },
                            },
                            dosage: reminderPlanTime.dosage,
                          };
                        createdReminderPlanTimes.push(createdReminderPlanTime);
                        count -= reminderPlanTime.dosage;
                      }
                    });
                    d.setDate(d.getDate() + interval);
                  }
                }
              }

              const createdReminderPlan: Prisma.ReminderPlanCreateWithoutMedicationPlanInput =
                {
                  medication: { connect: { id: reminderPlan.medicationId } },
                  frequency: reminderPlan.frequency,
                  startDate: reminderPlan.startDate,
                  endDate: reminderPlan.endDate,
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

      return medicationPlan;
    } catch (error) {
      console.log(error);
    }
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
