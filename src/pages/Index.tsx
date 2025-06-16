import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/auth/AuthForm';
import { PatientDashboard } from '@/components/dashboard/PatientDashboard';
import { CaretakerDashboard } from '@/components/dashboard/CaretakerDashboard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, User, LogOut, Heart } from 'lucide-react';

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

  const switchRole = () => {
    const newRole = profile.role === 'patient' ? 'caretaker' : 'patient';
    updateProfile({ role: newRole });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/20 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediCare Companion</h1>
              <p className="text-sm text-muted-foreground">
                {profile.role === 'patient' ? 'Patient View' : 'Caretaker View'}
                {profile.full_name && ` • ${profile.full_name}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={switchRole}
              className="flex items-center gap-2 hover:bg-accent transition-colors"
            >
              {profile.role === 'patient' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
              Switch to {profile.role === 'patient' ? 'Caretaker' : 'Patient'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2 hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {profile.role === 'patient' ? <PatientDashboard /> : <CaretakerDashboard />}
      </main>
    </div>
  );
};

export default Index;