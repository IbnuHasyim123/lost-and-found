import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { UserRole } from './entities/role.enum';
import { loginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { changePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtservice: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto, numIdentity: string) {
    const { userName, email, password, noHp, statusUser } = createUserDto;
    // console.log(numIdentity);
    const emailExist = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (emailExist) {
      throw new ConflictException('Email Sudah Terdaftar');
    }

    const id = crypto.randomUUID().replace(/-/g, '');
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new User();
    user.id = 'UID' + id.slice(0, 15);
    user.userName = userName;
    user.email = email;
    user.password = hashPassword;
    user.noHp = noHp;
    user.statusUser = statusUser;
    user.numIdentity = numIdentity;
    user.role = UserRole.User;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
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

  async userInfo(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!user) throw new NotFoundException('User Tidak Ditemukan');
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
    } catch (error) {
      throw error;
    }
  }

  async login(loginUserDto: loginDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
      if (!user) throw new NotFoundException('email Tidak Ditemukan');
      const matchpassword = await bcrypt.compare(password, user.password);
      if (!matchpassword) {
        throw new HttpException('password salah', HttpStatus.UNAUTHORIZED);
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
    } catch (error) {
      throw error;
    }
  }

  async changePassword(changepassworddto: changePasswordDto) {
    const { userId, newPassword, password } = changepassworddto;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User Tidak Ditemukan');
    const matchpassword = await bcrypt.compare(password, user.password);
    try {
      if (!matchpassword) throw new UnauthorizedException('Password Salah');
      const salt = await bcrypt.genSalt();
      const newPass = await bcrypt.hash(newPassword, salt);
      user.password = newPass;
      await this.userRepository.save(user);
      return {
        status: 200,
        message: 'Password Berhasil Diganti',
      };
    } catch (error) {
      throw error;
      // if (error instanceof NotFoundException) {
      //   return {
      //     status: 404,
      //     message: error.message,
      //   };
      // }
      // return {
      //   status: 500,
      //   message: error.message,
      // };
    }
  }

  // Edit Profile
  async updateProfile(updateUserDto: UpdateUserDto) {
    const { id, noHp, noIdentity, userName } = updateUserDto;
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw new NotFoundException('User Tidak Ditemukan');
    try {
      user.noHp = noHp;
      user.numIdentity = noIdentity;
      user.userName = userName;
      await this.userRepository.save(user);
      return {
        status: 200,
        message: 'Profil Berhasil DiPerbarui',
      };
    } catch (error) {
      throw error;
    }
  }
}
