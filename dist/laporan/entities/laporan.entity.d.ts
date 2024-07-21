import { statusLaporan } from './statusLaporan.enum';
import { User } from 'src/user/entities/user.entity';
import { category } from './category.enum';
import { Case } from './case.enum';
export declare class Laporan {
    id: string;
    nameItem: string;
    description: string;
    case: Case;
    createdAt: Date;
    updatedAt: Date;
    category: category;
    urlImg: string[];
    statusLaporan: statusLaporan;
    statusClear: boolean;
    claimedBy: string;
    claimedIdentityValue: string;
    user: User;
}
