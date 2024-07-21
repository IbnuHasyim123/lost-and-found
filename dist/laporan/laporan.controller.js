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
exports.LaporanController = void 0;
const common_1 = require("@nestjs/common");
const laporan_service_1 = require("./laporan.service");
const create_laporan_dto_1 = require("./dto/create-laporan.dto");
const update_laporan_dto_1 = require("./dto/update-laporan.dto");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const approve_report_dto_1 = require("./dto/approve-report.dto");
const claim_found_items_dto_1 = require("./dto/claim-found-items.dto");
const claim_lost_items_dto_1 = require("./dto/claim-lost-items.dto");
let LaporanController = class LaporanController {
    constructor(laporanService) {
        this.laporanService = laporanService;
    }
    upload(req, files, createDto) {
        const url = req.protocol + '://' + req.get('host');
        return this.laporanService.create(createDto, files, url);
    }
    findAll(query) {
        return this.laporanService.findAll(query);
    }
    AllReports(pages) {
        return this.laporanService.AllReports(pages);
    }
    reportToApprove() {
        return this.laporanService.toApprove();
    }
    claimedFoundItem(claimDTO) {
        return this.laporanService.ClaimedFoundItems(claimDTO);
    }
    claimedLostitems(claimDto) {
        return this.laporanService.FinishedFoundItems(claimDto);
    }
    findOne(id) {
        return this.laporanService.findOne(id);
    }
    findOneByAdmin(id) {
        return this.laporanService.findByAdmin(id);
    }
    findUserReports(id) {
        return this.laporanService.findReportsUser(id);
    }
    changeReportStatus(changeDto) {
        return this.laporanService.approveReports(changeDto);
    }
    update(id, updateLaporanDto) {
        return this.laporanService.update(id, updateLaporanDto);
    }
    remove(id) {
        return this.laporanService.remove(id);
    }
};
exports.LaporanController = LaporanController;
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'items', maxCount: 3 }], {
        storage: (0, multer_1.diskStorage)({
            destination: './public/images',
            filename: (req, file, cb) => {
                const uniquesuffix = Date.now() + '-' + file.originalname.split(' ')[0];
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${uniquesuffix}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg') {
                return cb(null, true);
            }
            cb(new common_1.HttpException('Harap Memasukkan Gambar Saja', common_1.HttpStatus.BAD_REQUEST), false);
        },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_laporan_dto_1.CreateLaporanDto]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/allReports'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "AllReports", null);
__decorate([
    (0, common_1.Get)('/toApprove'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "reportToApprove", null);
__decorate([
    (0, common_1.Post)('/claimfound'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [claim_found_items_dto_1.claimFoundItemsDTO]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "claimedFoundItem", null);
__decorate([
    (0, common_1.Post)('/claimlost'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [claim_lost_items_dto_1.claimLostItemsDTO]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "claimedLostitems", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "findOneByAdmin", null);
__decorate([
    (0, common_1.Get)('/user/:id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "findUserReports", null);
__decorate([
    (0, common_1.Post)('/edit/changereportstatus'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_report_dto_1.approveReportsDto]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "changeReportStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_laporan_dto_1.UpdateLaporanDto]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LaporanController.prototype, "remove", null);
exports.LaporanController = LaporanController = __decorate([
    (0, common_1.Controller)('laporan'),
    __metadata("design:paramtypes", [laporan_service_1.LaporanService])
], LaporanController);
//# sourceMappingURL=laporan.controller.js.map