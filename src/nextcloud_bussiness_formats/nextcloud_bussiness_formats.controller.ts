import { Controller, Get, Param, Res } from '@nestjs/common';
import { NextcloudBussinessFormatsService } from './nextcloud_bussiness_formats.service';
import type { Response } from 'express';

@Controller('nextcloud-bussiness-formats')
export class NextcloudBussinessFormatsController {
  constructor(
    private readonly nextcloudBussinessFormatService: NextcloudBussinessFormatsService,
  ) {}

  // obtener carpetas
  @Get('folders')
  getFolders() {
    return this.nextcloudBussinessFormatService.getFolders();
  }
  // obtener archivos de una carpeta
  @Get('folder/:name')
  getFiles(@Param('name') name: string) {
    return this.nextcloudBussinessFormatService.getFilesFromFolder(name);
  }
  // descarga d archivo y visualizacion
  @Get('download/:folder/:file')
  async downloadFile(
    @Param('folder') folder: string,
    @Param('file') file: string,
    @Res() res: Response,
  ) {
    const buffer = await this.nextcloudBussinessFormatService.getFileBuffer(
      folder,
      file,
    );
    res.send(buffer);
  }
}
