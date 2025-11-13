import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      storage: undefined,
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
