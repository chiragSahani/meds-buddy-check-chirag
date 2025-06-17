import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/auth/AuthForm';
import { PatientDashboard } from '@/components/dashboard/PatientDashboard';
import { CaretakerDashboard } from '@/components/dashboard/CaretakerDashboard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, User, LogOut, Heart, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Index: React.FC = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-border/20 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-6">
          <div className="space-y-6">
            <Skeleton className="h-32" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthForm />;
  }

  const switchRole = async () => {
    const newRole = profile.role === 'patient' ? 'caretaker' : 'patient';
    const { error } = await updateProfile({ role: newRole });
    
    if (error) {
      toast.error(`Failed to switch role: ${error}`);
    } else {
      toast.success(`Switched to ${newRole} view`);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(`Sign out failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/20 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">MediCare Companion</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {profile.role === 'patient' ? 'Patient View' : 'Caretaker View'}
                {profile.full_name && ` • ${profile.full_name}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={switchRole}
              className="flex items-center gap-2 hover:bg-accent transition-colors flex-1 sm:flex-none"
              size="sm"
            >
              {profile.role === 'patient' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
              <span className="hidden sm:inline">
                Switch to {profile.role === 'patient' ? 'Caretaker' : 'Patient'}
              </span>
              <span className="sm:hidden">
                {profile.role === 'patient' ? 'Caretaker' : 'Patient'}
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2 hover:bg-accent transition-colors"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="space-y-6">
          {/* Connection Status */}
          {!navigator.onLine && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You're currently offline. Some features may not work properly.
              </AlertDescription>
            </Alert>
          )}

          {/* Dashboard Content */}
          {profile.role === 'patient' ? <PatientDashboard /> : <CaretakerDashboard />}
        </div>
      </main>
    </div>
  );
};

export default Index;