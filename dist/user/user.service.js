"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto = require("crypto");
const role_enum_1 = require("./entities/role.enum");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(userRepository, jwtservice) {
        this.userRepository = userRepository;
        this.jwtservice = jwtservice;
    }
    async create(createUserDto, numIdentity) {
        const { userName, email, password, noHp, statusUser } = createUserDto;
        const emailExist = await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
        if (emailExist) {
            throw new common_1.ConflictException('Email Sudah Terdaftar');
        }
        const id = crypto.randomUUID().replace(/-/g, '');
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const user = new user_entity_1.User();
        user.id = 'UID' + id.slice(0, 15);
        user.userName = userName;
        user.email = email;
        user.password = hashPassword;
        user.noHp = noHp;
        user.statusUser = statusUser;
        user.numIdentity = numIdentity;
        user.role = role_enum_1.UserRole.User;
        try {
            await this.userRepository.save(user);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                return {
                    status: 409,
                    message: error.message,
                };
            }
            return {
                status: 500,
                message: error.message,
            };
        }
        return {
            status: 201,
            message: 'Akun Berhasil dibuat',
        };
    }
    async userInfo(id) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: id,
                },
            });
            if (!user)
                throw new common_1.NotFoundException('User Tidak Ditemukan');
            return {
                statusCode: 200,
                data: {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    noHp: user.noHp,
                    statusUser: user.statusUser,
                    numIdentity: user.numIdentity,
                    role: user.role,
                },
            };
        }
        catch (error) {
            throw error;
        }
    }
    async login(loginUserDto) {
        try {
            const { email, password } = loginUserDto;
            const user = await this.userRepository.findOne({
                where: {
                    email: email,
                },
            });
            if (!user)
                throw new common_1.NotFoundException('email Tidak Ditemukan');
            const matchpassword = await bcrypt.compare(password, user.password);
            if (!matchpassword) {
                throw new common_1.HttpException('password salah', common_1.HttpStatus.UNAUTHORIZED);
            }
            const payload = {
                username: user.userName,
                role: user.role,
                userId: user.id,
            };
            const token = this.jwtservice.sign(payload, {
                secret: process.env.ACCESS_TOKEN,
                expiresIn: '14d',
            });
            return {
                status: 200,
                message: 'Login Berhasil',
                token: token,
                role: user.role,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async changePassword(changepassworddto) {
        const { userId, newPassword, password } = changepassworddto;
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User Tidak Ditemukan');
        const matchpassword = await bcrypt.compare(password, user.password);
        try {
            if (!matchpassword)
                throw new common_1.UnauthorizedException('Password Salah');
            const salt = await bcrypt.genSalt();
            const newPass = await bcrypt.hash(newPassword, salt);
            user.password = newPass;
            await this.userRepository.save(user);
            return {
                status: 200,
                message: 'Password Berhasil Diganti',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async updateProfile(updateUserDto) {
        const { id, noHp, noIdentity, userName } = updateUserDto;
        const user = await this.userRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User Tidak Ditemukan');
        try {
            user.noHp = noHp;
            user.numIdentity = noIdentity;
            user.userName = userName;
            await this.userRepository.save(user);
            return {
                status: 200,
                message: 'Profil Berhasil DiPerbarui',
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map