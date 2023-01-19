import { Injectable } from '@nestjs/common';
import { Medication, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MedicationWhereUniqueInput;
    where?: Prisma.MedicationWhereInput;
    orderBy?: Prisma.MedicationOrderByWithRelationInput;
  }): Promise<Medication[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.medication.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.MedicationWhereUniqueInput): Promise<Medication> {
    return this.prismaService.medication.findUnique({ where });
  }

  async deleteOne(
    where: Prisma.MedicationWhereUniqueInput,
  ): Promise<Medication> {
    return this.prismaService.medication.delete({ where });
  }

  async updateOne({
    data,
    where,
  }: {
    where: Prisma.MedicationWhereUniqueInput;
    data: Prisma.MedicationUpdateInput;
  }): Promise<Medication> {
    return this.prismaService.medication.update({
      where,
      data,
    });
  }
}
