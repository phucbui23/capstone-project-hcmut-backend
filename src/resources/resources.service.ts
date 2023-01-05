import { Injectable } from '@nestjs/common';
import { Prisma, Resource, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Resource[]> {
    return await this.prismaService.resource.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(where: Prisma.ResourceWhereUniqueInput): Promise<Resource> {
    return await this.prismaService.resource.findUnique({ where });
  }
}
