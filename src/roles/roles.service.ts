import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { roleIncludeFields } from './constants';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Role[]> {
    return await this.prismaService.role.findMany({
      include: roleIncludeFields,
    });
  }

  async findOne(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    return await this.prismaService.role.findUnique({
      where,
      include: roleIncludeFields,
    });
  }
}
