import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { hospitalAdminIncludeFields } from './constants';

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

    const user = await this.prismaService.userAccount.findUnique({
      where: { id: userAccountId },
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
