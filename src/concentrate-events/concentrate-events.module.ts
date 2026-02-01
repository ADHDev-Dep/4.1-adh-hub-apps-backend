import { Module } from '@nestjs/common';
import { ConcentrateEventsController } from './concentrate-events.controller';
import { ConcentrateEventsService } from './concentrate-events.service';
import { SupabaseService } from 'src/auth/supabase.service';

@Module({
  controllers: [ConcentrateEventsController],
  providers: [ConcentrateEventsService, SupabaseService],
})
export class ConcentrateEventsModule {}
