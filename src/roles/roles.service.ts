import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  private getIncludeFields(): Prisma.RoleInclude {
    return {
      roleAccessesResources: {
        select: {
          canAdd: true,
          canEdit: true,
          canView: true,
          canDelete: true,
          createdAt: true,
          updatedAt: true,
          resource: true,
        },
      },
    };
  }

  async findAll(): Promise<Role[]> {
    return await this.prismaService.role.findMany({
      include: this.getIncludeFields(),
    });
  }

  async findOne(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    return await this.prismaService.role.findUnique({
      where,
      include: this.getIncludeFields(),
    });
  }
}
