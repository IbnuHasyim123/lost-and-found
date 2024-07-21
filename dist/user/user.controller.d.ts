import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login-user.dto';
import { changePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto, numIdentity: string): Promise<{
        status: number;
        message: any;
    }>;
    login(logindto: loginDto): Promise<{
        status: number;
        message: string;
        token: string;
        role: import("./entities/role.enum").UserRole;
    }>;
    userInfo(id: string): Promise<{
        statusCode: number;
        data: {
            id: string;
            userName: string;
            email: string;
            noHp: string;
            statusUser: import("./entities/user.status.enum").userStatus;
            numIdentity: string;
            role: import("./entities/role.enum").UserRole;
        };
    }>;
    updateProfile(updateDto: UpdateUserDto): Promise<{
        status: number;
        message: string;
    }>;
    changePassword(changepassworddto: changePasswordDto): Promise<{
        status: number;
        message: string;
    }>;
}
