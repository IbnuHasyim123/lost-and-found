import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from './entities/role.enum';
import { loginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { changePasswordDto } from './dto/change-password.dto';
export declare class UserService {
    private readonly userRepository;
    private jwtservice;
    constructor(userRepository: Repository<User>, jwtservice: JwtService);
    create(createUserDto: CreateUserDto, numIdentity: string): Promise<{
        status: number;
        message: any;
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
            role: UserRole;
        };
    }>;
    login(loginUserDto: loginDto): Promise<{
        status: number;
        message: string;
        token: string;
        role: UserRole;
    }>;
    changePassword(changepassworddto: changePasswordDto): Promise<{
        status: number;
        message: string;
    }>;
    updateProfile(updateUserDto: UpdateUserDto): Promise<{
        status: number;
        message: string;
    }>;
}
