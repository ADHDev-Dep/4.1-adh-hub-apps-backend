/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private baseURL = process.env.NEXTCLOUD_BASE_URL;
  private auth = {
    username: process.env.NEXTCLOUD_USER || '',
    password: process.env.NEXTCLOUD_PASS || '',
  };

  constructor() {
    if (!this.baseURL || !this.auth.username) {
      this.logger.error('Nextcloud variables no configuradas en .env');
    }
  }

  private async mkcolIfNotExists(targetUrl: string) {
    try {
      // intentamos crear la carpeta:
      // si ya existe nexcloud responde con 405 method not allowed
      await axios
        .request({
          method: 'MKCOL',
          url: targetUrl,
          auth: this.auth,
          validateStatus: () => true,
        })
        .then((res) => {
          // 201 created, 405 exists, 409 conflict, etc.
          if (res.status === 201)
            this.logger.log(`Carpeta creada: ${targetUrl}`);
          if (res.status === 405)
            this.logger.log(`Carpeta ya existe: ${targetUrl}`);
          if (res.status === 400)
            this.logger.log(`MKCOL status ${res.status} para ${targetUrl}`);
        });
    } catch (err) {
      this.logger.error(`Error MKCOL ${targetUrl} - ${err}`);
    }
  }

  private async ensureNestedPath(relativePath: string) {
    // relativePath ejemplo: Documentacion - Partidas/2025/Completos - Facturas y Guias/1. Enero/Proveedor/8877
    const segments = relativePath.split('/');
    let currentPath = '';

    for (const segment of segments) {
      if (!segment.trim()) continue;
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const url = `${this.baseURL}/${encodeURI(currentPath)}`;

      try {
        const res = await axios.request({
          method: 'PROPFIND',
          url,
          auth: this.auth,
          validateStatus: () => true,
        });

        if (res.status === 404) {
          await axios.request({
            method: 'MKCOL',
            url,
            auth: this.auth,
            validateStatus: () => true,
          });
          this.logger.log(`Carpeta creada: ${url}`);
        } else if (res.status === 207) {
          this.logger.log(`Carpeta ya existe: ${url}`);
        } else {
          this.logger.warn(
            `Respuesta inesperada (${res.status}) al verificar ${url}`,
          );
        }
      } catch (err) {
        this.logger.error(`Error verificando/creando carpeta ${url}: ${err}`);
      }
    }
  }

  private parseDateToYearMonth(dateStr: string) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const monthNames = [
      '01. Enero',
      '02. Febrero',
      '03. Marzo',
      '04. Abril',
      '05. Mayo',
      '06. Junio',
      '07. Julio',
      '08. Agosto',
      '09. Septiembre',
      '10. Octubre',
      '11. Noviembre',
      '12. Diciembre',
    ];
    const monthFolder = monthNames[date.getMonth()];
    return { year, monthFolder };
  }

  async handleUpload(
    body: UploadDto,
    file: Express.Multer.File,
  ): Promise<{ success: boolean; path?: string; error?: string }> {
    if (!file) throw new BadRequestException('Archivo no recibido');

    const { folio, provider, fileType, date } = body;
    const { year, monthFolder } = this.parseDateToYearMonth(date);
    const root = 'Documentacion - Partidas';
    const baseRelative = `${root}/${year}/Completos - Facturas y Guias/${monthFolder}/${provider}/${folio}`;

    // 1. asegura la estructura iterando MKCOL por cada segmento
    await this.ensureNestedPath(baseRelative);

    //2. subir el archivo al directorio final
    const safeFileName = `${fileType} - ${provider} - ${folio}${path.extname(file.originalname) || '.pdf'}`;

    // guardamos temporalmente
    const tmpPath = path.join(os.tmpdir(), `${Date.now()}-${safeFileName}`);

    const buffer: Buffer = file.buffer;
    fs.writeFileSync(tmpPath, buffer);

    const targetUrl = `${this.baseURL}/${encodeURI(baseRelative)}/${encodeURI(safeFileName)}`;

    try {
      const stream = fs.createReadStream(tmpPath);
      const contentType: string = file.mimetype || 'application/pdf';
      this.logger.log(`Intentando subir a: ${targetUrl}`);

      await axios.put(targetUrl, stream, {
        auth: this.auth,
        headers: { 'Content-Type': contentType },
        maxBodyLength: Infinity,
        validateStatus: () => true,
      });
      fs.unlinkSync(tmpPath);
      return { success: true, path: `${baseRelative}/${safeFileName}` };
    } catch (err) {
      this.logger.error(
        `Error en PUT: ${err.response?.status} ${err.response?.statusText}`,
      );

      this.logger.error('Error subiendo archivo: ' + err);
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
