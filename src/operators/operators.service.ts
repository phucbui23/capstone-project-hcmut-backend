import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { operatorIncludeFields } from './constants';

@Injectable()
export class OperatorsService {
  constructor(private readonly prismaService: PrismaService) {}

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
      include: operatorIncludeFields,
    });

    return user;
  }

  async findAll() {
    return await this.prismaService.userAccount.findMany({
      where: {
        role: {
          OR: [
            { name: { equals: UserRole.DOCTOR } },
            { name: { equals: UserRole.HOSPITAL_ADMIN } },
          ],
        },
      },
      include: operatorIncludeFields,
    });
  }
}
