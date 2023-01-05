import { Injectable } from '@nestjs/common';
import { Hospital, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HospitalsService {
  constructor(private readonly prismaService: PrismaService) {}

  private getIncludeFields(): Prisma.HospitalInclude {
    return {
      operatorAccounts: {
        include: {
          doctorAccount: true,
          hospitalAdminAccount: true,
        },
      },
    };
  }

  async findAll(): Promise<Hospital[]> {
    return await this.prismaService.hospital.findMany({
      include: this.getIncludeFields(),
    });
  }

  async findOne(where: Prisma.HospitalWhereUniqueInput): Promise<Hospital> {
    return await this.prismaService.hospital.findUnique({
      where,
      include: this.getIncludeFields(),
    });
  }
}
