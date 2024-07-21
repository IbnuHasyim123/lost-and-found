import { IsNotEmpty } from 'class-validator';

export class changePasswordDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  newPassword: string;
}
