import { SetMetadata } from "@nestjs/common";
import {Role} from "../roles.enum";

export const ROLES_KEY  = Role.ADMIN || Role.USER
export const RoleD = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);