import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';

export interface AuthRequest extends Request {
  user: User;
}
