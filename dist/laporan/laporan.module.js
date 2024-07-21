"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaporanModule = void 0;
const common_1 = require("@nestjs/common");
const laporan_service_1 = require("./laporan.service");
const laporan_controller_1 = require("./laporan.controller");
const image_service_1 = require("../image/image.service");
const typeorm_1 = require("@nestjs/typeorm");
const laporan_entity_1 = require("./entities/laporan.entity");
let LaporanModule = class LaporanModule {
};
exports.LaporanModule = LaporanModule;
exports.LaporanModule = LaporanModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([laporan_entity_1.Laporan])],
        controllers: [laporan_controller_1.LaporanController],
        providers: [laporan_service_1.LaporanService, image_service_1.ImageService],
    })
], LaporanModule);
//# sourceMappingURL=laporan.module.js.map