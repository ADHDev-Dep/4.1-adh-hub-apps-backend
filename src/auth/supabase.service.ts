import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/types/database';

@Injectable()
export class SupabaseService {
  public readonly anon: SupabaseClient<Database>;
  public readonly admin: SupabaseClient<Database>;

  constructor() {
    this.anon = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );
    this.admin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      //   process.env.SUPABASE_ANON_KEY!,
    );
  }
}
