import { IsNotEmpty } from 'class-validator';
import { userStatus } from '../entities/user.status.enum';

export class CreateUserDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  noHp: string;

  @IsNotEmpty()
  statusUser: userStatus;
}
