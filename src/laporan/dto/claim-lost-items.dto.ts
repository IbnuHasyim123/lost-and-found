import { IsNotEmpty } from 'class-validator';

export class claimLostItemsDTO {
  @IsNotEmpty()
  id: string;
}
