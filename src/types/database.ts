export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'patient' | 'caretaker'
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'patient' | 'caretaker'
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'patient' | 'caretaker'
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          user_id: string
          name: string
          dosage: string
          frequency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage: string
          frequency: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dosage?: string
          frequency?: string
          created_at?: string
          updated_at?: string
        }
      }
      medication_logs: {
        Row: {
          id: string
          medication_id: string
          user_id: string
          taken_at: string
          notes: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          medication_id: string
          user_id: string
          taken_at?: string
          notes?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          medication_id?: string
          user_id?: string
          taken_at?: string
          notes?: string | null
          photo_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'patient' | 'caretaker'
    }
  }
}