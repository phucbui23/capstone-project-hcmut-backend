import { Injectable } from '@nestjs/common';
import { Hospital, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hospitalIncludeFields } from './constants';

@Injectable()
export class HospitalsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Hospital[]> {
    return await this.prismaService.hospital.findMany({
      include: hospitalIncludeFields,
    });
  }

  async findOne(where: Prisma.HospitalWhereUniqueInput): Promise<Hospital> {
    return await this.prismaService.hospital.findUnique({
      where,
      include: hospitalIncludeFields,
    });
  }
}
