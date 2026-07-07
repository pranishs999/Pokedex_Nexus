import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  useGetPokemon, 
  useGetPokemonEvolutionChain, 
  useGetPokemonForms,
  useGetPokemonMoves,
  useGetPokemonCards,
  type EvolutionNode,
  useAddFavorite,
  useRemoveFavorite
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetFavoritesQueryKey, getGetPokemonQueryKey } from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { StatBar } from '@/components/shared/StatBar';
import { formatNumber, cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Heart, Shield, Sword, Activity, Zap, Wind } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'stats' | 'moves' | 'forms' | 'cards'>('stats');

  const { data: pokemon, isLoading } = useGetPokemon(id || '', {
    query: { enabled: !!id, queryKey: [] as unknown[] } as any
  });
  
  const { data: evoChain } = useGetPokemonEvolutionChain(id || '', {
    query: { enabled: !!id, queryKey: [] as unknown[] } as any
  });
  
  const { data: forms } = useGetPokemonForms(id || '', {
    query: { enabled: !!id && activeTab === 'forms', queryKey: [] as unknown[] } as any
  });

  const { data: moves } = useGetPokemonMoves(id || '', {
    query: { enabled: !!id && activeTab === 'moves', queryKey: [] as unknown[] } as any
  });

  const { data: cards } = useGetPokemonCards(id || '', {
    query: { enabled: !!id && activeTab === 'cards', queryKey: [] as unknown[] } as any
  });

  const addFavMutation = useAddFavorite();
  const removeFavMutation = useRemoveFavorite();

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to favorite Pokémon');
      return;
    }
    if (!pokemon) return;

    if (pokemon.isFavorited) {
      removeFavMutation.mutate({ pokemonId: pokemon.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPokemonQueryKey(id || '') });
        }
      });
    } else {
      addFavMutation.mutate({ pokemonId: pokemon.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFavoritesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPokemonQueryKey(id || '') });
        }
      });
    }
  };

  if (isLoading || !pokemon) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const mainType = pokemon.types[0]?.toLowerCase() || 'normal';

  const renderEvoNode = (node: EvolutionNode) => (
    <div key={node.pokemon.id} className="flex flex-col md:flex-row items-center gap-4">
      <Link href={`/pokemon/${node.pokemon.id}`}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={cn(
            "glass-panel rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer border",
            node.pokemon.id.toString() === id 
              ? "border-primary shadow-[0_0_20px_rgba(255,204,0,0.2)]" 
              : "border-white/10 hover:border-white/30"
          )}
        >
          <img src={node.pokemon.spriteUrl} alt={node.pokemon.name} className="w-24 h-24 object-contain drop-shadow-lg" />
          <span className="font-heading font-bold capitalize">{node.pokemon.name}</span>
          <span className="text-xs text-muted-foreground">#{formatNumber(node.pokemon.nationalDexNumber)}</span>
        </motion.div>
      </Link>
      
      {node.evolvesTo && node.evolvesTo.length > 0 && (
        <div className="flex flex-col gap-4 items-center">
          {node.evolvesTo.map(nextNode => (
            <div key={nextNode.pokemon.id} className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex flex-col items-center px-4 md:px-8 text-muted-foreground">
                <ChevronRight className="hidden md:block w-8 h-8 opacity-50" />
                <div className="md:hidden w-[2px] h-8 bg-white/20 my-2" />
                {nextNode.evolutionDetails?.minLevel && (
                  <span className="text-xs font-medium bg-black/40 px-2 py-1 rounded-full mt-2 border border-white/5">
                    Lvl {nextNode.evolutionDetails.minLevel}
                  </span>
                )}
                {nextNode.evolutionDetails?.item && (
                  <span className="text-xs font-medium bg-black/40 px-2 py-1 rounded-full mt-2 border border-white/5 capitalize">
                    {nextNode.evolutionDetails.item.replace('-', ' ')}
                  </span>
                )}
              </div>
              {renderEvoNode(nextNode)}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <PageTransition className="pb-24">
      {/* Dynamic Background Glow */}
      <div 
        className="fixed top-0 left-0 w-full h-[60vh] opacity-20 blur-[150px] pointer-events-none -z-10 transition-colors duration-1000"
        style={{ backgroundColor: `var(--color-type-${mainType})` }}
      />

      <div className="flex items-center justify-between mb-8">
        <Link href="/pokedex" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20">
          <ChevronLeft size={18} />
          Back to Pokédex
        </Link>
        <div className="flex gap-2">
          {id && Number(id) > 1 && (
            <Link href={`/pokemon/${Number(id) - 1}`} className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
            </Link>
          )}
          <Link href={`/pokemon/${Number(id) + 1}`} className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Hero & Artwork */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
            <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
              <button 
                onClick={handleFavoriteClick}
                className={cn(
                  "p-3 rounded-full backdrop-blur-md border transition-all duration-300",
                  isAuthenticated ? "bg-black/40 border-white/10 hover:bg-white/10" : "opacity-50 cursor-not-allowed bg-black/40 border-white/5",
                  pokemon.isFavorited && "border-primary/50 bg-primary/10"
                )}
              >
                <Heart size={24} className={cn("transition-colors", pokemon.isFavorited ? "fill-primary text-primary" : "text-white/60")} />
              </button>
            </div>

            <div className="absolute top-6 left-6 z-20">
              <span className="font-heading font-bold text-4xl text-white/20">#{formatNumber(pokemon.nationalDexNumber)}</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <img src="/favicon.svg" alt="" className="w-full h-full object-cover scale-150 blur-xl grayscale" />
            </div>

            <motion.img 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, delay: 0.2 }}
              src={pokemon.artworkUrl || pokemon.spriteUrl} 
              alt={pokemon.name} 
              className="w-full max-w-[350px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
            />
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <h1 className="text-4xl font-heading font-bold capitalize text-white mb-4">{pokemon.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {pokemon.types.map(type => (
                <TypeBadge key={type} type={type} size="lg" />
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {pokemon.description || `A mysterious ${pokemon.types.join('/')} type Pokémon from Generation ${pokemon.generation}.`}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Height</span>
                <span className="text-lg font-medium text-white">{pokemon.height ? `${pokemon.height / 10} m` : 'Unknown'}</span>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Weight</span>
                <span className="text-lg font-medium text-white">{pokemon.weight ? `${pokemon.weight / 10} kg` : 'Unknown'}</span>
              </div>
            </div>
            
            {pokemon.abilities && pokemon.abilities.length > 0 && (
              <div className="mt-6">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">Abilities</span>
                <div className="space-y-2">
                  {pokemon.abilities.map(ability => (
                    <div key={ability.name} className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white capitalize">{ability.name.replace('-', ' ')}</span>
                        {ability.isHidden && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Hidden</span>}
                      </div>
                      <span className="text-sm text-muted-foreground">{ability.description || 'No description available.'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Data & Tabs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl w-full">
            {[
              { id: 'stats', label: 'Base Stats', icon: Activity },
              { id: 'moves', label: 'Moveset', icon: Sword },
              { id: 'forms', label: 'Forms', icon: Zap },
              { id: 'cards', label: 'TCG Cards', icon: Shield },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 relative",
                  activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/10 rounded-xl border border-white/20" />
                )}
                <tab.icon size={16} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 min-h-[600px]">
            {activeTab === 'stats' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-heading font-bold text-white">Combat Stats</h3>
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold border border-primary/20">
                      Total: {pokemon.stats.total}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <StatBar label="HP" value={pokemon.stats.hp} />
                    <StatBar label="ATK" value={pokemon.stats.attack} />
                    <StatBar label="DEF" value={pokemon.stats.defense} />
                    <StatBar label="SP.A" value={pokemon.stats.specialAttack} />
                    <StatBar label="SP.D" value={pokemon.stats.specialDefense} />
                    <StatBar label="SPD" value={pokemon.stats.speed} />
                  </div>
                </div>

                {pokemon.typeEffectiveness && (
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-6 pt-6 border-t border-white/10">Type Defenses</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {pokemon.typeEffectiveness.doubleDamageFrom && pokemon.typeEffectiveness.doubleDamageFrom.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-destructive mb-3 block">Weak to (2x)</span>
                          <div className="flex flex-wrap gap-2">
                            {pokemon.typeEffectiveness.doubleDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                          </div>
                        </div>
                      )}
                      {pokemon.typeEffectiveness.halfDamageFrom && pokemon.typeEffectiveness.halfDamageFrom.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-green-400 mb-3 block">Resistant to (0.5x)</span>
                          <div className="flex flex-wrap gap-2">
                            {pokemon.typeEffectiveness.halfDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                          </div>
                        </div>
                      )}
                      {pokemon.typeEffectiveness.noDamageFrom && pokemon.typeEffectiveness.noDamageFrom.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-muted-foreground mb-3 block">Immune to (0x)</span>
                          <div className="flex flex-wrap gap-2">
                            {pokemon.typeEffectiveness.noDamageFrom.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {evoChain && evoChain.chain && (
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-6 pt-6 border-t border-white/10">Evolution</h3>
                    <div className="overflow-x-auto py-4">
                      {renderEvoNode(evoChain.chain)}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'moves' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Learnset</h3>
                {!moves ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-y border-white/10">
                        <tr>
                          <th className="px-4 py-3">Move</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Cat.</th>
                          <th className="px-4 py-3">Pwr</th>
                          <th className="px-4 py-3">Acc</th>
                          <th className="px-4 py-3">Method</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {moves.map((pm, i) => (
                          <tr key={`${pm.move.id}-${i}`} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 font-medium text-white capitalize">{pm.move.name.replace('-', ' ')}</td>
                            <td className="px-4 py-3"><TypeBadge type={pm.move.type} size="sm" /></td>
                            <td className="px-4 py-3 text-muted-foreground">{pm.move.category}</td>
                            <td className="px-4 py-3 text-white">{pm.move.power || '-'}</td>
                            <td className="px-4 py-3 text-white">{pm.move.accuracy ? `${pm.move.accuracy}%` : '-'}</td>
                            <td className="px-4 py-3">
                              <span className="bg-black/40 px-2 py-1 rounded text-xs border border-white/5 capitalize text-muted-foreground">
                                {pm.learnMethod} {pm.levelLearnedAt ? `Lvl ${pm.levelLearnedAt}` : ''}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'forms' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Alternate Forms</h3>
                {!forms ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>
                ) : forms.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">This Pokémon has no registered alternate forms.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {forms.map(form => (
                      <div key={form.id} className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center">
                        <img src={form.artworkUrl || form.spriteUrl} alt={form.name} className="w-32 h-32 object-contain drop-shadow-lg mb-4" />
                        <h4 className="font-heading font-bold text-lg text-white capitalize mb-2">{form.name.replace('-', ' ')}</h4>
                        <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-wider font-bold mb-3">{form.formType}</span>
                        {form.types && (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {form.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'cards' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Trading Cards</h3>
                {!cards ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>
                ) : cards.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">No trading cards found for this Pokémon.</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {cards.map(card => (
                      <div key={card.id} className="group relative">
                        <div className="aspect-[63/88] rounded-xl overflow-hidden border border-white/10 relative">
                          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <span className="text-white font-bold text-sm truncate">{card.set}</span>
                            <span className="text-muted-foreground text-xs">{card.rarity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
