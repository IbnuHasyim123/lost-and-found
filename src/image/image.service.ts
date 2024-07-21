import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ImageService {
  createFileInterceptor() {
    return FileFieldsInterceptor([{ name: 'items', maxCount: 3 }], {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, cb) => {
          const uniquesuffix =
            Date.now() + '-' + file.originalname.split(' ')[0];
          const ext = extname(file.originalname);
          const filename = `${uniquesuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/jpeg'
        ) {
          return cb(null, true);
        }
        cb(
          new HttpException(
            'Harap Memasukkan Gambar Saja',
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      },
    });
  }
}
