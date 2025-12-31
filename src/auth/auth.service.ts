import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from './interfaces/user-profile.interface';

@Injectable()
export class AuthService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new UnauthorizedException(error.message);
    }

    const userId = data.user.id;

    const { data: profile, error: profileError } = await this.supabase
      .schema('app')
      .from('users')
      .select('id, name, paternal_surname, maternal_surname, role')
      .eq('id', userId)
      .single<UserProfile>();

    if (profileError) {
      console.log('Error details:', profileError); // <--- Revisa esto en tu terminal de NestJS
      throw new UnauthorizedException(`Error DB: ${profileError.message}`);
    }

    return {
      session: data.session,
      user: profile,
    };
  }
}
