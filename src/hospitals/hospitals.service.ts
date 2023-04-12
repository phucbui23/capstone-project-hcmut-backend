import { Injectable } from '@nestjs/common';
import { Hospital, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { hospitalIncludeFields } from './constants';
import { PaginatedResult, createPaginator } from 'prisma-pagination';

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
}
