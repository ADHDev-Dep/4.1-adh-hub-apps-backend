import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDto } from './dto/upload.dto';
import axios from 'axios';

@Controller('nextcloud')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDto,
  ) {
    //body
    return this.filesService.handleUpload(body, file);
  }

  @Get('check')
  async checkConnection() {
    const baseUrl = process.env.NEXTCLOUD_BASE_URL ?? '';
    const username = process.env.NEXTCLOUD_USER ?? '';
    const password = process.env.NEXTCLOUD_PASS ?? '';

    if (!baseUrl || !username || !password) {
      return { status: 500, message: 'Faltan variables NEXTCLOUD_* en .env' };
    }

    const res = await axios.get(baseUrl, {
      auth: {
        username,
        password,
      },
      validateStatus: () => true,
    });

    return { status: res.status, statusText: res.statusText };
  }
}
