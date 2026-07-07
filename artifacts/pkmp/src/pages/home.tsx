import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  useGetFeaturedPokemon, 
  useGetStatsOverview,
  useGetStatsByGeneration,
  useGetStatsByType
} from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { Database, Search, Activity, Layers, ArrowRight } from 'lucide-react';

export default function Home() {
  const { data: featured, isLoading: isLoadingFeatured } = useGetFeaturedPokemon();
  const { data: stats, isLoading: isLoadingStats } = useGetStatsOverview();

  return (
    <PageTransition className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 md:p-12 lg:p-16 min-h-[40vh] flex items-center">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full border-[40px] border-white/5 blur-sm pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 relative overflow-hidden shadow-[0_0_30px_rgba(255,204,0,0.4)]"
          >
            <div className="absolute top-1/2 w-full h-[3px] bg-black -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 border-[3px] border-primary" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4 drop-shadow-lg"
          >
            The Ultimate <br/><span className="text-primary">Pokémon</span> Knowledge Hub
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed"
          >
            Explore a cinematic, data-rich Pokédex. Deep dive into stats, evolutions, competitive analysis, and build your dream team.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/pokedex" className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,204,0,0.3)]">
              <Database size={20} />
              Open Pokédex
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 border border-white/10 transition-all hover:scale-105 active:scale-95">
              <Search size={20} />
              Advanced Search
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pokémon', value: stats?.totalPokemon || 0, icon: Database, color: 'text-blue-400' },
          { label: 'Moves', value: stats?.totalMoves || 0, icon: Activity, color: 'text-red-400' },
          { label: 'Abilities', value: stats?.totalAbilities || 0, icon: Layers, color: 'text-green-400' },
          { label: 'Types', value: stats?.totalTypes || 0, icon: Search, color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
            className="glass-card rounded-2xl p-6 border border-white/5"
          >
            <stat.icon className={`w-8 h-8 mb-4 ${stat.color} opacity-80`} />
            <div className="text-3xl font-heading font-bold text-white mb-1">
              {isLoadingStats ? (
                <div className="w-16 h-8 bg-white/10 rounded animate-pulse" />
              ) : (
                stat.value.toLocaleString()
              )}
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Featured Pokémon */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full inline-block" />
              Featured Species
            </h2>
            <p className="text-muted-foreground">Discover randomly selected Pokémon today.</p>
          </div>
          <Link href="/pokedex" className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group">
            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoadingFeatured ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            featured?.map((pokemon, i) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} index={i} />
            ))
          )}
        </div>
      </section>
    </PageTransition>
  );
}
