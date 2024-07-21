import { IsNotEmpty } from 'class-validator';
import { statusLaporan } from '../entities/statusLaporan.enum';
import { User } from 'src/user/entities/user.entity';
import { Case } from '../entities/case.enum';
import { category } from '../entities/category.enum';

export class CreateLaporanDto {
  @IsNotEmpty()
  nameItem: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  category: category;

  @IsNotEmpty()
  case: Case;

  @IsNotEmpty()
  userId: User;
}
