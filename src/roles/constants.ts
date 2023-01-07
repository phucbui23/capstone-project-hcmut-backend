import { Prisma } from '@prisma/client';

export const roleIncludeFields: Prisma.RoleInclude = {
  roleAccessesResources: {
    include: {
      resource: true,
    },
  },
};
