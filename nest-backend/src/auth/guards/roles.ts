import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../types';
export const RolesKey = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(RolesKey, roles);
