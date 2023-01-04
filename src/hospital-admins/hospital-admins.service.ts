import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HospitalAdminsService {
  constructor(private readonly prismaService: PrismaService) {}

  private getIncludeFields(): Prisma.HospitalAdminAccountInclude {
    return {
      operatorAccount: {
        include: {
          hospital: true,
          userAccount: {
            include: {
              role: true,
              attachments: true,
            },
          },
        },
      },
    };
  }

  async createOne(username: string, password: string, hospitalName: string) {
    await this.prismaService.hospitalAdminAccount.create({
      data: {
        operatorAccount: {
          create: {
            username,
            userAccount: {
              create: {
                passwordHash: password,
                role: { connect: { name: 'Hospital admin' } },
              },
            },
            hospital: {
              connect: {
                name: hospitalName,
              },
            },
          },
        },
      },
      include: this.getIncludeFields(),
    });
  }

  async findOne(where: Prisma.DoctorAccountWhereUniqueInput) {
    return await this.prismaService.hospitalAdminAccount.findUnique({
      where,
      include: this.getIncludeFields(),
    });
  }

  async findAll() {
    return await this.prismaService.hospitalAdminAccount.findMany({
      include: this.getIncludeFields(),
    });
  }

  async deleteOne(where: Prisma.DoctorAccountWhereUniqueInput) {
    const deletedDoctor = await this.prismaService.hospitalAdminAccount.delete({
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
