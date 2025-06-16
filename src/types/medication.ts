import type { Database } from './database';

export type Medication = Database['public']['Tables']['medications']['Row'];
export type MedicationInsert = Database['public']['Tables']['medications']['Insert'];
export type MedicationUpdate = Database['public']['Tables']['medications']['Update'];

export type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];
export type MedicationLogInsert = Database['public']['Tables']['medication_logs']['Insert'];
export type MedicationLogUpdate = Database['public']['Tables']['medication_logs']['Update'];

export interface MedicationWithLogs extends Medication {
  medication_logs: MedicationLog[];
}

export interface AdherenceStats {
  totalDays: number;
  takenDays: number;
  adherencePercentage: number;
  currentStreak: number;
}