import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateReminderPlanParams } from './types';

@Injectable()
export class ReminderPlansService {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async findOne(where: Prisma.ReminderPlanWhereUniqueInput) {
    return await this.prismaSerivce.reminderPlan.findUnique({ where });
  }

  async updateOne(params: UpdateReminderPlanParams) {
    return await this.prismaSerivce.reminderPlan.update({ ...params });
  }
}
