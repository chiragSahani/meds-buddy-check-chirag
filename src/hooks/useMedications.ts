import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
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
import { format, startOfDay, subDays, isToday } from 'date-fns';

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

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const addMedicationMutation = useMutation({
    mutationFn: async (medication: Omit<MedicationInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('medications')
        .insert({
          ...medication,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
  });

  const updateMedicationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MedicationUpdate }) => {
      const { data, error } = await supabase
        .from('medications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
  });

  const deleteMedicationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
  });

  const markMedicationTakenMutation = useMutation({
    mutationFn: async (log: Omit<MedicationLogInsert, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('medication_logs')
        .insert({
          ...log,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] });
    },
    onMutate: async (newLog) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['medications', user?.id] });
      
      const previousMedications = queryClient.getQueryData<MedicationWithLogs[]>(['medications', user?.id]);
      
      if (previousMedications) {
        const optimisticLog: MedicationLog = {
          id: `temp-${Date.now()}`,
          medication_id: newLog.medication_id,
          user_id: user!.id,
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
    const thirtyDaysAgo = subDays(today, 29);
    
    // Get all days in the last 30 days
    const allDays: Date[] = [];
    for (let i = 0; i < 30; i++) {
      allDays.push(subDays(today, i));
    }

    // Count days where at least one medication was taken
    const takenDays = allDays.filter(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      return medications.some(med => 
        med.medication_logs.some(log => 
          format(new Date(log.taken_at), 'yyyy-MM-dd') === dayStr
        )
      );
    }).length;

    // Calculate current streak
    let currentStreak = 0;
    for (let i = 0; i < 30; i++) {
      const day = subDays(today, i);
      const dayStr = format(day, 'yyyy-MM-dd');
      const hasTakenMeds = medications.some(med => 
        med.medication_logs.some(log => 
          format(new Date(log.taken_at), 'yyyy-MM-dd') === dayStr
        )
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
    const takenToday = med.medication_logs.some(log => 
      format(new Date(log.taken_at), 'yyyy-MM-dd') === todayStr
    );
    
    return {
      ...med,
      takenToday,
    };
  });

  return todaysMeds;
};