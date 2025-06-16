import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MedicationCard } from '@/components/medications/MedicationCard';
import type { MedicationWithLogs } from '@/types/medication';

// Mock hooks
vi.mock('@/hooks/useMedications', () => ({
  useMedications: () => ({
    markMedicationTaken: vi.fn(),
    deleteMedication: vi.fn(),
    isMarkingTaken: false,
    isDeletingMedication: false,
  }),
}));

vi.mock('@/components/ui/sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
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
      {children}
    </QueryClientProvider>
  );
};

const mockMedication: MedicationWithLogs = {
  id: '1',
  user_id: 'test-user',
  name: 'Test Medication',
  dosage: '100mg',
  frequency: 'once_daily',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  medication_logs: [],
};

describe('MedicationCard', () => {
  it('should render medication information', () => {
    render(
      <MedicationCard medication={mockMedication} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test Medication')).toBeInTheDocument();
    expect(screen.getByText('100mg')).toBeInTheDocument();
    expect(screen.getByText('Once daily')).toBeInTheDocument();
  });

  it('should show mark as taken button when not taken today', () => {
    render(
      <MedicationCard medication={mockMedication} showActions={true} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Mark as Taken')).toBeInTheDocument();
  });

  it('should show taken status when medication is taken today', () => {
    const takenMedication: MedicationWithLogs = {
      ...mockMedication,
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
    };

    render(
      <MedicationCard medication={takenMedication} showActions={true} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Taken Today')).toBeInTheDocument();
    expect(screen.getByText('Completed for today')).toBeInTheDocument();
  });

  it('should not show actions when showActions is false', () => {
    render(
      <MedicationCard medication={mockMedication} showActions={false} />,
      { wrapper: createWrapper() }
    );

    expect(screen.queryByText('Mark as Taken')).not.toBeInTheDocument();
  });
});