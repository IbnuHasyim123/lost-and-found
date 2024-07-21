import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Req,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { CreateLaporanDto } from './dto/create-laporan.dto';
import { UpdateLaporanDto } from './dto/update-laporan.dto';
import { UploadedFiles } from '@nestjs/common';
import { ImageService } from 'src/image/image.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { statusLaporan } from './entities/statusLaporan.enum';
import { approveReportsDto } from './dto/approve-report.dto';
import { claimFoundItemsDTO } from './dto/claim-found-items.dto';
import { claimLostItemsDTO } from './dto/claim-lost-items.dto';
import { LaporanQueryFilter } from 'src/query/FilterQuery';

@Controller('laporan')
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Post('/add')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'items', maxCount: 3 }], {
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
    }),
  )
  upload(
    @Req() req: Request,
    @UploadedFiles() files: { items?: Express.Multer.File[] },
    @Body() createDto: CreateLaporanDto,
  ) {
    // console.log(files);
    const url = req.protocol + '://' + req.get('host');
    return this.laporanService.create(createDto, files, url);
  }

  // Get All Laporan
  @Get()
  findAll(@Query() query: LaporanQueryFilter) {
    return this.laporanService.findAll(query);
  }

  @Get('/allReports')
  AllReports(@Query() pages: LaporanQueryFilter) {
    return this.laporanService.AllReports(pages);
  }

  @Get('/toApprove')
  reportToApprove() {
    return this.laporanService.toApprove();
  }

  // Klaim Barang Hilang
  @Post('/claimfound')
  claimedFoundItem(@Body() claimDTO: claimFoundItemsDTO) {
    return this.laporanService.ClaimedFoundItems(claimDTO);
  }

  // Klaim Barang Ditemukan
  @Post('/claimlost')
  claimedLostitems(@Body() claimDto: claimLostItemsDTO) {
    return this.laporanService.FinishedFoundItems(claimDto);
  }

  // Get Laporan By User
  @Get(':id')
  @UsePipes(new ValidationPipe())
  findOne(@Param('id') id: string) {
    return this.laporanService.findOne(id);
  }

  // Get Laporan By Admin
  @Get('admin/:id')
  @UsePipes(new ValidationPipe())
  findOneByAdmin(@Param('id') id: string) {
    return this.laporanService.findByAdmin(id);
  }

  @Get('/user/:id')
  @UsePipes(new ValidationPipe())
  findUserReports(@Param('id') id: string) {
    return this.laporanService.findReportsUser(id);
  }

  @Post('/edit/changereportstatus')
  @UsePipes(new ValidationPipe())
  changeReportStatus(@Body() changeDto: approveReportsDto) {
    return this.laporanService.approveReports(changeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaporanDto: UpdateLaporanDto) {
    return this.laporanService.update(id, updateLaporanDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.laporanService.remove(id);
  }
}
