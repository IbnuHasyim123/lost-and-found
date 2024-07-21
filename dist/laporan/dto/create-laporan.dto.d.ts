import { User } from 'src/user/entities/user.entity';
import { Case } from '../entities/case.enum';
import { category } from '../entities/category.enum';
export declare class CreateLaporanDto {
    nameItem: string;
    desc: string;
    category: category;
    case: Case;
    userId: User;
}
