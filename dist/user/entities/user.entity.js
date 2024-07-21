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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const role_enum_1 = require("./role.enum");
const laporan_entity_1 = require("../../laporan/entities/laporan.entity");
const user_status_enum_1 = require("./user.status.enum");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], User.prototype, "numIdentity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], User.prototype, "noHp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: role_enum_1.UserRole }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: user_status_enum_1.userStatus }),
    __metadata("design:type", String)
], User.prototype, "statusUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => laporan_entity_1.Laporan, (laporan) => laporan.user),
    __metadata("design:type", Array)
], User.prototype, "laporan", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('user')
], User);
//# sourceMappingURL=user.entity.js.map