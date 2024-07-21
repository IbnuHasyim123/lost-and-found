"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const common_2 = require("@nestjs/common");
let ImageService = class ImageService {
    createFileInterceptor() {
        return (0, platform_express_1.FileFieldsInterceptor)([{ name: 'items', maxCount: 3 }], {
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
                cb(new common_2.HttpException('Harap Memasukkan Gambar Saja', common_2.HttpStatus.BAD_REQUEST), false);
            },
        });
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)()
], ImageService);
//# sourceMappingURL=image.service.js.map