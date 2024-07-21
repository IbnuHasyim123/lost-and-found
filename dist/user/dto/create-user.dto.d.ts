import { userStatus } from '../entities/user.status.enum';
export declare class CreateUserDto {
    userName: string;
    email: string;
    password: string;
    noHp: string;
    statusUser: userStatus;
}
