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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Laporan = void 0;
const typeorm_1 = require("typeorm");
const statusLaporan_enum_1 = require("./statusLaporan.enum");
const user_entity_1 = require("../../user/entities/user.entity");
const category_enum_1 = require("./category.enum");
const case_enum_1 = require("./case.enum");
let Laporan = class Laporan {
};
exports.Laporan = Laporan;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Laporan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: '30' }),
    __metadata("design:type", String)
], Laporan.prototype, "nameItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Laporan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: case_enum_1.Case }),
    __metadata("design:type", String)
], Laporan.prototype, "case", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Laporan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Laporan.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: category_enum_1.category }),
    __metadata("design:type", String)
], Laporan.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array' }),
    __metadata("design:type", Array)
], Laporan.prototype, "urlImg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: statusLaporan_enum_1.statusLaporan, default: statusLaporan_enum_1.statusLaporan.pending }),
    __metadata("design:type", String)
], Laporan.prototype, "statusLaporan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', default: false }),
    __metadata("design:type", Boolean)
], Laporan.prototype, "statusClear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: '30', nullable: true }),
    __metadata("design:type", String)
], Laporan.prototype, "claimedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Laporan.prototype, "claimedIdentityValue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.laporan),
    __metadata("design:type", user_entity_1.User)
], Laporan.prototype, "user", void 0);
exports.Laporan = Laporan = __decorate([
    (0, typeorm_1.Entity)('laporan')
], Laporan);
//# sourceMappingURL=laporan.entity.js.map