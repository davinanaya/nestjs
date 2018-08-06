import { UserRole } from "user/models/user-role.enum";

export interface JwtPayLoad {
    username: string,
    role: UserRole
    iat?: Date
}