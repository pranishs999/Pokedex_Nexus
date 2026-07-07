import React, { useState } from 'react';
import { Link } from 'wouter';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { TypeBadge } from './TypeBadge';
import { formatNumber, cn } from '@/lib/utils';
import type { PokemonSummary } from '@workspace/api-client-react';
import { useAddFavorite, useRemoveFavorite, getGetFavoritesQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface PokemonCardProps {
  pokemon: PokemonSummary;
  index?: number;
}

export function PokemonCard({ pokemon, index = 0 }: PokemonCardProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(pokemon.isFavorited || false);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Could show toast here
      return;
    }

    const newStatus = !isFavorited;
    setIsFavorited(newStatus); // optimistic

    if (newStatus) {
      addFavorite.mutate({ pokemonId: pokemon.id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() }),
        onError: () => setIsFavorited(false)
      });
    } else {
      removeFavorite.mutate({ pokemonId: pokemon.id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() }),
        onError: () => setIsFavorited(true)
      });
    }
  };

  const mainType = pokemon.types[0]?.toLowerCase() || 'normal';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group block h-full cursor-pointer"
    >
      <Link href={`/pokemon/${pokemon.id}`} className="block h-full">
        <div className="glass-card h-full rounded-2xl overflow-hidden relative border border-white/5 transition-colors duration-300 group-hover:border-primary/50">
          
          {/* Background glow based on type */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-40"
            style={{ backgroundColor: `var(--color-type-${mainType})` }}
          />

          <div className="p-5 flex flex-col h-full relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="font-heading font-bold text-xl text-white/50 group-hover:text-white/80 transition-colors">
                #{formatNumber(pokemon.nationalDexNumber)}
              </span>
              <button 
                onClick={handleFavoriteClick}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  isAuthenticated ? "hover:bg-white/10" : "opacity-50 cursor-not-allowed"
                )}
              >
                <Heart 
                  size={20} 
                  className={cn(
                    "transition-colors", 
                    isFavorited ? "fill-primary text-primary" : "text-white/40"
                  )} 
                />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center py-4 relative">
              {/* Subtle backdrop circle */}
              <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-black/20" />
              
              <motion.img 
                src={pokemon.artworkUrl || pokemon.spriteUrl} 
                alt={pokemon.name}
                className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl"
                animate={isHovered ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="mt-auto">
              <h3 className="font-heading font-bold text-2xl text-white capitalize mb-3 drop-shadow-md">
                {pokemon.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map(type => (
                  <TypeBadge key={type} type={type} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
