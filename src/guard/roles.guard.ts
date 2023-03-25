import { CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole = user.role;
    return roles.some((role) => userRole.include(role));
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
