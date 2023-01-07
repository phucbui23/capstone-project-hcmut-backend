import { Injectable } from '@nestjs/common';
import {
  DoctorAccount,
  DoctorManagesPatient,
  MedicationPlan,
  OperatorAccount,
  Prisma,
  Qualification,
  UserRole,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { roleIncludeFields } from 'src/roles/constants';
import { RolesService } from 'src/roles/roles.service';
import { doctorFieldIncludes } from './constants';

const doctorResponse = Prisma.validator<Prisma.UserAccountArgs>()({
  include: doctorFieldIncludes as object,
});

export type DoctorResponse = Prisma.UserAccountGetPayload<
  typeof doctorResponse
>;
@Injectable()
export class DoctorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOne(username: string, password: string, hospitalId: number) {
    return await this.prismaService.userAccount.create({
      data: {
        passwordHash: password,
        role: { connect: { name: UserRole.DOCTOR } },
        operatorAccount: {
          create: {
            username,
            hospital: { connect: { id: hospitalId } },
          },
        },
      },
      include: doctorFieldIncludes,
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
      include: doctorFieldIncludes,
    });

    return user;
  }

  async findAll() {
    return await this.prismaService.userAccount.findMany({
      where: {
        role: { name: { equals: UserRole.DOCTOR } },
      },
      include: doctorFieldIncludes,
    });
  }

  async deleteOne(where: Prisma.DoctorAccountWhereUniqueInput) {
    const deletedDoctor = await this.prismaService.doctorAccount.delete({
      where,
    });
    const deletedOperator = await this.prismaService.operatorAccount.delete({
      where: { userAccountId: deletedDoctor.operatorAccountId },
    });
    const deletedUser = await this.prismaService.userAccount.delete({
      where: { id: deletedOperator.userAccountId },
    });

    return 'Deleted';
  }
}
