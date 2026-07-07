import React from 'react';
import { useGetFavorites } from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { Heart, HeartOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'wouter';

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  const { data: favorites, isLoading } = useGetFavorites({
    query: { enabled: isAuthenticated, queryKey: [] as unknown[] } as any
  });

  if (!isAuthenticated) return null;

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
          <Heart className="text-primary fill-primary" size={32} />
          Your Favorites
        </h1>
        <p className="text-muted-foreground">Pokémon you've saved to your personal collection.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((pokemon, i) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} index={i} />
          ))}
        </div>
      ) : (
        <div className="glass-card border border-white/5 rounded-3xl py-24 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <HeartOff className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white mb-2">No favorites yet</h3>
          <p className="text-muted-foreground max-w-md mb-8">
            You haven't added any Pokémon to your favorites. Explore the Pokédex and click the heart icon to save them here.
          </p>
          <Link href="/pokedex" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]">
            Explore Pokédex
          </Link>
        </div>
      )}
    </PageTransition>
  );
}
