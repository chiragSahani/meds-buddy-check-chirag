import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Target, Clock, AlertCircle, Plus } from 'lucide-react';
import { AddMedicationForm } from '@/components/medications/AddMedicationForm';
import { MedicationCard } from '@/components/medications/MedicationCard';
import { useMedications, useAdherenceStats, useTodaysMedications } from '@/hooks/useMedications';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const PatientDashboard: React.FC = () => {
  const { medications, isLoading, error } = useMedications();
  const adherenceStats = useAdherenceStats(medications);
  const todaysMeds = useTodaysMedications();

  const completedToday = todaysMeds.filter(med => med.takenToday).length;
  const totalToday = todaysMeds.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-16 w-full sm:w-96" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load medications: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {getGreeting()}!
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Ready to stay on track with your medication?
          </p>
        </div>
        <AddMedicationForm />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{completedToday}/{totalToday}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Today's Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{adherenceStats.adherencePercentage}%</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Adherence Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{adherenceStats.currentStreak}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">{medications.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Medications</p>
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-muted-foreground mb-4">No medications added yet.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start by adding your first medication to track your daily routine.
              </p>
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

      {/* Adherence Insights */}
      {medications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Adherence Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Monthly Progress</span>
                <span className="font-medium">{adherenceStats.adherencePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    adherenceStats.adherencePercentage >= 80 
                      ? 'bg-green-600' 
                      : adherenceStats.adherencePercentage >= 60 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${adherenceStats.adherencePercentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-medium text-green-600">{adherenceStats.takenDays} days</div>
                  <div className="text-muted-foreground">Taken</div>
                </div>
                <div>
                  <div className="font-medium text-red-600">{adherenceStats.totalDays - adherenceStats.takenDays} days</div>
                  <div className="text-muted-foreground">Missed</div>
                </div>
                <div>
                  <div className="font-medium text-blue-600">{adherenceStats.currentStreak} days</div>
                  <div className="text-muted-foreground">Current Streak</div>
                </div>
              </div>
              
              {adherenceStats.adherencePercentage < 80 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your adherence rate is below 80%. Try setting reminders or speaking with your healthcare provider for tips to improve medication adherence.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};