import { Prisma } from '@prisma/client';

export const ROLES = ['Admin', 'Doctor', 'Patient'];

const createRoleList = (): Prisma.RoleCreateManyInput[] => {
  const rolesCreateManyInput = ROLES.map((role) => {
    const roleCreateManyInput: Prisma.RoleCreateManyInput = {
      name: role,
      description: [role, 'role'].join(' '),
    };

    return roleCreateManyInput;
  });

  return rolesCreateManyInput;
};

export const roles: Prisma.RoleCreateManyInput[] = createRoleList();
