import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { useMedications, useAdherenceStats } from '@/hooks/useMedications';
import { Skeleton } from '@/components/ui/skeleton';

export const CaretakerDashboard: React.FC = () => {
  const { medications, isLoading } = useMedications();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
            <p className="text-white/90 text-lg">Monitoring medication adherence</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherenceStats.adherencePercentage}%</div>
            <div className="text-white/80">Adherence Rate</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherenceStats.currentStreak}</div>
            <div className="text-white/80">Current Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherenceStats.totalDays - adherenceStats.takenDays}</div>
            <div className="text-white/80">Missed This Month</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{medications.length}</div>
            <div className="text-white/80">Total Medications</div>
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
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
              {medications.length === 0 ? (
                <p className="text-muted-foreground">No medications to track</p>
              ) : (
                medications.map((medication) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const takenToday = medication.medication_logs.some(log => 
                    log.taken_at.split('T')[0] === todayStr
                  );
                  
                  return (
                    <div key={medication.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                      </div>
                      <Badge variant={takenToday ? "secondary" : "destructive"}>
                        {takenToday ? "Taken" : "Pending"}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alerts
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
              
              {adherenceStats.currentStreak === 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-800">Missed Today</p>
                  <p className="text-xs text-red-600">No medications taken today</p>
                </div>
              )}
              
              {adherenceStats.adherencePercentage >= 80 && adherenceStats.currentStreak > 0 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">Great Progress!</p>
                  <p className="text-xs text-green-600">Maintaining good adherence</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medication List */}
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
              {medications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{medication.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {medication.dosage} • {medication.frequency.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {medication.medication_logs.length} doses logged
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last taken: {
                        medication.medication_logs.length > 0
                          ? new Date(medication.medication_logs[medication.medication_logs.length - 1].taken_at).toLocaleDateString()
                          : 'Never'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};