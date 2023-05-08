import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { hospitalAdminIncludeFields } from './constants';
import { SystemReportDto } from './hospital-admins.controller';

@Injectable()
export class HospitalAdminsService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async getSystemReport(systemReportDto: SystemReportDto) {
    const doctorsAvailable = await this.prismaService.doctorAccount.count({
      where: {
        operatorAccount: {
          hospitalId: systemReportDto.hospitalId,
        },
      },
    });

    const patientsAvailable = await this.prismaService.patientAccount.count({
      where: {
        doctorManagesPatients: {
          every: {
            doctorAccount: {
              operatorAccount: {
                hospitalId: systemReportDto.hospitalId,
              },
            },
          },
        },
      },
    });

    const medicinesAvailable = await this.prismaService.medication.count({});

    const articlesAvailable = await this.prismaService.article.count({
      where: {
        hospitalId: systemReportDto.hospitalId,
      },
    });

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeUsersWeekly = await this.prismaService.userAccount.groupBy({
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
