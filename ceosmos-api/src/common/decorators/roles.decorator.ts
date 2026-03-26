import { SetMetadata } from '@nestjs/common';

// Se usa string literal para evitar dependencia del cliente Prisma antes de `prisma generate`
export type Role = 'USER' | 'ADMIN';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
