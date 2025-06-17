import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, AlertTriangle, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useMedications, useAdherenceStats } from '@/hooks/useMedications';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format, parseISO } from 'date-fns';

export const CaretakerDashboard: React.FC = () => {
  const { medications, isLoading, error } = useMedications();
  const adherenceStats = useAdherenceStats(medications);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load medication data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysMedications = medications.map(med => {
    const takenToday = med.medication_logs.some(log => {
      try {
        const logDate = parseISO(log.taken_at);
        return format(logDate, 'yyyy-MM-dd') === todayStr;
      } catch {
        return false;
      }
    });
    return { ...med, takenToday };
  });

  const completedToday = todaysMedications.filter(med => med.takenToday).length;
  const totalToday = todaysMedications.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Caretaker Dashboard</h2>
            <p className="text-white/90 text-sm sm:text-lg">Monitoring medication adherence</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold">{adherenceStats.adherencePercentage}%</div>
            <div className="text-white/80 text-xs sm:text-sm">Adherence Rate</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold">{adherenceStats.currentStreak}</div>
            <div className="text-white/80 text-xs sm:text-sm">Current Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold">{adherenceStats.totalDays - adherenceStats.takenDays}</div>
            <div className="text-white/80 text-xs sm:text-sm">Missed This Month</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold">{medications.length}</div>
            <div className="text-white/80 text-xs sm:text-sm">Total Medications</div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Adherence Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-medium">{adherenceStats.adherencePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    adherenceStats.adherencePercentage >= 80 
                      ? 'bg-green-600' 
                      : adherenceStats.adherencePercentage >= 60 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${adherenceStats.adherencePercentage}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-green-600">{adherenceStats.takenDays} days</div>
                  <div className="text-muted-foreground">Taken</div>
                </div>
                <div>
                  <div className="font-medium text-red-600">{adherenceStats.totalDays - adherenceStats.takenDays} days</div>
                  <div className="text-muted-foreground">Missed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Today's Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{completedToday}/{totalToday}</div>
                <div className="text-sm text-muted-foreground">Medications taken today</div>
              </div>
              
              {totalToday === 0 ? (
                <p className="text-muted-foreground text-center">No medications to track</p>
              ) : (
                <div className="space-y-2">
                  {todaysMedications.slice(0, 3).map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{medication.name}</span>
                      <Badge variant={medication.takenToday ? "secondary" : "destructive"}>
                        {medication.takenToday ? "Taken" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                  {todaysMedications.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{todaysMedications.length - 3} more medications
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alerts & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adherenceStats.adherencePercentage < 80 && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-800">Low Adherence</p>
                  <p className="text-xs text-orange-600">Adherence below 80%</p>
                </div>
              )}
              
              {completedToday === 0 && totalToday > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-800">No Medications Taken</p>
                  <p className="text-xs text-red-600">No medications taken today</p>
                </div>
              )}
              
              {adherenceStats.currentStreak >= 7 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">Great Streak!</p>
                  <p className="text-xs text-green-600">{adherenceStats.currentStreak} days in a row</p>
                </div>
              )}
              
              {adherenceStats.adherencePercentage >= 80 && completedToday > 0 && adherenceStats.currentStreak < 7 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Good Progress!</p>
                  <p className="text-xs text-blue-600">Maintaining good adherence</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medication Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No medications are being tracked yet.
            </p>
          ) : (
            <div className="space-y-4">
              {medications.map((medication) => {
                const takenToday = medication.medication_logs.some(log => {
                  try {
                    const logDate = parseISO(log.taken_at);
                    return format(logDate, 'yyyy-MM-dd') === todayStr;
                  } catch {
                    return false;
                  }
                });

                const lastTaken = medication.medication_logs.length > 0 
                  ? medication.medication_logs
                      .map(log => parseISO(log.taken_at))
                      .sort((a, b) => b.getTime() - a.getTime())[0]
                  : null;

                return (
                  <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        takenToday ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {takenToday ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {medication.dosage} • {medication.frequency.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={takenToday ? "secondary" : "outline"}>
                        {takenToday ? "Taken Today" : "Pending"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {medication.medication_logs.length} doses logged
                      </p>
                      {lastTaken && (
                        <p className="text-xs text-muted-foreground">
                          Last: {format(lastTaken, 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};