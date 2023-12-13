import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export type RouteRolesMetadata =
  | undefined
  | {
      allowedRoles: UserRole[];
    };

export const ROUTE_ROLES_METADATA_KEY = 'route-roles';

export const AllowRoles = (allowedRoles: UserRole[]) => {
  const metadata: RouteRolesMetadata = {
    allowedRoles,
  };
  return SetMetadata(ROUTE_ROLES_METADATA_KEY, metadata);
};
