import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prismaService: PrismaService) {}

  private getIncludeFields(): Prisma.DoctorAccountInclude {
    return {
      operatorAccount: {
        include: {
          hospital: true,
          userAccount: {
            include: {
              attachments: true,
              role: {
                include: {
                  roleAccessesResources: {
                    orderBy: {
                      resourceId: 'asc',
                    },
                    include: {
                      resource: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  async createOne(username: string, password: string, hospitalId: number) {
    return await this.prismaService.doctorAccount.create({
      data: {
        operatorAccount: {
          create: {
            username,
            userAccount: {
              create: {
                passwordHash: password,
                role: {
                  connect: { name: UserRole.DOCTOR },
                },
              },
            },
            hospital: {
              connect: { id: hospitalId },
            },
          },
        },
      },
      include: this.getIncludeFields(),
    });
  }

  async findOne(where: Prisma.DoctorAccountWhereUniqueInput) {
    return await this.prismaService.doctorAccount.findUnique({
      where,
      include: this.getIncludeFields(),
    });
  }

  async findAll() {
    return await this.prismaService.doctorAccount.findMany({
      include: this.getIncludeFields(),
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
