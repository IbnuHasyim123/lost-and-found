import { Module } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { LaporanController } from './laporan.controller';
import { ImageService } from 'src/image/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laporan } from './entities/laporan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Laporan])],
  controllers: [LaporanController],
  providers: [LaporanService, ImageService],
})
export class LaporanModule {}
