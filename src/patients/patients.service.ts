import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { patientIncludeFields } from './constants';

@Injectable()
export class PatientsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.userAccount.findMany({
      where: {
        role: { name: { equals: UserRole.PATIENT } },
      },
      include: patientIncludeFields,
    });
  }

  async findOne(where: Prisma.PatientAccountWhereUniqueInput) {
    const patient = await this.prismaService.patientAccount.findUnique({
      where,
      select: { userAccountId: true },
    });
    if (!patient) {
      return null;
    }
    const { userAccountId } = patient;

    const user = await this.prismaService.userAccount.findUnique({
      where: { id: userAccountId },
      include: patientIncludeFields,
    });

    return user;
  }

  async createOne(phoneNumber: string, password: string) {
    return await this.prismaService.userAccount.create({
      data: {
        passwordHash: password,
        role: { connect: { name: UserRole.PATIENT } },
        patientAccount: {
          create: {
            phoneNumber,
          },
        },
      },
      include: patientIncludeFields,
    });
  }

  async deleteOne(where: Prisma.PatientAccountWhereUniqueInput) {
    const deletePatient = await this.prismaService.patientAccount.delete({
      where,
    });
    const deleteUser = await this.prismaService.userAccount.delete({
      where: { id: deletePatient.userAccountId },
    });

    return 'Deleted';
  }

  async updateOne(params: {
    where: Prisma.UserAccountWhereUniqueInput;
    data: Prisma.UserAccountUpdateInput;
  }) {
    const { where, data } = params;
    return await this.prismaService.userAccount.update({
      where,
      data,
      include: patientIncludeFields,
    });
  }
}
