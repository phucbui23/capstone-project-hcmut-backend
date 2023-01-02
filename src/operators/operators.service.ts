import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OperatorsService {
  constructor(private readonly prismaService: PrismaService) {}

  private getIncludeFields(): Prisma.OperatorAccountInclude {
    return {
      userAccount: {
        include: {
          role: true,
          attachments: true,
        },
      },
      doctorAccount: true,
      hospitalAdminAccount: true,
      hospital: true,
    };
  }

  async findOne(where: Prisma.OperatorAccountWhereUniqueInput) {
    return await this.prismaService.operatorAccount.findUnique({
      where,
      include: this.getIncludeFields(),
    });
  }

  async findAll() {
    return await this.prismaService.operatorAccount.findMany({
      include: this.getIncludeFields(),
    });
  }
}
