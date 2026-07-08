import React, { useState, useEffect } from 'react';
import { useListPokemon, useListTypes, type ListPokemonParams } from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const GENS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const GEN_ROMAN: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX' };
const GEN_REGIONS: Record<number, string> = { 1: 'Kanto', 2: 'Johto', 3: 'Hoenn', 4: 'Sinnoh', 5: 'Unova', 6: 'Kalos', 7: 'Alola', 8: 'Galar', 9: 'Paldea' };
const SORT_OPTIONS = [
  { value: 'id', label: '# ID' },
  { value: 'name', label: 'Name' },
  { value: 'baseStatTotal', label: 'Base Stats' },
  { value: 'height', label: 'Height' },
  { value: 'weight', label: 'Weight' },
];
const RARITY_OPTIONS = [
  { value: 'legendary', label: 'Legendary' },
  { value: 'mythical', label: 'Mythical' },
  { value: 'ultra-beast', label: 'Ultra Beast' },
  { value: 'paradox', label: 'Paradox' },
];

export default function Pokedex() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [params, setParams] = useState<ListPokemonParams & { rarity?: string }>({
    page: 1,
    limit: 24,
    sortBy: 'id',
    sortOrder: 'asc',
  });

  const { data: listResponse, isLoading } = useListPokemon(params as any);
  const { data: typesResponse } = useListTypes();

  const totalPages = listResponse ? Math.ceil(listResponse.total / (params.limit || 24)) : 0;
  const currentPage = params.page || 1;

  // Read query params from URL on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const gen = url.searchParams.get('generation');
    const type = url.searchParams.get('type');
    const rarity = url.searchParams.get('rarity');
    if (gen || type || rarity) {
      setParams(p => ({ ...p, generation: gen ? Number(gen) : undefined, type: type || undefined, rarity: rarity || undefined }));
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const set = (key: string, value: any) => setParams(prev => ({ ...prev, [key]: value || undefined, page: 1 }));

  const clearAll = () => setParams({ page: 1, limit: 24, sortBy: 'id', sortOrder: 'asc' });

  const activeFilterCount = [params.generation, (params as any).type, (params as any).rarity].filter(Boolean).length;

  const FilterPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('space-y-6', mobile && 'p-6')}>
      {mobile && (
        <div className="flex items-center justify-between mb-2">
          <span className="font-heading font-bold text-lg text-white">Filters</span>
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-muted-foreground hover:text-white"><X size={20} /></button>
        </div>
      )}

      {/* Generation */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Generation</div>
        <div className="grid grid-cols-3 gap-1.5">
          {GENS.map(g => (
            <button key={g} onClick={() => set('generation', params.generation === g ? undefined : g)}
              className={cn('rounded-lg py-2 text-sm font-medium transition-all border',
                params.generation === g
                  ? 'bg-primary/20 text-primary border-primary/40 shadow-[0_0_10px_rgba(255,204,0,0.15)]'
                  : 'bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-white')}>
              {GEN_ROMAN[g]}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Type</div>
        <div className="grid grid-cols-2 gap-1.5">
          {(typesResponse ?? []).map((t: any) => (
            <button key={t.name} onClick={() => set('type', (params as any).type === t.name ? undefined : t.name)}
              className={cn('rounded-lg py-1.5 text-xs font-bold uppercase tracking-wide transition-all border',
                (params as any).type === t.name
                  ? 'border-white/30 text-white'
                  : 'text-white/70 border-white/5 hover:border-white/20')}
              style={{
                backgroundColor: (params as any).type === t.name
                  ? `color-mix(in srgb, var(--color-type-${t.name.toLowerCase()}) 60%, black)`
                  : `color-mix(in srgb, var(--color-type-${t.name.toLowerCase()}) 15%, transparent)`
              }}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Rarity</div>
        <div className="space-y-1.5">
          {RARITY_OPTIONS.map(r => (
            <button key={r.value} onClick={() => set('rarity', (params as any).rarity === r.value ? undefined : r.value)}
              className={cn('w-full rounded-lg py-2 px-3 text-sm font-medium text-left transition-all border',
                (params as any).rarity === r.value
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-white')}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearAll}
          className="w-full py-2 rounded-lg text-sm text-destructive border border-destructive/30 hover:bg-destructive/10 transition-all font-medium">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <PageTransition>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-sidebar border-r border-sidebar-border z-50 lg:hidden overflow-y-auto">
              <FilterPanel mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-6 glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-heading font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" /> Filters
              </span>
              {activeFilterCount > 0 && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{activeFilterCount}</span>
              )}
            </div>
            <div className="p-4">
              <FilterPanel />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header bar */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all">
              <SlidersHorizontal size={16} />
              Filters {activeFilterCount > 0 && <span className="bg-primary/30 text-primary text-xs px-1.5 rounded-full">{activeFilterCount}</span>}
            </button>

            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-7 bg-primary rounded-full" />
                National Pokédex
                {listResponse && <span className="text-sm text-muted-foreground font-normal ml-2">{listResponse.total.toLocaleString()} Pokémon</span>}
              </h1>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <select value={params.sortBy || 'id'}
                onChange={e => set('sortBy', e.target.value)}
                className="bg-black/60 text-white text-sm border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-black">{o.label}</option>)}
              </select>

              <div className="flex rounded-xl overflow-hidden border border-white/10">
                <button onClick={() => setViewMode('grid')}
                  className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'bg-black/40 text-muted-foreground hover:text-white')}>
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-primary/20 text-primary' : 'bg-black/40 text-muted-foreground hover:text-white')}>
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {params.generation && <FilterChip label={`Gen ${GEN_ROMAN[params.generation]} · ${GEN_REGIONS[params.generation]}`} onRemove={() => set('generation', undefined)} />}
              {(params as any).type && <FilterChip label={(params as any).type} onRemove={() => set('type', undefined)} />}
              {(params as any).rarity && <FilterChip label={RARITY_OPTIONS.find(r => r.value === (params as any).rarity)?.label ?? ''} onRemove={() => set('rarity', undefined)} />}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className={cn('grid gap-4', viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}>
              {Array(24).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : listResponse?.data && listResponse.data.length > 0 ? (
            <div className={cn('grid gap-4', viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}>
              {listResponse.data.map((pokemon, i) => (
                viewMode === 'grid'
                  ? <PokemonCard key={pokemon.id} pokemon={pokemon} index={i} />
                  : <PokemonListRow key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">No Pokémon found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters.</p>
              <button onClick={clearAll} className="px-6 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-10">
              <PagButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft size={18} /></PagButton>
              {pagRange(currentPage, totalPages).map((p, i) =>
                p === '…' ? <span key={`e${i}`} className="w-10 text-center text-muted-foreground">…</span>
                  : <PagButton key={p} onClick={() => handlePageChange(p as number)} active={currentPage === p}>{p}</PagButton>
              )}
              <PagButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight size={18} /></PagButton>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-sm border border-primary/30 font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors"><X size={13} /></button>
    </span>
  );
}

function PagButton({ children, onClick, disabled, active }: any) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={cn('w-10 h-10 rounded-full font-medium text-sm transition-all flex items-center justify-center',
        active ? 'bg-primary text-black shadow-[0_0_15px_rgba(255,204,0,0.3)]'
          : 'bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed')}>
      {children}
    </button>
  );
}

function PokemonListRow({ pokemon }: { pokemon: any }) {
  const { isLiked, toggle } = useFavorites();
  const liked = isLiked(pokemon.nationalDexNumber);
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      className="glass-card rounded-xl border border-white/5 hover:border-white/20 transition-all p-4 flex items-center gap-4 group cursor-pointer"
      onClick={() => window.location.href = `/pokemon/${pokemon.id}`}>
      <span className="text-sm text-muted-foreground w-10 text-right font-mono">#{pokemon.nationalDexNumber.toString().padStart(3, '0')}</span>
      <img src={pokemon.spriteUrl} alt={pokemon.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
      <div className="flex-1">
        <span className="font-heading font-bold text-white capitalize">{pokemon.name}</span>
        <div className="flex gap-2 mt-1">
          {pokemon.types.map((t: string) => (
            <span key={t} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: `color-mix(in srgb, var(--color-type-${t.toLowerCase()}) 60%, black)` }}>{t}</span>
          ))}
        </div>
      </div>
      <div className="hidden sm:grid grid-cols-3 gap-6 text-center mr-4">
        {[['HP', pokemon.statHp], ['ATK', pokemon.statAttack], ['SPD', pokemon.statSpeed]].map(([l, v]) => (
          <div key={l}>
            <div className="text-[10px] text-muted-foreground uppercase">{l}</div>
            <div className="text-sm font-bold text-white">{v}</div>
          </div>
        ))}
      </div>
      <button onClick={e => { e.stopPropagation(); toggle(pokemon.nationalDexNumber); }}
        className="p-2 rounded-full hover:bg-white/10 transition-all">
        <svg width={18} height={18} viewBox="0 0 24 24" fill={liked ? '#ffcc00' : 'none'} stroke={liked ? '#ffcc00' : 'currentColor'} strokeWidth={2} className="text-white/40">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </motion.div>
  );
}

function pagRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

// Import useFavorites for list row
import { useFavorites } from '@/hooks/useFavorites';
