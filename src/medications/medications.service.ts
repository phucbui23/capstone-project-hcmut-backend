import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Medication, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    page: number,
    perPage: number,
    field: string,
    order: string,
    keyword: string,
  ) {
    const paginate = createPaginator({ perPage });
    const result = await paginate<Medication, Prisma.MedicationFindManyArgs>(
      this.prismaService.medication,
      {
        where: {
          OR: [
            {
              code: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            {
              name: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
        },
        orderBy: {
          [field]: order,
        },
      },
      { page },
    );
    return result;
  }

  async createOne(data: Prisma.MedicationCreateInput) {
    return this.prismaService.medication.create({
      data,
    });
  }

  async findOne(where: Prisma.MedicationWhereUniqueInput): Promise<Medication> {
    let result;
    try {
      result = await this.prismaService.medication.findUniqueOrThrow({ where });
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        error: 'No medication found.',
      });
    }
    return result;
  }

  async deleteOne(where: Prisma.MedicationWhereUniqueInput) {
    let result;
    try {
      result = await this.prismaService.medication.delete({ where });
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        error: 'No Medication found.',
      });
    }
    return result;
  }

  async updateOne({
    data,
    where,
  }: {
    where: Prisma.MedicationWhereUniqueInput;
    data: Prisma.MedicationUpdateInput;
  }) {
    let result;
    try {
      result = this.prismaService.medication.update({
        where,
        data,
      });
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        error: 'No Medication found.',
      });
    }
    return result;
  }
}
