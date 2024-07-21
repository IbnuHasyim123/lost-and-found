import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserRole } from './role.enum';
import { Laporan } from 'src/laporan/entities/laporan.entity';
import { userStatus } from './user.status.enum';

@Entity('user')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  userName: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', length: 150 })
  numIdentity: string;

  @Column({ type: 'varchar', length: 15 })
  noHp: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: userStatus })
  statusUser: userStatus;

  @OneToMany(() => Laporan, (laporan) => laporan.user)
  laporan: Laporan[];
}
