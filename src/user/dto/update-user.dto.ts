import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  noHp: string;

  @IsNotEmpty()
  noIdentity: string;
}
