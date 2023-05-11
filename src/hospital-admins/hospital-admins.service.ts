import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { collection, doc, setDoc } from 'firebase/firestore';
import { MILLISECONDS_LAST_WEEK } from 'src/constant';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { hospitalAdminIncludeFields } from './constants';

@Injectable()
export class HospitalAdminsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createOne(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    hospitalId: number,
  ) {
    return await this.prismaService.userAccount.create({
      data: {
        firstName,
        lastName,
        passwordHash: password,
        role: { connect: { name: UserRole.HOSPITAL_ADMIN } },
        operatorAccount: {
          create: {
            username,
            hospital: { connect: { id: hospitalId } },
            hospitalAdminAccount: {
              create: {},
            },
          },
        },
      },
      include: hospitalAdminIncludeFields,
    });
  }

  async findOne(where: Prisma.OperatorAccountWhereUniqueInput) {
    const operator = await this.prismaService.operatorAccount.findUnique({
      where,
      select: { userAccountId: true },
    });
    if (!operator) {
      return null;
    }
    const { userAccountId } = operator;

    const user = await this.prismaService.userAccount.findFirst({
      where: { roleId: 2, id: userAccountId },
      include: hospitalAdminIncludeFields,
    });

    return user;
  }

  async findAll() {
    return await this.prismaService.userAccount.findMany({
      where: {
        role: { name: { equals: UserRole.HOSPITAL_ADMIN } },
      },
      include: hospitalAdminIncludeFields,
    });
  }

  async getSystemReport(hospitalId: number) {
    const doctorsAvailable = await this.prismaService.doctorAccount.count({
      where: {
        operatorAccount: {
          hospitalId,
        },
      },
    });

    const patientsAvailable = await this.prismaService.patientAccount.count({
      where: {
        doctorManagesPatients: {
          every: {
            doctorAccount: {
              operatorAccount: {
                hospitalId,
              },
            },
          },
        },
      },
    });

    const medicinesAvailable = await this.prismaService.medication.count({});

    const articlesAvailable = await this.prismaService.article.count({
      where: {
        hospitalId,
      },
    });

    const today = new Date();
    const lastWeek = new Date(today.getTime() - MILLISECONDS_LAST_WEEK);

    const lastActiveCounts = await this.prismaService.userAccount.groupBy({
      by: ['lastActive'],
      where: {
        OR: [
          {
            role: {
              name: {
                equals: UserRole.DOCTOR,
              },
            },
          },
          {
            role: {
              name: {
                equals: UserRole.PATIENT,
              },
            },
          },
        ],
        lastActive: {
          gte: lastWeek,
          lte: today,
        },
      },
      _count: { lastActive: true },
    });

    const daysOfWeek = []; // Array to store the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      daysOfWeek.push(date.toISOString().split('T')[0]);
    }
    // Loop through the past 7 days and find the corresponding count in the result array
    const activeUsersWeekly = {};
    for (const date of daysOfWeek) {
      activeUsersWeekly[date] = 0;
    }

    for (const item of lastActiveCounts) {
      const date = item.lastActive.toISOString().split('T')[0];
      if (activeUsersWeekly[date] !== undefined) {
        activeUsersWeekly[date] += item._count.lastActive;
      }
    }

    const newlyRegisteredPatients =
      await this.prismaService.doctorManagesPatient.findMany({
        orderBy: {
          patientAccount: {
            userAccount: {
              createdAt: 'desc',
            },
          },
        },
        select: {
          patientAccountId: true,
          patientAccount: {
            select: {
              userAccount: {
                select: {
                  code: true,
                  firstName: true,
                  lastName: true,
                  createdAt: true,
                },
              },
            },
          },
          doctorAccountId: true,
          doctorAccount: {
            select: {
              operatorAccount: {
                select: {
                  userAccount: {
                    select: {
                      code: true,
                      firstName: true,
                      lastName: true,
                      createdAt: true,
                    },
                  },
                },
              },
            },
          },
        },
        take: 5,
      });

    return {
      patientsAvailable,
      doctorsAvailable,
      medicinesAvailable,
      articlesAvailable,
      activeUsersWeekly,
      newlyRegisteredPatients,
    };
  }

  async activateFirebase(
    firstName: string,
    lastName: string,
    username: string,
    code: string,
    role: 'DOCTOR' | 'HOSPITAL_ADMIN',
  ) {
    const displayName = `${firstName.trim()} ${lastName.trim()}`;
    const userData = {
      id: code,
      displayName: displayName,
      phoneNumber: '',
      photoURL: '',
      username: username,
      rooms: [],
      role: role,
    };
    const newUserRef = doc(
      collection(this.firebaseService.firestoreRef, 'users'),
      code,
    );
    await setDoc(newUserRef, userData);
    return userData;
  }

  async deleteOne(where: Prisma.DoctorAccountWhereUniqueInput) {
    const deletedHospitalAdmin =
      await this.prismaService.hospitalAdminAccount.delete({
        where,
      });
    const deletedOperator = await this.prismaService.operatorAccount.delete({
      where: { userAccountId: deletedHospitalAdmin.operatorAccountId },
    });
    const deletedUser = await this.prismaService.userAccount.delete({
      where: { id: deletedOperator.userAccountId },
    });

    return 'Deleted';
  }
}
