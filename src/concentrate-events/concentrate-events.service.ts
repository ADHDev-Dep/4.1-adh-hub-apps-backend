import { BadRequestException, Injectable } from '@nestjs/common';
// import { AuthService } from 'src/auth/auth.service';
import { SupabaseService } from 'src/auth/supabase.service';
import { CreateConcentrateEventsDto } from './dto/create-concentrate-events.dto';

type ConcentrateEvent = CreateConcentrateEventsDto['events'][number];

@Injectable()
export class ConcentrateEventsService {
  constructor(private readonly supabase: SupabaseService) {}

  async bulkInsert(events: ConcentrateEvent[], userId: string) {
    if (!events.length) {
      throw new BadRequestException('No events provided');
    }

    const rows = events.map((ev) => ({
      concentrate: ev.concentrate,
      event_date: ev.event_date,
      quantity: ev.quantity,
      fk_created_by: userId,
    }));

    const { error } = await this.supabase.admin
      .schema('app')
      .from('concentrate_events')
      .insert(rows);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return { inserted: rows.length };
  }
}
