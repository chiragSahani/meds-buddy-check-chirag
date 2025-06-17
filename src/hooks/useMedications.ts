import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { 
  Medication, 
  MedicationInsert, 
  MedicationUpdate,
  MedicationLog,
  MedicationLogInsert,
  MedicationWithLogs,
  AdherenceStats 
} from '@/types/medication';
import { format, startOfDay, subDays, isToday, parseISO } from 'date-fns';

export const useMedications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const medicationsQuery = useQuery({
    queryKey: ['medications', user?.id],
    queryFn: async (): Promise<MedicationWithLogs[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('medications')
        .select(`
          *,
          medication_logs (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('JWT') || error.message.includes('auth')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const addMedicationMutation = useMutation({
    mutationFn: async (medication: Omit<MedicationInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      // Validate input
      if (!medication.name?.trim()) {
        throw new Error('Medication name is required');
      }
      if (!medication.dosage?.trim()) {
        throw new Error('Dosage is required');
      }
      if (!medication.frequency) {
        throw new Error('Frequency is required');
      }

      const { data, error } = await supabase
        .from('medications')
        .insert({
          ...medication,
          user_id: user.id,
          name: medication.name.trim(),
          dosage: medication.dosage.trim(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
    onError: (error) => {
      console.error('Add medication error:', error);
    },
  });

  const updateMedicationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MedicationUpdate }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('medications')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user owns the medication
        .select()
        .single();

      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
  });

  const deleteMedicationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user owns the medication

      if (error) {
        throw new Error(handleSupabaseError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
  });

  const markMedicationTakenMutation = useMutation({
    mutationFn: async (log: Omit<MedicationLogInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      // Validate that the medication belongs to the user
      const { data: medication, error: medError } = await supabase
        .from('medications')
        .select('id')
        .eq('id', log.medication_id)
        .eq('user_id', user.id)
        .single();

      if (medError || !medication) {
        throw new Error('Medication not found or access denied');
      }

      const { data, error } = await supabase
        .from('medication_logs')
        .insert({
          ...log,
          user_id: user.id,
          taken_at: log.taken_at || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
    onMutate: async (newLog) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['medications', user?.id] });
      
      const previousMedications = queryClient.getQueryData<MedicationWithLogs[]>(['medications', user?.id]);
      
      if (previousMedications && user) {
        const optimisticLog: MedicationLog = {
          id: `temp-${Date.now()}`,
          medication_id: newLog.medication_id,
          user_id: user.id,
          taken_at: newLog.taken_at || new Date().toISOString(),
          notes: newLog.notes || null,
          photo_url: newLog.photo_url || null,
          created_at: new Date().toISOString(),
        };

        const updatedMedications = previousMedications.map(med => 
          med.id === newLog.medication_id 
            ? { ...med, medication_logs: [...med.medication_logs, optimisticLog] }
            : med
        );

        queryClient.setQueryData(['medications', user?.id], updatedMedications);
      }

      return { previousMedications };
    },
    onError: (err, newLog, context) => {
      console.error('Mark medication taken error:', err);
      if (context?.previousMedications) {
        queryClient.setQueryData(['medications', user?.id], context.previousMedications);
      }
    },
  });

  return {
    medications: medicationsQuery.data || [],
    isLoading: medicationsQuery.isLoading,
    error: medicationsQuery.error,
    addMedication: addMedicationMutation.mutate,
    updateMedication: updateMedicationMutation.mutate,
    deleteMedication: deleteMedicationMutation.mutate,
    markMedicationTaken: markMedicationTakenMutation.mutate,
    isAddingMedication: addMedicationMutation.isPending,
    isUpdatingMedication: updateMedicationMutation.isPending,
    isDeletingMedication: deleteMedicationMutation.isPending,
    isMarkingTaken: markMedicationTakenMutation.isPending,
    refetch: medicationsQuery.refetch,
  };
};

export const useAdherenceStats = (medications: MedicationWithLogs[]): AdherenceStats => {
  const calculateStats = (): AdherenceStats => {
    if (medications.length === 0) {
      return {
        totalDays: 0,
        takenDays: 0,
        adherencePercentage: 0,
        currentStreak: 0,
      };
    }

    const today = startOfDay(new Date());
    
    // Get all days in the last 30 days
    const allDays: Date[] = [];
    for (let i = 0; i < 30; i++) {
      allDays.push(subDays(today, i));
    }

    // Count days where at least one medication was taken
    const takenDays = allDays.filter(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      return medications.some(med => 
        med.medication_logs.some(log => {
          try {
            const logDate = parseISO(log.taken_at);
            return format(logDate, 'yyyy-MM-dd') === dayStr;
          } catch {
            return false;
          }
        })
      );
    }).length;

    // Calculate current streak (consecutive days from today backwards)
    let currentStreak = 0;
    for (let i = 0; i < 30; i++) {
      const day = subDays(today, i);
      const dayStr = format(day, 'yyyy-MM-dd');
      const hasTakenMeds = medications.some(med => 
        med.medication_logs.some(log => {
          try {
            const logDate = parseISO(log.taken_at);
            return format(logDate, 'yyyy-MM-dd') === dayStr;
          } catch {
            return false;
          }
        })
      );

      if (hasTakenMeds) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalDays: 30,
      takenDays,
      adherencePercentage: Math.round((takenDays / 30) * 100),
      currentStreak,
    };
  };

  return calculateStats();
};

export const useTodaysMedications = () => {
  const { medications } = useMedications();
  
  const todaysMeds = medications.map(med => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const takenToday = med.medication_logs.some(log => {
      try {
        const logDate = parseISO(log.taken_at);
        return format(logDate, 'yyyy-MM-dd') === todayStr;
      } catch {
        return false;
      }
    });
    
    return {
      ...med,
      takenToday,
    };
  });

  return todaysMeds;
};