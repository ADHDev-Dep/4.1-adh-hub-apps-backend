import { Test, TestingModule } from '@nestjs/testing';
import { NextcloudBussinessFormatsService } from './nextcloud_bussiness_formats.service';

describe('NextcloudBussinessFormatsService', () => {
  let service: NextcloudBussinessFormatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NextcloudBussinessFormatsService],
    }).compile();

    service = module.get<NextcloudBussinessFormatsService>(
      NextcloudBussinessFormatsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
