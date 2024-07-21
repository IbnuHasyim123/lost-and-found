import { UserRole } from './role.enum';
import { Laporan } from 'src/laporan/entities/laporan.entity';
import { userStatus } from './user.status.enum';
export declare class User {
    id: string;
    userName: string;
    password: string;
    email: string;
    numIdentity: string;
    noHp: string;
    role: UserRole;
    statusUser: userStatus;
    laporan: Laporan[];
}
