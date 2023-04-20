import { RoleType } from "../role/RoleType";

export type UserType = {
    id: string;
    fullname: string;
    email: string;
    password?: string;
    role: RoleType;
    roleId?: string;
};