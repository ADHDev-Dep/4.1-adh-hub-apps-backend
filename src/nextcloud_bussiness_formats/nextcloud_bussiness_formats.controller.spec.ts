import { Test, TestingModule } from '@nestjs/testing';
import { NextcloudBussinessFormatsController } from './nextcloud_bussiness_formats.controller';

describe('NextcloudBussinessFormatsController', () => {
  let controller: NextcloudBussinessFormatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NextcloudBussinessFormatsController],
    }).compile();

    controller = module.get<NextcloudBussinessFormatsController>(
      NextcloudBussinessFormatsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
