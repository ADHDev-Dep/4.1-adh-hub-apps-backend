import { Controller, UseGuards, Post, Req, Body } from '@nestjs/common';
import { SupabaseGuard } from 'src/auth/supabase.guard';
import { ConcentrateEventsService } from './concentrate-events.service';
import { CreateConcentrateEventsDto } from './dto/create-concentrate-events.dto';
// import { AuthRequest } from 'src/types/auth-request';
// import { Request } from 'express';
import * as express from 'express';

@Controller('concentrate-events')
@UseGuards(SupabaseGuard)
export class ConcentrateEventsController {
  constructor(private readonly service: ConcentrateEventsService) {}

  @Post('bulk')
  async createMany(
    @Req() req: express.Request,
    @Body() dto: CreateConcentrateEventsDto,
  ) {
    const userId = req.user!.id;
    return this.service.bulkInsert(dto.events, userId);
  }
}
