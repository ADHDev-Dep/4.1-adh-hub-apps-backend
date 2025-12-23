import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { NextcloudBussinessFormatsModule } from './nextcloud_bussiness_formats/nextcloud_bussiness_formats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FilesModule,
    NextcloudBussinessFormatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
