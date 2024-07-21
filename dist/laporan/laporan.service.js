"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaporanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crypto = require("crypto");
const laporan_entity_1 = require("./entities/laporan.entity");
const typeorm_2 = require("typeorm");
const statusLaporan_enum_1 = require("./entities/statusLaporan.enum");
let LaporanService = class LaporanService {
    constructor(laporanrepository, dataSource) {
        this.laporanrepository = laporanrepository;
        this.dataSource = dataSource;
    }
    async create(createLaporanDto, file, url) {
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
            const laporan = new laporan_entity_1.Laporan();
            laporan.id = id;
            laporan.description = desc;
            laporan.nameItem = nameItem;
            laporan.case = Case;
            laporan.category = category;
            laporan.urlImg = URL;
            laporan.user = userId;
            await queryRunner.manager.save(laporan);
            await queryRunner.commitTransaction();
            return {
                status: 200,
                message: 'Laporan Berhasil Dibuat',
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.HttpException(error, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(filterQuery) {
        const { Category, jenisLaporan, statusClear, sortDirection, page, limit = 12, } = filterQuery;
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
                statusLaporan: statusLaporan_enum_1.statusLaporan.diterima,
            });
            if (jenisLaporan) {
                queryBuilder.andWhere('laporan.case = :jenisLaporan', { jenisLaporan });
            }
            if (Category) {
                queryBuilder.andWhere('laporan.category = :Category', { Category });
            }
            if (statusClear) {
                queryBuilder.andWhere('laporan.statusClear = :statusClear', {
                    statusClear,
                });
            }
            if (!jenisLaporan && !Category && statusClear === undefined) {
                queryBuilder.where('laporan.statusLaporan = :statusLaporan', {
                    statusLaporan: statusLaporan_enum_1.statusLaporan.diterima,
                });
            }
            queryBuilder
                .orderBy('laporan.statusClear', 'ASC')
                .addOrderBy('laporan.createdAt', sortDirection || 'DESC')
                .skip((page - 1) * limit)
                .take(recordsToFetch);
            const [laporan, total] = (await queryBuilder.getManyAndCount());
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
        }
        catch (error) {
            throw error;
        }
    }
    async AllReports(pages) {
        const { page } = pages;
        const limit = 12;
        console.log(page);
        console.log(page);
        try {
            const reports = await this.laporanrepository.find({
                where: [
                    { statusLaporan: statusLaporan_enum_1.statusLaporan.diterima },
                    { statusLaporan: statusLaporan_enum_1.statusLaporan.ditolak },
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
                    { statusLaporan: statusLaporan_enum_1.statusLaporan.diterima },
                    { statusLaporan: statusLaporan_enum_1.statusLaporan.ditolak },
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
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const laporan = await this.laporanrepository.findOne({
                where: {
                    id: id,
                },
                relations: ['user'],
            });
            if (!laporan)
                throw new common_1.NotFoundException('Laporan Tidak Ditemukan');
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
        }
        catch (error) {
            throw error;
        }
    }
    async findReportsUser(id) {
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
                throw new common_1.NotFoundException('Tidak Ada Laporan YAng Dibuat');
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
        }
        catch (error) {
            throw error;
        }
    }
    async findByAdmin(id) {
        try {
            const laporan = await this.laporanrepository.findOne({
                where: {
                    id: id,
                },
            });
            if (!laporan)
                throw new common_1.NotFoundException('Laporan Tidak Ditemukan');
            return {
                status: 200,
                message: 'Laporan Ditemukan',
                Laporan: laporan,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
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
    async ClaimedFoundItems(claimedDTO) {
        const { id, name, noIdentitas } = claimedDTO;
        try {
            const report = await this.laporanrepository.findOne({
                where: {
                    id: id,
                },
            });
            if (!report)
                throw new common_1.NotFoundException('Laporan Tidak Ditemukan');
            report.claimedBy = name;
            report.claimedIdentityValue = noIdentitas;
            report.statusClear = true;
            await this.laporanrepository.save(report);
            return {
                status: 200,
                message: 'Laporan Berhasil DiSelesaikan',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async FinishedFoundItems(claimDto) {
        const { id } = claimDto;
        try {
            const report = await this.laporanrepository.findOne({
                where: {
                    id: id,
                },
            });
            if (!report)
                throw new common_1.NotFoundException('Laporan Tidak Ditemukan');
            report.statusClear = true;
            await this.laporanrepository.save(report);
            return {
                status: 200,
                message: 'Laporan Berhasil DiSelesaikan',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async toApprove() {
        try {
            const reports = await this.laporanrepository.find({
                where: {
                    statusLaporan: statusLaporan_enum_1.statusLaporan.pending,
                },
            });
            if (!reports)
                throw new common_1.NotFoundException('Tidak Ada Laporan baru');
            return {
                statusCode: 200,
                reports: reports,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async approveReports(changeDto) {
        const { id, status } = changeDto;
        const report = await this.laporanrepository.findOne({
            where: {
                id: id,
            },
        });
        if (!report)
            throw new common_1.NotFoundException('Laporan tidak ditemukan');
        try {
            report.statusLaporan = status;
            await this.laporanrepository.save(report);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: `Laporan ${status}`,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateLaporanDto) {
        const { desc, nameItem, case: Case, category } = updateLaporanDto;
        const laporan = await this.laporanrepository.findOne({
            where: {
                id: id,
            },
        });
        if (!laporan)
            throw new common_1.NotFoundException('Laporan Tidak Ditemukan');
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
    async remove(id) {
        const laporan = await this.laporanrepository.findOne({
            where: {
                id: id,
            },
        });
        if (!laporan)
            throw new common_1.NotFoundException('Laporan Tidak Ditemukan');
        try {
            await this.laporanrepository.remove(laporan);
            return {
                status: 200,
                message: 'Laporan Berhasil Dihapus',
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.LaporanService = LaporanService;
exports.LaporanService = LaporanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(laporan_entity_1.Laporan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], LaporanService);
//# sourceMappingURL=laporan.service.js.map