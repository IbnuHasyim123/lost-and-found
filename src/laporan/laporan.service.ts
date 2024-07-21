import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLaporanDto } from './dto/create-laporan.dto';
import { UpdateLaporanDto } from './dto/update-laporan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Laporan } from './entities/laporan.entity';
import { Repository, DataSource } from 'typeorm';
import { statusLaporan } from './entities/statusLaporan.enum';
import { approveReportsDto } from './dto/approve-report.dto';
import { claimFoundItemsDTO } from './dto/claim-found-items.dto';
import { claimLostItemsDTO } from './dto/claim-lost-items.dto';
import { LaporanQueryFilter } from 'src/query/FilterQuery';
// import * as Express from 'express';
import { Express } from 'express';

@Injectable()
export class LaporanService {
  constructor(
    @InjectRepository(Laporan)
    private readonly laporanrepository: Repository<Laporan>,
    private readonly dataSource: DataSource,
  ) {}
  async create(
    createLaporanDto: CreateLaporanDto,
    file: { items?: Express.Multer.File[] },
    url: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { desc, nameItem, case: Case, category, userId } = createLaporanDto;
      let URL = [];
      if (file.items) {
        file.items.map((i) => {
          const publicUrl = `${url}/public/images/${i.filename.replace(/\\/g, '/')}`;
          URL.push(publicUrl);
        });
      }
      const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
      const laporan = new Laporan();
      laporan.id = id;
      laporan.description = desc;
      laporan.nameItem = nameItem;
      laporan.case = Case;
      laporan.category = category;
      laporan.urlImg = URL;
      laporan.user = userId;
      // await this.laporanrepository.save(laporan);
      await queryRunner.manager.save(laporan);
      await queryRunner.commitTransaction();

      return {
        status: 200,
        message: 'Laporan Berhasil Dibuat',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filterQuery: LaporanQueryFilter) {
    const {
      Category,
      jenisLaporan,
      statusClear,
      sortDirection,
      page,
      limit = 12,
    } = filterQuery;
    try {
      const totalRecords = await this.laporanrepository.count();
      const totalPages = Math.ceil(totalRecords / limit);
      let recordsToFetch = limit;

      if (page === totalPages) {
        recordsToFetch = totalRecords - (page - 1) * limit;
      }
      const queryBuilder = this.laporanrepository
        .createQueryBuilder('laporan')
        .select([
          'laporan.id',
          'laporan.nameItem',
          'laporan.description',
          'laporan.case',
          'laporan.category',
          'laporan.urlImg',
          'laporan.statusClear',
          'laporan.createdAt',
        ])
        .leftJoinAndSelect('laporan.user', 'user')
        .where('laporan.statusLaporan = :statusLaporan', {
          statusLaporan: statusLaporan.diterima,
        });
      if (jenisLaporan) {
        queryBuilder.andWhere('laporan.case = :jenisLaporan', { jenisLaporan });
      }
      if (Category) {
        // console.log(Category);
        queryBuilder.andWhere('laporan.category = :Category', { Category });
      }
      if (statusClear) {
        queryBuilder.andWhere('laporan.statusClear = :statusClear', {
          statusClear,
        });
      }
      // console.log(Category);
      if (!jenisLaporan && !Category && statusClear === undefined) {
        // console.log('run');
        queryBuilder.where('laporan.statusLaporan = :statusLaporan', {
          statusLaporan: statusLaporan.diterima,
        });
      }
      // console.log(statusClear);
      queryBuilder
        .orderBy('laporan.statusClear', 'ASC')
        .addOrderBy('laporan.createdAt', sortDirection || 'DESC')
        .skip((page - 1) * limit)
        .take(recordsToFetch);
      const [laporan, total] = (await queryBuilder.getManyAndCount()) as [
        Laporan[],
        number,
      ];
      return {
        status: 200,
        message: 'Laporan Berhasil Diambil',
        laporan: laporan.map((i) => ({
          id: i.id,
          nameItem: i.nameItem,
          description: i.description,
          case: i.case,
          category: i.category,
          urlImg: i.urlImg,
          statusLaporan: i.statusLaporan,
          statusClear: i.statusClear,
          user: i.user.userName,
          createdAt: i.createdAt,
        })),
        pagination: {
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      throw error;
      // return error.message;
    }
  }

  async AllReports(pages: LaporanQueryFilter) {
    const { page } = pages;
    const limit = 12;
    console.log(page);
    console.log(page);

    try {
      const reports = await this.laporanrepository.find({
        where: [
          { statusLaporan: statusLaporan.diterima },
          { statusLaporan: statusLaporan.ditolak },
        ],
        order: {
          statusClear: 'ASC',
          createdAt: 'DESC',
        },
        relations: ['user'],
        skip: (page - 1) * limit,
        take: limit,
      });
      const totalReports = await this.laporanrepository.count({
        where: [
          { statusLaporan: statusLaporan.diterima },
          { statusLaporan: statusLaporan.ditolak },
        ],
      });
      const totalPages = Math.ceil(totalReports / limit);
      return {
        status: 200,
        data: reports,
        pagination: {
          total: totalReports,
          page,
          limit: limit,
          totalPages,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const laporan = await this.laporanrepository.findOne({
        where: {
          id: id,
        },
        relations: ['user'],
      });
      if (!laporan) throw new NotFoundException('Laporan Tidak Ditemukan');
      return {
        status: 200,
        message: 'Laporan Ditemukan',
        data: {
          id: laporan.id,
          nameItem: laporan.nameItem,
          userName: laporan.user.userName,
          description: laporan.description,
          case: laporan.case,
          statusLaporan: laporan.statusLaporan,
          createdAt: laporan.createdAt,
          updateAt: laporan.updatedAt,
          category: laporan.category,
          urlImg: laporan.urlImg,
          statusClear: laporan.statusClear,
          claimedBy: laporan.claimedBy,
          idPemilik: laporan.claimedIdentityValue,
          email: laporan.user.email,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // FindUser Reports
  async findReportsUser(id: any) {
    try {
      const laporan = await this.laporanrepository.find({
        where: {
          user: {
            id: id,
          },
        },
        order: {
          statusClear: 'ASC',
          createdAt: 'DESC',
        },
        relations: ['user'],
      });
      if (!laporan)
        throw new NotFoundException('Tidak Ada Laporan YAng Dibuat');

      return {
        statusCode: 200,
        data: laporan.map((i) => ({
          id: i.id,
          nameItem: i.nameItem,
          description: i.description,
          case: i.case,
          category: i.category,
          urlImg: i.urlImg,
          statusLaporan: i.statusLaporan,
          statusClear: i.statusClear,
          createdAt: i.createdAt,
          userId: i.user.id,
          userName: i.user.userName,
        })),
      };
    } catch (error) {
      throw error;
    }
  }

  async findByAdmin(id: string) {
    try {
      const laporan = await this.laporanrepository.findOne({
        where: {
          id: id,
        },
      });
      if (!laporan) throw new NotFoundException('Laporan Tidak Ditemukan');
      return {
        status: 200,
        message: 'Laporan Ditemukan',
        Laporan: laporan,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          status: 404,
          message: error.message,
        };
      }
      return {
        status: 500,
        message: 'Kesalahan Server',
      };
    }
  }

  async ClaimedFoundItems(claimedDTO: claimFoundItemsDTO) {
    const { id, name, noIdentitas } = claimedDTO;
    try {
      const report = await this.laporanrepository.findOne({
        where: {
          id: id,
        },
      });
      if (!report) throw new NotFoundException('Laporan Tidak Ditemukan');
      report.claimedBy = name;
      report.claimedIdentityValue = noIdentitas;
      report.statusClear = true;
      await this.laporanrepository.save(report);
      return {
        status: 200,
        message: 'Laporan Berhasil DiSelesaikan',
      };
    } catch (error) {
      throw error;
    }
  }

  async FinishedFoundItems(claimDto: claimLostItemsDTO) {
    const { id } = claimDto;
    try {
      const report = await this.laporanrepository.findOne({
        where: {
          id: id,
        },
      });
      if (!report) throw new NotFoundException('Laporan Tidak Ditemukan');
      report.statusClear = true;
      await this.laporanrepository.save(report);

      return {
        status: 200,
        message: 'Laporan Berhasil DiSelesaikan',
      };
    } catch (error) {
      throw error;
    }
  }

  async toApprove() {
    try {
      const reports = await this.laporanrepository.find({
        where: {
          statusLaporan: statusLaporan.pending,
        },
      });

      if (!reports) throw new NotFoundException('Tidak Ada Laporan baru');
      return {
        statusCode: 200,
        reports: reports,
      };
    } catch (error) {
      throw error;
    }
  }

  async approveReports(changeDto: approveReportsDto) {
    const { id, status } = changeDto;
    const report = await this.laporanrepository.findOne({
      where: {
        id: id,
      },
    });
    if (!report) throw new NotFoundException('Laporan tidak ditemukan');
    try {
      report.statusLaporan = status;
      await this.laporanrepository.save(report);
      return {
        statusCode: HttpStatus.OK,
        message: `Laporan ${status}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateLaporanDto: UpdateLaporanDto) {
    const { desc, nameItem, case: Case, category } = updateLaporanDto;
    const laporan = await this.laporanrepository.findOne({
      where: {
        id: id,
      },
    });
    if (!laporan) throw new NotFoundException('Laporan Tidak Ditemukan');
    laporan.description = desc;
    laporan.nameItem = nameItem;
    laporan.case = Case;
    laporan.category = category;
    await this.laporanrepository.save(laporan);
    return {
      status: 200,
      message: 'Laporan Berhasil Diupdate',
      data: laporan,
    };
  }

  async remove(id: string) {
    const laporan = await this.laporanrepository.findOne({
      where: {
        id: id,
      },
    });

    if (!laporan) throw new NotFoundException('Laporan Tidak Ditemukan');
    try {
      await this.laporanrepository.remove(laporan);
      return {
        status: 200,
        message: 'Laporan Berhasil Dihapus',
      };
    } catch (error) {
      throw error;
    }
  }
}
