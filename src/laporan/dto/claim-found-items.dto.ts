import { IsNotEmpty } from 'class-validator';

export class claimFoundItemsDTO {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  noIdentitas: string;
}
