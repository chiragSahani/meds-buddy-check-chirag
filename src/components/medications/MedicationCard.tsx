import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Pill, Trash2 } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useMedications } from '@/hooks/useMedications';
import { toast } from '@/components/ui/sonner';
import type { MedicationWithLogs } from '@/types/medication';

interface MedicationCardProps {
  medication: MedicationWithLogs;
  showActions?: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  showActions = true 
}) => {
  const { markMedicationTaken, deleteMedication, isMarkingTaken, isDeletingMedication } = useMedications();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const takenToday = medication.medication_logs.some(log => 
    format(new Date(log.taken_at), 'yyyy-MM-dd') === todayStr
  );

  const handleMarkTaken = () => {
    if (takenToday) {
      toast.info('Medication already marked as taken today');
      return;
    }

    markMedicationTaken({
      medication_id: medication.id,
      taken_at: new Date().toISOString(),
    });
    
    toast.success('Medication marked as taken!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      deleteMedication(medication.id);
      toast.success('Medication deleted successfully');
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      once_daily: 'Once daily',
      twice_daily: 'Twice daily',
      three_times_daily: '3x daily',
      four_times_daily: '4x daily',
      as_needed: 'As needed',
      weekly: 'Weekly',
    };
    return labels[frequency] || frequency;
  };

  return (
    <Card className={`transition-all duration-200 ${takenToday ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              takenToday ? 'bg-green-500' : 'bg-blue-100'
            }`}>
              {takenToday ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Pill className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{medication.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{medication.dosage}</p>
            </div>
          </div>
          
          <Badge variant={takenToday ? "secondary" : "outline"}>
            <Clock className="w-3 h-3 mr-1" />
            {getFrequencyLabel(medication.frequency)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {showActions && (
          <div className="flex gap-2">
            <Button
              onClick={handleMarkTaken}
              disabled={takenToday || isMarkingTaken}
              className={`flex-1 ${takenToday ? 'bg-green-600 hover:bg-green-700' : ''}`}
              variant={takenToday ? "default" : "outline"}
            >
              {takenToday ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Taken Today
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Taken
                </>
              )}
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={isDeletingMedication}
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {takenToday && (
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <Check className="w-3 h-3 mr-1" />
            Completed for today
          </p>
        )}
      </CardContent>
    </Card>
  );
};