import { UserRole } from '@prisma/client';
export type RouteRolesMetadata = undefined | {
    allowedRoles: UserRole[];
};
export declare const ROUTE_ROLES_METADATA_KEY = "route-roles";
export declare const AllowRoles: (allowedRoles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
