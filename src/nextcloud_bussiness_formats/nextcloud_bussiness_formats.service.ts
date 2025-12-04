import { Injectable, Logger } from '@nestjs/common';
import { webDavItem } from './interfaces/web_item.interface';
import { NextcloudFolder } from './interfaces/nextcloud_folder.interface';
import { createClient, WebDAVClient } from 'webdav';

@Injectable()
export class NextcloudBussinessFormatsService {
  private client!: WebDAVClient;
  private readonly ROOT: string;

  private readonly logger = new Logger(NextcloudBussinessFormatsService.name);
  private baseURL = process.env.NEXTCLOUD_BASE_URL;
  private auth = {
    username: process.env.NEXTCLOUD_USER || '',
    password: process.env.NEXTCLOUD_PASS || '',
  };

  constructor() {
    if (!this.baseURL || !this.auth.username) {
      this.logger.error('Nextcloud variables no configuradas en .env');
      return;
    }

    if (!process.env.NEXTCLOUD_ROOT) {
      throw new Error('Nextcloud root no esta definido');
    }

    this.ROOT = process.env.NEXTCLOUD_ROOT;

    // aqui se crea el webdav
    this.client = createClient(this.baseURL, {
      username: this.auth.username,
      password: this.auth.password,
    });
    this.logger.log('Cliente webdav nextcloud inicializado correctamente');
  }

  //traer carpetas de nextcloud
  async getFolders(): Promise<NextcloudFolder[]> {
    const contents = (await this.client.getDirectoryContents(
      this.ROOT,
    )) as webDavItem[];

    return contents
      .filter((item) => item.type === 'directory')
      .map((folder) => ({
        name: folder.basename,
        path: folder.filename,
      }));
  }

  // traer archivos de una carpeta
  async getFilesFromFolder(folder: string): Promise<NextcloudFolder[]> {
    const path = `${this.ROOT}/${folder}`;

    const contents = (await this.client.getDirectoryContents(
      path,
    )) as webDavItem[];

    return contents
      .filter((item) => item.type === 'file')
      .map((file) => ({
        name: file.basename,
        path: file.filename,
        mime: file.mime,
        size: file.size,
      }));
  }

  async getFileBuffer(folder: string, file: string) {
    const path = `${this.ROOT}/${folder}/${file}`;
    return this.client.getFileContents(path);
  }
}
