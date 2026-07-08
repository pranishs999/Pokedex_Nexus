import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageTransition } from '@/components/shared/PageTransition';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { Heart, HeartOff, Search, SortAsc, X } from 'lucide-react';
import { Link } from 'wouter';
import { useFavorites } from '@/hooks/useFavorites';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'added', label: 'Date Added' },
  { value: 'id', label: 'Dex #' },
  { value: 'name', label: 'Name' },
  { value: 'bst', label: 'Base Stats' },
];

export default function Favorites() {
  const { favorites } = useFavorites();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('added');

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

  const filtered = useMemo(() => {
    let list = [...favoritePokemon] as any[];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p: any) => p.name.toLowerCase().includes(q) || String(p.nationalDexNumber).includes(q));
    }
    switch (sort) {
      case 'id': list.sort((a: any, b: any) => a.nationalDexNumber - b.nationalDexNumber); break;
      case 'name': list.sort((a: any, b: any) => a.name.localeCompare(b.name)); break;
      case 'bst': list.sort((a: any, b: any) => (b.baseStatTotal ?? 0) - (a.baseStatTotal ?? 0)); break;
      default: break; // 'added' = insertion order
    }
    return list;
  }, [favoritePokemon, search, sort]);

  // Type distribution for stats
  const typeDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of (favoritePokemon as any[])) {
      for (const t of (p.types ?? [])) {
        map[t] = (map[t] ?? 0) + 1;
      }
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [favoritePokemon]);

  const genDistribution = useMemo(() => {
    const map: Record<number, number> = {};
    for (const p of (favoritePokemon as any[])) {
      const g = p.generation ?? 1;
      map[g] = (map[g] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [favoritePokemon]);

  const totalBST = useMemo(() =>
    (favoritePokemon as any[]).reduce((s: number, p: any) => s + (p.baseStatTotal ?? 0), 0),
    [favoritePokemon]);

  if (favorites.length === 0) {
    return (
      <PageTransition className="space-y-8">
        <header>
          <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            <Heart className="text-primary fill-primary" size={32} /> Your Collection
          </h1>
          <p className="text-muted-foreground">Heart any Pokémon to add them here.</p>
        </header>
        <div className="glass-card border border-white/5 rounded-3xl py-28 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <HeartOff className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white mb-2">No favorites yet</h3>
          <p className="text-muted-foreground max-w-sm mb-8">Explore the Pokédex and click the ♥ on any Pokémon to save them here.</p>
          <Link href="/pokedex" className="bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]">
            Explore Pokédex
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-8 pb-16">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="glass-panel rounded-2xl p-6 border border-white/10">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white mb-1 flex items-center gap-3">
              <Heart className="text-primary fill-primary" size={30} /> Your Collection
            </h1>
            <p className="text-muted-foreground">{favorites.length} Pokémon saved</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-heading font-bold text-white">{favorites.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Saved</div>
            </div>
            <div>
              <div className="text-2xl font-heading font-bold text-white">{Math.round(totalBST / Math.max(favorites.length, 1))}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Avg BST</div>
            </div>
            <div>
              <div className="text-2xl font-heading font-bold text-white">{typeDistribution.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Types</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Controls ────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search your collection…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 bg-black/40 border border-white/10 rounded-xl pl-9 pr-10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SortAsc size={16} className="text-muted-foreground" />
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-black/60 text-white text-sm border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-black">{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(favorites.length).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((pokemon: any, i: number) => (
            <PokemonCard key={pokemon.nationalDexNumber} pokemon={pokemon} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-muted-foreground">
          No Pokémon match <span className="text-white">"{search}"</span>.
        </div>
      )}

      {/* ── Collection Statistics ─────────────────────── */}
      {favoritePokemon.length > 0 && (
        <section className="glass-panel rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-heading font-bold text-white mb-5">Collection Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Type distribution */}
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Top Types</div>
              <div className="space-y-2">
                {typeDistribution.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <div className="w-20"><TypeBadge type={type} size="sm" /></div>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(count / Math.max(typeDistribution[0]?.[1] ?? 1, 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: `var(--color-type-${type.toLowerCase()})` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generation distribution */}
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">By Generation</div>
              <div className="space-y-2">
                {genDistribution.map(([gen, count]) => {
                  const GEN_ROMAN: Record<string, string> = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII', '9': 'IX' };
                  return (
                    <div key={gen} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-16">Gen {GEN_ROMAN[gen] ?? gen}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(Number(count) / favorites.length) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-primary/70 rounded-full" />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
