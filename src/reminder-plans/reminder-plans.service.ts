import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReminderPlansService {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async findOne(where: Prisma.ReminderPlanWhereUniqueInput) {
    return await this.prismaSerivce.reminderPlan.findUnique({ where });
  }
}
