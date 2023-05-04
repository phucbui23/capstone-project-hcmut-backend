import { Injectable } from '@nestjs/common';
import { Hospital, Prisma, UserRole } from '@prisma/client';

import { PaginatedResult, createPaginator } from 'prisma-pagination';
import { doctorFieldIncludes } from 'src/doctors/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { hospitalIncludeFields } from './constants';

@Injectable()
export class HospitalsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    page: number,
    perPage: number,
    field: string,
    order: string,
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.HospitalWhereUniqueInput;
      where?: Prisma.HospitalWhereInput;
      orderBy?: Prisma.HospitalOrderByWithRelationInput;
    },
  ): Promise<PaginatedResult<Hospital>> {
    const paginate = createPaginator({ perPage });
    const result = await paginate<Hospital, Prisma.HospitalFindManyArgs>(
      this.prismaService.hospital,
      {
        ...params,
        include: hospitalIncludeFields,
        orderBy: {
          [field]: order,
        },
      },
      { page },
    );
    return result;
    // return await this.prismaService.hospital.findMany({
    //   ...params,
    //   include: hospitalIncludeFields,
    // });
  }

  async findOne(where: Prisma.HospitalWhereUniqueInput): Promise<Hospital> {
    return await this.prismaService.hospital.findUnique({
      where,
      include: hospitalIncludeFields,
    });
  }

  async getHospitalDoctors(
    hospitalId: string,
    page: number,
    perPage: number,
    field: string,
    order: string,
  ) {
    const paginate = createPaginator({ perPage });

    return await paginate(
      this.prismaService.userAccount,
      {
        where: {
          AND: [
            {
              role: {
                name: {
                  equals: UserRole.DOCTOR,
                },
              },
            },
            {
              operatorAccount: {
                hospitalId,
              },
            },
          ],
        },
        orderBy: {
          [field]: order,
        },
        include: doctorFieldIncludes,
      },
      { page },
    );
  }
}
