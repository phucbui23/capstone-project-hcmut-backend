import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prismaService: PrismaService) {}

  private getIncludeFields(): Prisma.PatientAccountInclude {
    return {
      userAccount: {
        include: {
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
          attachments: true,
        },
      },
    };
  }

  async findAll() {
    return await this.prismaService.patientAccount.findMany({
      include: this.getIncludeFields(),
      orderBy: {
        userAccountId: 'asc',
      },
    });
  }

  async findOne(where: Prisma.PatientAccountWhereUniqueInput) {
    return await this.prismaService.patientAccount.findUnique({
      where,
      include: this.getIncludeFields(),
    });
  }

  async createOne(phoneNumber: string, password: string) {
    const patient = await this.prismaService.patientAccount.create({
      data: {
        phoneNumber,
        userAccount: {
          create: {
            passwordHash: password,
            role: {
              connect: { name: UserRole.PATIENT },
            },
          },
        },
      },
      include: this.getIncludeFields(),
    });

    return patient;
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
}
