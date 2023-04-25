import { Injectable } from '@nestjs/common';
import { MedicationPlan, Prisma } from '@prisma/client';

import { child, get, ref } from 'firebase/database';
import { PaginatedResult, createPaginator } from 'prisma-pagination';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getDateAndTime } from 'src/utils/date';
import { CreateMedicationPlanDto } from './dto/create-medication-plan.dto';

export const medicationPlanIncludeFields: Prisma.MedicationPlanInclude = {
  reminderPlans: {
    include: {
      medication: true,
      reminderPlanTimes: true,
    },
  },
  doctorAccount: false,
  patientAccount: false,
};

@Injectable()
export class MedicationPlansService {
  constructor(
    private readonly prismaSerivce: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async findAll(
    page: number,
    perPage: number,
    field: string,
    order: string,
    params: { where: Prisma.MedicationPlanWhereInput },
  ): Promise<PaginatedResult<MedicationPlan>> {
    const paginate = createPaginator({ perPage });
    const result = await paginate<
      MedicationPlan,
      Prisma.MedicationPlanFindManyArgs
    >(
      this.prismaSerivce.medicationPlan,
      {
        ...params,
        include: medicationPlanIncludeFields,
        orderBy: {
          [field]: order,
        },
      },
      /** I dont know what cause the page index to be -1, uncomment this and check it out! */
      {
        page,
      },
    );
    // return await this.prismaSerivce.medicationPlan.findMany({
    //   ...params,
    //   include: medicationPlanIncludeFields,
    // });
    return result;
  }

  async findOne(where: Prisma.MedicationPlanWhereUniqueInput) {
    return await this.prismaSerivce.medicationPlan.findUnique({
      where,
      include: medicationPlanIncludeFields,
    });
  }

  async createOne({
    name,
    patientId,
    reminderPlans,
    doctorId,
    note,
  }: CreateMedicationPlanDto) {
    return await this.prismaSerivce.medicationPlan.create({
      data: {
        name,
        note,
        patientAccount: { connect: { userAccountId: patientId } },
        // doctorAccount: { connect: { operatorAccountId: doctorId } },
        doctorAccount: doctorId
          ? {
              connect: {
                operatorAccountId: doctorId,
              },
            }
          : undefined,
        reminderPlans: {
          create: reminderPlans.map((reminderPlan) => {
            const {
              startDate,
              endDate,
              stock,
              reminderPlanTimes,
              interval,
              selectedDays,
              frequency,
              medicationId,
              // TODO: Add logic to create self-defined medication name
              localMedicationName,
              note,
            } = reminderPlan;
            let totalStock = 0;
            let selectedInterval = interval;
            const createdReminderPlanTimes: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput[] =
              [];
            startDate.setHours(0, 0, 0);
            if (endDate) {
              endDate.setHours(0, 0, 0);
              // Make the end day inclusive
              if (frequency === 'DAY_INTERVAL') {
                for (
                  let d = new Date(startDate);
                  d < endDate;
                  d.setDate(d.getDate() + selectedInterval)
                ) {
                  reminderPlan.reminderPlanTimes.forEach(({ dosage, time }) => {
                    const [hour, minutes] = getDateAndTime(time);
                    const timestamp = new Date(d);
                    timestamp.setHours(hour);
                    timestamp.setMinutes(minutes);
                    timestamp.setMilliseconds(0);
                    const createdReminderPlanTime: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput =
                      {
                        dosage,
                        time: timestamp,
                        sentAt: timestamp,
                        patientAccount: {
                          connect: { userAccountId: patientId },
                        },
                      };
                    createdReminderPlanTimes.push(createdReminderPlanTime);
                    totalStock += dosage;
                  });
                }
              } else if (frequency === 'SELECTED_DAYS') {
                for (
                  let d = new Date(startDate);
                  d < endDate;
                  d.setDate(d.getDate() + 1)
                ) {
                  if (selectedDays.includes(d.getDay())) {
                    reminderPlan.reminderPlanTimes.forEach(
                      ({ dosage, time }) => {
                        const [hour, minutes] = getDateAndTime(time);
                        const timestamp = new Date(d);
                        timestamp.setHours(hour);
                        timestamp.setMinutes(minutes);
                        timestamp.setSeconds(0);

                        const createdReminderPlanTime: Prisma.ReminderPlanTimeCreateWithoutReminderPlanInput =
                          {
                            dosage,
                            time: timestamp,
                            sentAt: timestamp,
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
              }
            } else if (stock && stock > 0) {
              totalStock = stock;
              // TODO: Medication plan creation logic base on stock
              let count = stock;
              const d = new Date(startDate);

              if (frequency === 'DAY_INTERVAL') {
                while (
                  reminderPlanTimes.some(({ dosage }) => dosage <= count)
                ) {
                  reminderPlanTimes.forEach(({ dosage, time }) => {
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
                          sentAt: timestamp,
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
              } else if (frequency === 'SELECTED_DAYS') {
                while (
                  reminderPlanTimes.some(({ dosage }) => dosage <= count)
                ) {
                  if (selectedDays.includes(d.getDay())) {
                    reminderPlanTimes.forEach(({ dosage, time }) => {
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
                            sentAt: timestamp,
                            patientAccount: {
                              connect: { userAccountId: patientId },
                            },
                          };
                        createdReminderPlanTimes.push(createdReminderPlanTime);
                        count -= dosage;
                      }
                    });
                  }
                  d.setDate(d.getDate() + 1);
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
      include: medicationPlanIncludeFields,
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

  async checkInteractions(medicationCodeList: string[]) {
    const ret = [];
    for (const medicationCode of medicationCodeList) {
      await get(
        child(
          ref(this.firebaseService.realtimeDatabase, 'medications'),
          `${medicationCode}`,
        ),
      )
        .then((snapshot) => {
          if (snapshot.exists() && snapshot.val().medicationInteractions) {
            const interactionsArr = [];
            medicationCodeList.forEach((code) => {
              if (snapshot.val().medicationInteractions[code]) {
                interactionsArr.push({
                  reagentId:
                    snapshot.val().medicationInteractions[code].reagentId,
                  name: snapshot.val().medicationInteractions[code].name,
                  description:
                    snapshot.val().medicationInteractions[code].description,
                });
              }
            });
            ret.push({
              id: snapshot.val().id,
              name: snapshot.val().name,
              interactions: interactionsArr,
            });
          } else {
            console.log('No medication found');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    return ret;
  }
}
