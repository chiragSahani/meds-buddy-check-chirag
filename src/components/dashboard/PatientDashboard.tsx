import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Target, Clock } from 'lucide-react';
import { AddMedicationForm } from '@/components/medications/AddMedicationForm';
import { MedicationCard } from '@/components/medications/MedicationCard';
import { useMedications, useAdherenceStats, useTodaysMedications } from '@/hooks/useMedications';
import { Skeleton } from '@/components/ui/skeleton';

export const PatientDashboard: React.FC = () => {
  const { medications, isLoading } = useMedications();
  const adherenceStats = useAdherenceStats(medications);
  const todaysMeds = useTodaysMedications();

  const completedToday = todaysMeds.filter(med => med.takenToday).length;
  const totalToday = todaysMeds.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
          </h2>
          <p className="text-muted-foreground">Ready to stay on track with your medication?</p>
        </div>
        <AddMedicationForm />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedToday}/{totalToday}</p>
                <p className="text-sm text-muted-foreground">Today's Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{adherenceStats.adherencePercentage}%</p>
                <p className="text-sm text-muted-foreground">Adherence Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{adherenceStats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{medications.length}</p>
                <p className="text-sm text-muted-foreground">Total Medications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Today's Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysMeds.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No medications added yet.</p>
              <AddMedicationForm />
            </div>
          ) : (
            <div className="grid gap-4">
              {todaysMeds.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Medications */}
      {medications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {medications.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  showActions={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};