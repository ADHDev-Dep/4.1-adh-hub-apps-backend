import { Module } from '@nestjs/common';
import { NextcloudBussinessFormatsService } from './nextcloud_bussiness_formats.service';
import { NextcloudBussinessFormatsController } from './nextcloud_bussiness_formats.controller';

@Module({
  providers: [NextcloudBussinessFormatsService],
  controllers: [NextcloudBussinessFormatsController],
  imports: [NextcloudBussinessFormatsModule],
})
export class NextcloudBussinessFormatsModule {}
