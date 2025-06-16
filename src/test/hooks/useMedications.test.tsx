import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMedications, useAdherenceStats } from '@/hooks/useMedications';
import { AuthProvider } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { MedicationWithLogs } from '@/types/medication';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    profile: { role: 'patient' },
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('useMedications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Supabase from method
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'test-id', name: 'Test Med' },
            error: null,
          }),
        }),
      }),
    });
    
    (supabase.from as any).mockImplementation(mockFrom);
  });

  it('should fetch medications', async () => {
    const { result } = renderHook(() => useMedications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.medications).toEqual([]);
    expect(supabase.from).toHaveBeenCalledWith('medications');
  });

  it('should provide medication methods', () => {
    const { result } = renderHook(() => useMedications(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.addMedication).toBe('function');
    expect(typeof result.current.updateMedication).toBe('function');
    expect(typeof result.current.deleteMedication).toBe('function');
    expect(typeof result.current.markMedicationTaken).toBe('function');
  });
});

describe('useAdherenceStats', () => {
  it('should calculate adherence stats correctly', () => {
    const mockMedications: MedicationWithLogs[] = [
      {
        id: '1',
        user_id: 'test-user',
        name: 'Test Med',
        dosage: '100mg',
        frequency: 'once_daily',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        medication_logs: [
          {
            id: '1',
            medication_id: '1',
            user_id: 'test-user',
            taken_at: new Date().toISOString(),
            notes: null,
            photo_url: null,
            created_at: new Date().toISOString(),
          },
        ],
      },
    ];

    const { result } = renderHook(() => useAdherenceStats(mockMedications));

    expect(result.current.totalDays).toBe(30);
    expect(result.current.takenDays).toBeGreaterThanOrEqual(0);
    expect(result.current.adherencePercentage).toBeGreaterThanOrEqual(0);
    expect(result.current.adherencePercentage).toBeLessThanOrEqual(100);
    expect(result.current.currentStreak).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty medications array', () => {
    const { result } = renderHook(() => useAdherenceStats([]));

    expect(result.current.totalDays).toBe(0);
    expect(result.current.takenDays).toBe(0);
    expect(result.current.adherencePercentage).toBe(0);
    expect(result.current.currentStreak).toBe(0);
  });
});