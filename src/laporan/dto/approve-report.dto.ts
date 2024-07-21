import { IsNotEmpty } from 'class-validator';
import { statusLaporan } from '../entities/statusLaporan.enum';

export class approveReportsDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  status: statusLaporan;
}
