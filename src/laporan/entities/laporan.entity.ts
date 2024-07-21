import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { statusLaporan } from './statusLaporan.enum';
import { User } from 'src/user/entities/user.entity';
import { category } from './category.enum';
import { Case } from './case.enum';

@Entity('laporan')
export class Laporan {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'varchar', length: '30' })
  nameItem: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: Case })
  case: Case;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'enum', enum: category })
  category: category;

  @Column({ type: 'simple-array' })
  urlImg: string[];

  @Column({ type: 'enum', enum: statusLaporan, default: statusLaporan.pending })
  statusLaporan: statusLaporan;

  @Column({ type: 'bool', default: false })
  statusClear: boolean;

  @Column({ type: 'varchar', length: '30', nullable: true })
  claimedBy: string;

  @Column({ type: 'varchar', nullable: true })
  claimedIdentityValue: string;

  @ManyToOne(() => User, (user) => user.laporan)
  user: User;
}
