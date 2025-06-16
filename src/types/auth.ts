import type { User } from '@supabase/supabase-js';
import type { Database } from './database';

export type UserRole = 'patient' | 'caretaker';

export interface AuthUser extends User {
  role?: UserRole;
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];