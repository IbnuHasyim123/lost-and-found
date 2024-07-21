/// <reference types="multer" />
import { HttpStatus } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { CreateLaporanDto } from './dto/create-laporan.dto';
import { UpdateLaporanDto } from './dto/update-laporan.dto';
import { Request } from 'express';
import { statusLaporan } from './entities/statusLaporan.enum';
import { approveReportsDto } from './dto/approve-report.dto';
import { claimFoundItemsDTO } from './dto/claim-found-items.dto';
import { claimLostItemsDTO } from './dto/claim-lost-items.dto';
import { LaporanQueryFilter } from 'src/query/FilterQuery';
export declare class LaporanController {
    private readonly laporanService;
    constructor(laporanService: LaporanService);
    upload(req: Request, files: {
        items?: Express.Multer.File[];
    }, createDto: CreateLaporanDto): Promise<{
        status: number;
        message: string;
    }>;
    findAll(query: LaporanQueryFilter): Promise<{
        status: number;
        message: string;
        laporan: {
            id: string;
            nameItem: string;
            description: string;
            case: import("./entities/case.enum").Case;
            category: import("./entities/category.enum").category;
            urlImg: string[];
            statusLaporan: statusLaporan;
            statusClear: boolean;
            user: string;
            createdAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    AllReports(pages: LaporanQueryFilter): Promise<{
        status: number;
        data: import("./entities/laporan.entity").Laporan[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    reportToApprove(): Promise<{
        statusCode: number;
        reports: import("./entities/laporan.entity").Laporan[];
    }>;
    claimedFoundItem(claimDTO: claimFoundItemsDTO): Promise<{
        status: number;
        message: string;
    }>;
    claimedLostitems(claimDto: claimLostItemsDTO): Promise<{
        status: number;
        message: string;
    }>;
    findOne(id: string): Promise<{
        status: number;
        message: string;
        data: {
            id: string;
            nameItem: string;
            userName: string;
            description: string;
            case: import("./entities/case.enum").Case;
            statusLaporan: statusLaporan;
            createdAt: Date;
            updateAt: Date;
            category: import("./entities/category.enum").category;
            urlImg: string[];
            statusClear: boolean;
            claimedBy: string;
            idPemilik: string;
            email: string;
        };
    }>;
    findOneByAdmin(id: string): Promise<{
        status: number;
        message: string;
        Laporan: import("./entities/laporan.entity").Laporan;
    } | {
        status: number;
        message: string;
        Laporan?: undefined;
    }>;
    findUserReports(id: string): Promise<{
        statusCode: number;
        data: {
            id: string;
            nameItem: string;
            description: string;
            case: import("./entities/case.enum").Case;
            category: import("./entities/category.enum").category;
            urlImg: string[];
            statusLaporan: statusLaporan;
            statusClear: boolean;
            createdAt: Date;
            userId: string;
            userName: string;
        }[];
    }>;
    changeReportStatus(changeDto: approveReportsDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    update(id: string, updateLaporanDto: UpdateLaporanDto): Promise<{
        status: number;
        message: string;
        data: import("./entities/laporan.entity").Laporan;
    }>;
    remove(id: string): Promise<{
        status: number;
        message: string;
    }>;
}
