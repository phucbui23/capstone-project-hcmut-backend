import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { MedicationPlan, Prisma } from '@prisma/client';

import { child, get, ref } from 'firebase/database';
import { PaginatedResult, createPaginator } from 'prisma-pagination';
import { FirebaseService } from 'src/firebase/firebase.service';

import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import * as firebaseStorage from 'firebase/storage';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getDateAndTime } from 'src/utils/date';
import {
  CreateLocalMedicationPlanDto,
  CreateMedicationPlanDto,
} from './dto/create-medication-plan.dto';

export const localReport: Prisma.MedicationPlanSelect = {
  id: true,
  name: true,
  completed: true,
  countTotal: true,
  countTaken: true,
  countSkipped: true,
  createdAt: true,
  localReminderPlans: {
    select: {
      stock: true,
      localMedicationName: true,
    },
  },
};
export const medicationPlanIncludeFields: Prisma.MedicationPlanInclude = {
  reminderPlans: {
    include: {
      medication: true,
      reminderPlanTimes: true,
    },
  },
  localReminderPlans: {
    include: {
      localReminderPlanTimes: true,
    },
  },
  doctorAccount: false,
  patientAccount: false,
  bill: {
    select: {
      filePath: true,
    },
  },
};

@Injectable()
export class MedicationPlansService {
  constructor(
    private readonly prismaSerivce: PrismaService,
    private readonly firebaseService: FirebaseService,
    private readonly chatService: ChatService,
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

  async patientFindAll(patientId: number) {
    return await this.prismaSerivce.medicationPlan.findMany({
      where: {
        patientAccountId: patientId,
      },
      include: medicationPlanIncludeFields,
    });
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
        patientAccount: patientId
          ? { connect: { userAccountId: patientId } }
          : undefined,
        doctorAccount: doctorId
          ? {
              connect: {
                operatorAccountId: doctorId,
              },
            }
          : undefined,
        reminderPlans: reminderPlans
          ? {
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
                      reminderPlan.reminderPlanTimes.forEach(
                        ({ dosage, time }) => {
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
                              patientAccount: patientId
                                ? {
                                    connect: { userAccountId: patientId },
                                  }
                                : undefined,
                            };
                          createdReminderPlanTimes.push(
                            createdReminderPlanTime,
                          );
                          totalStock += dosage;
                        },
                      );
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
                                patientAccount: patientId
                                  ? {
                                      connect: { userAccountId: patientId },
                                    }
                                  : undefined,
                              };
                            createdReminderPlanTimes.push(
                              createdReminderPlanTime,
                            );
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
                              patientAccount: patientId
                                ? {
                                    connect: { userAccountId: patientId },
                                  }
                                : undefined,
                            };
                          createdReminderPlanTimes.push(
                            createdReminderPlanTime,
                          );
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
                                patientAccount: patientId
                                  ? {
                                      connect: { userAccountId: patientId },
                                    }
                                  : undefined,
                              };
                            createdReminderPlanTimes.push(
                              createdReminderPlanTime,
                            );
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
            }
          : undefined,
      },
      include: medicationPlanIncludeFields,
    });
  }

  async createLocalOne({
    patientId,
    name,
    localReminderPlans,
    note,
  }: CreateLocalMedicationPlanDto) {
    return await this.prismaSerivce.medicationPlan.create({
      data: {
        name,
        note,
        patientAccount: { connect: { userAccountId: patientId } },
        localReminderPlans: localReminderPlans
          ? {
              create: localReminderPlans.map((localReminderPlan) => {
                const {
                  startDate,
                  endDate,
                  stock,
                  reminderPlanTimes,
                  interval,
                  selectedDays,
                  frequency,
                  localMedicationName,
                  note,
                } = localReminderPlan;
                let totalStock = 0;
                let selectedInterval = interval;
                const createdLocalReminderPlanTimes: Prisma.LocalReminderPlanTimeCreateWithoutLocalReminderPlanInput[] =
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
                      localReminderPlan.reminderPlanTimes.forEach(
                        ({ dosage, time }) => {
                          const [hour, minutes] = getDateAndTime(time);
                          const timestamp = new Date(d);
                          timestamp.setHours(hour);
                          timestamp.setMinutes(minutes);
                          timestamp.setMilliseconds(0);
                          const createdLocalReminderPlanTime: Prisma.LocalReminderPlanTimeCreateWithoutLocalReminderPlanInput =
                            {
                              dosage,
                              time: timestamp,
                              sentAt: timestamp,
                              patientAccount: {
                                connect: { userAccountId: patientId },
                              },
                            };
                          createdLocalReminderPlanTimes.push(
                            createdLocalReminderPlanTime,
                          );
                          totalStock += dosage;
                        },
                      );
                    }
                  } else if (frequency === 'SELECTED_DAYS') {
                    for (
                      let d = new Date(startDate);
                      d < endDate;
                      d.setDate(d.getDate() + 1)
                    ) {
                      if (selectedDays.includes(d.getDay())) {
                        localReminderPlan.reminderPlanTimes.forEach(
                          ({ dosage, time }) => {
                            const [hour, minutes] = getDateAndTime(time);
                            const timestamp = new Date(d);
                            timestamp.setHours(hour);
                            timestamp.setMinutes(minutes);
                            timestamp.setSeconds(0);

                            const createdLocalReminderPlanTime: Prisma.LocalReminderPlanTimeCreateWithoutLocalReminderPlanInput =
                              {
                                dosage,
                                time: timestamp,
                                sentAt: timestamp,
                                patientAccount: {
                                  connect: { userAccountId: patientId },
                                },
                              };
                            createdLocalReminderPlanTimes.push(
                              createdLocalReminderPlanTime,
                            );
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
                          const createdLocalReminderPlanTime: Prisma.LocalReminderPlanTimeCreateWithoutLocalReminderPlanInput =
                            {
                              dosage,
                              time: timestamp,
                              sentAt: timestamp,
                              patientAccount: {
                                connect: { userAccountId: patientId },
                              },
                            };
                          createdLocalReminderPlanTimes.push(
                            createdLocalReminderPlanTime,
                          );
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
                            const createdLocalReminderPlanTime: Prisma.LocalReminderPlanTimeCreateWithoutLocalReminderPlanInput =
                              {
                                dosage,
                                time: timestamp,
                                sentAt: timestamp,
                                patientAccount: {
                                  connect: { userAccountId: patientId },
                                },
                              };
                            createdLocalReminderPlanTimes.push(
                              createdLocalReminderPlanTime,
                            );
                            count -= dosage;
                          }
                        });
                      }
                      d.setDate(d.getDate() + 1);
                    }
                  }
                }

                const createdReminderPlan: Prisma.LocalReminderPlanCreateWithoutMedicationPlanInput =
                  {
                    frequency,
                    startDate,
                    endDate,
                    note,
                    localMedicationName: localMedicationName, //TODO: if have localMedicationName
                    stock: totalStock,
                    localReminderPlanTimes: {
                      create: createdLocalReminderPlanTimes,
                    },
                  };
                return createdReminderPlan;
              }),
            }
          : undefined,
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
    const medicationPlanToDelete =
      await this.prismaSerivce.medicationPlan.delete({
        where: { id: where.id },
        select: {
          roomId: true,
          doctorAccount: {
            select: {
              operatorAccount: {
                select: {
                  userAccount: {
                    select: {
                      code: true,
                    },
                  },
                },
              },
            },
          },
          patientAccount: {
            select: {
              userAccount: {
                select: {
                  code: true,
                },
              },
            },
          },
        },
      });

    // Delete room on firebase & update rooms of doctor and patient
    await deleteDoc(
      doc(
        this.firebaseService.firestoreRef,
        'rooms',
        medicationPlanToDelete.roomId,
      ),
    );

    await updateDoc(
      doc(
        this.firebaseService.firestoreRef,
        'users',
        medicationPlanToDelete.doctorAccount.operatorAccount.userAccount.code,
      ),
      { rooms: arrayRemove(medicationPlanToDelete.roomId) },
    );

    await updateDoc(
      doc(
        this.firebaseService.firestoreRef,
        'users',
        medicationPlanToDelete.patientAccount.userAccount.code,
      ),
      { rooms: arrayRemove(medicationPlanToDelete.roomId) },
    );

    // Delete roomMessages
    await deleteDoc(
      doc(
        this.firebaseService.firestoreRef,
        'roomMessages',
        medicationPlanToDelete.roomId,
      ),
    );

    return { message: 'Deleted' };
  }

  async deleteLocal(id: number) {
    const medicationPlanToDelete =
      await this.prismaSerivce.medicationPlan.findFirst({
        where: {
          id,
          doctorAccountId: {
            equals: null,
          },
        },
      });

    if (!medicationPlanToDelete)
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        error:
          "Can't delete this medication plan because it is prescribed by a doctor",
      });

    await this.prismaSerivce.medicationPlan.delete({
      where: { id },
    });

    return {
      message: 'Deleted',
    };
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

  async getAssociatedMedicationPlans(
    doctorCode: string,
    page: number,
    perPage: number,
    field: string,
    order: string,
    keyword: string,
  ) {
    const paginate = createPaginator({ perPage });

    return await paginate(
      this.prismaSerivce.medicationPlan,
      {
        where: {
          AND: [
            {
              doctorAccount: {
                operatorAccount: {
                  userAccount: {
                    code: doctorCode,
                  },
                },
              },
            },
            {
              doctorAccountId: {
                not: null,
              },
            },
            {
              name: {
                contains: keyword,
              },
            },
          ],
        },
        orderBy: {
          [field]: order,
        },
      },
      { page },
    );
  }

  async getPatientReport(where: Prisma.MedicationPlanWhereUniqueInput) {
    const planedByDoctor = await this.prismaSerivce.medicationPlan.findUnique({
      where: {
        id: where.id,
      },
      select: {
        id: true,
        name: true,
        completed: true,
        countTotal: true,
        countTaken: true,
        countSkipped: true,
        createdAt: true,
        reminderPlans: {
          select: {
            stock: true,
            medication: {
              select: {
                name: true,
                code: true,
                id: true,
              },
            },
            reminderPlanTimes: {
              select: {
                dosage: true,
                isSkipped: true,
                isTaken: true,
                sentAt: true,
              },
            },
          },
        },
      },
    });
    return planedByDoctor;
    const byDoctor = [];
    planedByDoctor.reminderPlans.forEach((plan) => {
      byDoctor.push({
        stock: plan.stock,
        medicationName: plan.medication.name,
        medicationCode: plan.medication.code,
        medicationId: plan.medication.id,
        reminderPlanTimes: plan.reminderPlanTimes.forEach((reminderTime) => {}),
      });
    });

    return {
      id: planedByDoctor.id,
      name: planedByDoctor.name,
      completed: planedByDoctor.completed,
      countTotal: planedByDoctor.countTotal,
      countTaken: planedByDoctor.countTaken,
      countSkipped: planedByDoctor.countSkipped,
      createdAt: planedByDoctor.createdAt,
      reminderPlans: byDoctor,
    };
  }

  async getLocalPatientReport(where: Prisma.MedicationPlanWhereUniqueInput) {
    const local = await this.prismaSerivce.medicationPlan.findUnique({
      where: {
        id: where.id,
      },
      select: localReport,
    });

    return local;

    const localReminderPlan = [];
    local.localReminderPlans.forEach((plan) => {
      localReminderPlan.push({
        stock: plan.stock,
        localMedcationName: plan.localMedicationName,
      });
    });

    return {
      id: local.id,
      name: local.name,
      completed: local.completed,
      countTotal: local.countTotal,
      countTaken: local.countTaken,
      countSkipped: local.countSkipped,
      createdAt: local.createdAt,
      localReminderPlans: localReminderPlan,
    };
  }

  async uploadMedicationPlanBill(
    file: Express.Multer.File,
    medicatioPlanId: number,
  ) {
    try {
      const fileRef = `medication_plan_bill/${
        file.originalname + ' ' + Date.now()
      }`;

      const billRef = firebaseStorage.ref(
        this.firebaseService.storage,
        fileRef,
      );

      const metadata = {
        contentType: file.mimetype,
      };

      const snapshot = await firebaseStorage.uploadBytesResumable(
        billRef,
        file.buffer,
        metadata,
      );

      const downloadUrl = await firebaseStorage.getDownloadURL(snapshot.ref);

      await this.prismaSerivce.medicationPlan.update({
        where: {
          id: medicatioPlanId,
        },
        data: {
          bill: {
            create: {
              fileName: fileRef,
              fileSize: file.size,
              filePath: downloadUrl,
            },
          },
        },
      });

      return {
        message: 'Upload bill successfully',
        name: file.originalname,
        type: file.mimetype,
        downloadUrl: downloadUrl,
      };
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      });
    }
  }

  async syncUserWithPlan(id: number, medicationPlanId: number) {
    // check if plan already connected
    const medicationPlan =
      await this.prismaSerivce.medicationPlan.findFirstOrThrow({
        where: {
          id: medicationPlanId,
        },
      });

    if (medicationPlan.patientAccountId) {
      throw new BadRequestException({
        status: HttpStatus.FORBIDDEN,
        error: 'Medication plan already scanned.',
      });
    }

    // connect plan with user account
    const updatedMedicationPlan =
      await this.prismaSerivce.medicationPlan.update({
        where: {
          id: medicationPlanId,
        },
        data: {
          patientAccount: {
            connect: {
              userAccountId: id,
            },
          },
        },
        select: {
          name: true,
          reminderPlans: true,
          patientAccountId: true,
          patientAccount: {
            select: {
              userAccount: {
                select: {
                  code: true,
                },
              },
            },
          },
          doctorAccount: {
            select: {
              operatorAccount: {
                select: {
                  userAccount: {
                    select: {
                      code: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    // update reminder plan time
    await this.prismaSerivce.reminderPlanTime.updateMany({
      where: {
        reminderPlan: {
          medicationPlanId,
        },
      },
      data: {
        patientAccountId: {
          set: id,
        },
      },
    });

    // create room
    const conversation = await this.chatService.createRoom(
      updatedMedicationPlan.patientAccount.userAccount.code,
      updatedMedicationPlan.doctorAccount.operatorAccount.userAccount.code,
    );

    // update room name on firebase
    await updateDoc(
      doc(this.firebaseService.firestoreRef, 'rooms', conversation.roomId),
      {
        name: medicationPlan.name,
      },
    );

    // Update room id and countTotal
    let total: number = 0;

    for (const reminderPlan of updatedMedicationPlan.reminderPlans) {
      total += reminderPlan.stock;
    }

    const ret = await this.prismaSerivce.medicationPlan.update({
      where: {
        id: medicationPlanId,
      },
      data: {
        roomId: conversation.roomId,
        countTotal: total,
      },
      include: medicationPlanIncludeFields,
    });

    return ret;
  }
}
