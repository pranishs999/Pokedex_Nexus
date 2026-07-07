import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useGetStatsOverview } from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { ShieldAlert, Database, Activity, Layers, Users, Zap, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation('/login');
      } else if (user?.role !== 'admin') {
        setLocation('/');
      }
    }
  }, [isAuthenticated, isLoading, user, setLocation]);

  if (isLoading || (isAuthenticated && user?.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition className="space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
          <ShieldAlert className="text-destructive" size={32} />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage platform data, users, and settings.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Pokémon', value: stats?.totalPokemon || 0, icon: Database, color: 'text-blue-400' },
          { label: 'Moves', value: stats?.totalMoves || 0, icon: Activity, color: 'text-red-400' },
          { label: 'Abilities', value: stats?.totalAbilities || 0, icon: Layers, color: 'text-green-400' },
          { label: 'Types', value: stats?.totalTypes || 0, icon: Search, color: 'text-purple-400' },
          { label: 'Generations', value: stats?.totalGenerations || 0, icon: Zap, color: 'text-yellow-400' },
          { label: 'Cards', value: stats?.totalCards || 0, icon: ShieldAlert, color: 'text-orange-400' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col items-center text-center"
          >
            <stat.icon className={`w-6 h-6 mb-3 ${stat.color} opacity-80`} />
            <div className="text-2xl font-heading font-bold text-white mb-1">
              {statsLoading ? <div className="w-12 h-6 bg-white/10 rounded animate-pulse mx-auto" /> : stat.value.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="glass-panel rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
            <Database size={20} className="text-primary" /> Data Management
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Trigger sync operations to update data from external APIs (PokeAPI, TCG API).
          </p>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/50 transition-all group">
              <span className="font-medium text-white group-hover:text-primary transition-colors">Sync Pokémon Roster</span>
              <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">Last run: 2 hours ago</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/50 transition-all group">
              <span className="font-medium text-white group-hover:text-primary transition-colors">Sync Moves & Abilities</span>
              <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">Last run: 1 day ago</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/50 transition-all group">
              <span className="font-medium text-white group-hover:text-primary transition-colors">Sync TCG Cards</span>
              <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">Last run: 5 days ago</span>
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-primary" /> User Management
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Manage user roles and platform access. (Placeholder UI)
          </p>
          
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">Trainer_{i}</div>
                    <div className="text-xs text-muted-foreground">trainer{i}@example.com</div>
                  </div>
                </div>
                <button className="text-xs text-destructive hover:text-destructive/80 font-medium">Suspend</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Temporary internal User component for the placeholder
function User({ size, className }: { size: number, className?: string }) {
  return <Users size={size} className={className} />;
}
