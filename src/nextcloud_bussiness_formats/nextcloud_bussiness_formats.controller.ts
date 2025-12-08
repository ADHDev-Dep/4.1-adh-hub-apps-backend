import { Controller, Get, Param, Res } from '@nestjs/common';
import { NextcloudBussinessFormatsService } from './nextcloud_bussiness_formats.service';
import type { Response } from 'express';

@Controller('nextcloud-bussiness-formats')
export class NextcloudBussinessFormatsController {
  constructor(
    private readonly nextcloudBussinessFormatService: NextcloudBussinessFormatsService,
  ) {}

  // devuelve todo el arbol: carpetas, subcarpetas y archivos
  @Get('tree')
  getTree() {
    return this.nextcloudBussinessFormatService.getRootTree();
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
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  }
}
