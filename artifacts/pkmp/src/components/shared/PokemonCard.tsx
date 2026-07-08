import React, { useState } from 'react';
import { Link } from 'wouter';
import { Heart, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { TypeBadge } from './TypeBadge';
import { formatNumber, cn } from '@/lib/utils';
import type { PokemonSummary } from '@workspace/api-client-react';
import { useFavorites } from '@/hooks/useFavorites';

const GEN_ROMAN: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX' };
const GEN_REGION: Record<number, string> = { 1: 'Kanto', 2: 'Johto', 3: 'Hoenn', 4: 'Sinnoh', 5: 'Unova', 6: 'Kalos', 7: 'Alola', 8: 'Galar', 9: 'Paldea' };

interface PokemonCardProps {
  pokemon: PokemonSummary & {
    isLegendary?: boolean;
    isMythical?: boolean;
    isParadox?: boolean;
    isUltraBeast?: boolean;
    baseStatTotal?: number;
  };
  index?: number;
}

export function PokemonCard({ pokemon, index = 0 }: PokemonCardProps) {
  const { isLiked, toggle } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);
  const favorited = isLiked(pokemon.nationalDexNumber);
  const mainType = pokemon.types[0]?.toLowerCase() || 'normal';

  const rarity = pokemon.isLegendary ? { label: 'Legendary', color: 'text-yellow-300', bg: 'bg-yellow-400/10 border-yellow-400/20' }
    : pokemon.isMythical ? { label: 'Mythical', color: 'text-pink-300', bg: 'bg-pink-400/10 border-pink-400/20' }
    : pokemon.isParadox ? { label: 'Paradox', color: 'text-purple-300', bg: 'bg-purple-400/10 border-purple-400/20' }
    : pokemon.isUltraBeast ? { label: 'Ultra Beast', color: 'text-cyan-300', bg: 'bg-cyan-400/10 border-cyan-400/20' }
    : null;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(pokemon.nationalDexNumber);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.5) }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group block h-full cursor-pointer"
    >
      <Link href={`/pokemon/${pokemon.id}`} className="block h-full">
        <div className="card-premium h-full overflow-hidden relative transition-colors duration-300 group-hover:border-primary/40">

          {/* Type glow */}
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity"
            style={{ backgroundColor: `var(--color-type-${mainType})` }} />

          <div className="p-4 flex flex-col h-full relative z-10">
            {/* Header row */}
            <div className="flex justify-between items-start mb-1">
              <span className="font-heading font-bold text-base text-white/40 group-hover:text-white/70 transition-colors">
                #{formatNumber(pokemon.nationalDexNumber)}
              </span>
              <button onClick={handleFavoriteClick}
                className="p-1.5 rounded-full hover:bg-white/10 transition-all duration-300"
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}>
                <Heart size={17} className={cn('transition-colors', favorited ? 'fill-primary text-primary' : 'text-white/30 group-hover:text-white/60')} />
              </button>
            </div>

            {/* Rarity badge */}
            {rarity && (
              <span className={cn('self-start text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1', rarity.bg, rarity.color)}>
                {rarity.label}
              </span>
            )}

            {/* Artwork */}
            <div className="flex-1 flex items-center justify-center py-3 relative">
              <div className="absolute inset-0 m-auto w-28 h-28 rounded-full bg-black/20" />
              <motion.img
                src={pokemon.artworkUrl || pokemon.spriteUrl}
                alt={pokemon.name}
                className="w-28 h-28 object-contain relative z-10 drop-shadow-2xl"
                animate={isHovered ? { y: -5, scale: 1.12 } : { y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Name + types */}
            <div className="mt-auto">
              <h3 className="font-heading font-bold text-xl text-white capitalize mb-2 leading-tight">
                {pokemon.name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {pokemon.types.map(type => <TypeBadge key={type} type={type} size="sm" />)}
              </div>

              {/* Gen + region */}
              <div className="flex items-center gap-2 mt-2">
                {pokemon.generation && (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Gen {GEN_ROMAN[pokemon.generation]} · {GEN_REGION[pokemon.generation]}
                  </span>
                )}
                {pokemon.baseStatTotal && (
                  <span className="text-[10px] text-muted-foreground ml-auto font-mono">BST {pokemon.baseStatTotal}</span>
                )}
              </div>
            </div>

            {/* Hover overlay with quick actions */}
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-[2px] flex items-end justify-center pb-4 pointer-events-none"
            >
              <span className="text-xs font-medium text-white/80 bg-white/10 px-4 py-1.5 rounded-full border border-white/10">
                View Details →
              </span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
