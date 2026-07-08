import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageTransition } from '@/components/shared/PageTransition';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { Heart, HeartOff } from 'lucide-react';
import { Link } from 'wouter';
import { useFavorites } from '@/hooks/useFavorites';

export default function Favorites() {
  const { favorites } = useFavorites();

  const { data: favoritePokemon = [], isLoading } = useQuery({
    queryKey: ['local-favorites', ...favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      const results = await Promise.all(
        favorites.map(dex =>
          fetch(`${import.meta.env.BASE_URL}api/pokemon/${dex}`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        )
      );
      return results.filter(Boolean);
    },
    enabled: favorites.length > 0,
  });

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
          <Heart className="text-primary fill-primary" size={32} />
          Your Favorites
        </h1>
        <p className="text-muted-foreground">Pokémon you've saved to your personal collection.</p>
      </div>

      {isLoading && favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array(favorites.length).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : favoritePokemon.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favoritePokemon.map((pokemon: any, i: number) => (
            <PokemonCard key={pokemon.nationalDexNumber} pokemon={pokemon} index={i} />
          ))}
        </div>
      ) : (
        <div className="glass-card border border-white/5 rounded-3xl py-24 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <HeartOff className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white mb-2">No favorites yet</h3>
          <p className="text-muted-foreground max-w-md mb-8">
            Explore the Pokédex and click the heart icon on any Pokémon to save them here.
          </p>
          <Link href="/pokedex" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]">
            Explore Pokédex
          </Link>
        </div>
      )}
    </PageTransition>
  );
}
