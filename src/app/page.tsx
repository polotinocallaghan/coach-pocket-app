'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { dataStore } from '@/lib/store';
import CoachDashboard from '@/components/features/dashboard/CoachDashboard';
import PlayerDashboard from '@/components/features/dashboard/PlayerDashboard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<'coach' | 'player' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      setRole(dataStore.getEffectiveRole());
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (role === 'player') {
    return <PlayerDashboard />;
  }

  return <CoachDashboard />;
}
