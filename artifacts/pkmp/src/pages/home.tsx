import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  useGetFeaturedPokemon,
  useGetStatsOverview,
  useGetStatsByGeneration,
  useGetStatsByType,
} from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Database, Search, Activity, Layers, ArrowRight, Zap, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const GEN_REGIONS: Record<number, string> = { 1: 'Kanto', 2: 'Johto', 3: 'Hoenn', 4: 'Sinnoh', 5: 'Unova', 6: 'Kalos', 7: 'Alola', 8: 'Galar', 9: 'Paldea' };
const GEN_MASCOT: Record<number, number> = { 1: 6, 2: 249, 3: 384, 4: 483, 5: 643, 6: 716, 7: 791, 8: 888, 9: 1007 };
const GEN_COLORS: Record<number, string> = { 1: '#F08030', 2: '#A890F0', 3: '#78C850', 4: '#7038F8', 5: '#98D8D8', 6: '#EE99AC', 7: '#F8D030', 8: '#B8B8D0', 9: '#C03028' };

const REGION_DATA = [
  { name: 'Kanto', gen: 1, mascot: 6, description: 'Where the journey begins' },
  { name: 'Johto', gen: 2, mascot: 249, description: 'Steeped in ancient tradition' },
  { name: 'Hoenn', gen: 3, mascot: 384, description: 'Vast oceans and lush jungles' },
  { name: 'Sinnoh', gen: 4, mascot: 483, description: 'Myths of creation and time' },
  { name: 'Unova', gen: 5, mascot: 643, description: 'A distant land of contrast' },
  { name: 'Kalos', gen: 6, mascot: 716, description: 'Beauty, fashion, and mystery' },
  { name: 'Alola', gen: 7, mascot: 791, description: 'Tropical islands of aloha' },
  { name: 'Galar', gen: 8, mascot: 888, description: 'Tradition meets industry' },
  { name: 'Paldea', gen: 9, mascot: 1007, description: 'An open world to explore' },
];

const SHOWCASE_LEGENDARIES = [150, 245, 249, 384, 483, 484, 643, 644, 716, 717, 791, 792, 888, 889, 1007];

function artworkUrl(dex: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;
}

function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-3xl font-heading font-bold text-white mb-1 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full inline-block" />
          {title}
        </h2>
        {subtitle && <p className="text-muted-foreground ml-4">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group text-sm">
          See All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {

  const { data: featured, isLoading: loadingFeatured } = useGetFeaturedPokemon();
  const { data: stats } = useGetStatsOverview();
  const { data: genStats } = useGetStatsByGeneration() as { data: Array<{ generation: number; label: string; count: number }> | undefined };
  const { data: typeStats } = useGetStatsByType() as { data: Array<{ name: string; count: number }> | undefined };

  const heroMon = featured?.[0];

  return (
    <PageTransition className="space-y-20 pb-20">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 min-h-[52vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full">
          {heroMon && (
            <motion.img
              key={heroMon.id}
              src={heroMon.artworkUrl || artworkUrl(heroMon.nationalDexNumber)}
              alt={heroMon.name}
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] select-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/30" />
        </div>
        <div className="absolute -right-24 -top-24 w-[500px] h-[500px] rounded-full border-[60px] border-white/5 blur-sm pointer-events-none" />

        <div className="relative z-20 px-8 md:px-12 lg:px-16 py-16 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,204,0,0.4)] relative overflow-hidden">
            <div className="absolute top-1/2 w-full h-[3px] bg-black -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 border-[3px] border-primary" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4 leading-tight drop-shadow-lg">
            The Ultimate<br /><span className="text-primary">Pokémon</span><br />Knowledge Hub
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Largest fan-made Pokédex — 1,025 species with deep stats, evolutions, competitive data, and more.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4">
            <Link href="/pokedex" className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-black font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,204,0,0.3)]">
              <Database size={20} /> Browse Pokédex
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 border border-white/10 transition-all hover:scale-105">
              <Search size={20} /> Advanced Search
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Browse by Generation ──────────────────────────── */}
      <section>
        <SectionHeader title="Browse by Generation" href="/pokedex" />
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {(genStats ?? Array(9).fill(null)).map((gen: any, i: number) => {
            const genNum = gen?.generation ?? (i + 1);
            const color = GEN_COLORS[genNum] ?? '#888';
            const mascot = GEN_MASCOT[genNum] ?? 1;
            return (
              <motion.div key={genNum}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }}>
                <Link href={`/pokedex?generation=${genNum}`}>
                  <div className="glass-card rounded-2xl p-3 border border-white/5 hover:border-white/20 transition-all cursor-pointer text-center group relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ background: `radial-gradient(circle at bottom, ${color}, transparent 70%)` }} />
                    <img src={artworkUrl(mascot)} alt="" className="w-14 h-14 object-contain mx-auto mb-2 drop-shadow-md group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-primary">Gen {toRoman(genNum)}</div>
                    <div className="text-[10px] text-muted-foreground">{GEN_REGIONS[genNum]}</div>
                    {gen?.count && <div className="text-[10px] text-white/40 mt-0.5">{gen.count} Pokémon</div>}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Browse by Type ───────────────────────────────── */}
      <section>
        <SectionHeader title="Browse by Type" href="/pokedex" />
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3">
          {(typeStats ?? FALLBACK_TYPES.map(n => ({ name: n, count: 0 }))).map((t: any, i: number) => (
            <motion.div key={t.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.06 }}>
              <Link href={`/pokedex?type=${t.name}`}>
                <div className="rounded-xl px-3 py-3 text-center font-bold text-sm uppercase tracking-wide text-white cursor-pointer transition-all hover:brightness-110 border border-white/10 relative overflow-hidden"
                  style={{ backgroundColor: `color-mix(in srgb, var(--color-type-${t.name.toLowerCase()}) 70%, black)` }}>
                  <span className="relative z-10 drop-shadow">{t.name}</span>
                  {t.count > 0 && <div className="text-[10px] font-normal opacity-70 mt-0.5">{t.count}</div>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Pokémon Carousel ─────────────────────── */}
      <section>
        <SectionHeader title="Featured Species" subtitle="Discover randomly selected Pokémon" href="/pokedex" />
        {loadingFeatured ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <Carousel opts={{ align: 'start' }} className="w-full">
            <CarouselContent className="-ml-4">
              {featured?.map((p, i) => (
                <CarouselItem key={p.id} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                  <PokemonCard pokemon={p} index={i} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-black/60 border-white/20 text-white hover:bg-black/80" />
            <CarouselNext className="bg-black/60 border-white/20 text-white hover:bg-black/80" />
          </Carousel>
        )}
      </section>

      {/* ── Legendary & Mythical Showcase ────────────────── */}
      <section>
        <SectionHeader title="Legendary & Mythical" subtitle="The rarest Pokémon in existence" href="/pokedex?rarity=legendary" />
        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {SHOWCASE_LEGENDARIES.map((dex) => (
              <CarouselItem key={dex} className="pl-4 basis-1/3 sm:basis-1/4 lg:basis-1/6">
                <Link href={`/pokemon/${dex}`}>
                  <motion.div whileHover={{ y: -6, scale: 1.04 }}
                    className="glass-card rounded-2xl p-4 border border-white/5 hover:border-primary/30 transition-all cursor-pointer flex items-center justify-center aspect-square relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img src={artworkUrl(dex)} alt={`#${dex}`}
                      className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform" />
                  </motion.div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-black/60 border-white/20 text-white hover:bg-black/80" />
          <CarouselNext className="bg-black/60 border-white/20 text-white hover:bg-black/80" />
        </Carousel>
      </section>

      {/* ── Regions ──────────────────────────────────────── */}
      <section>
        <SectionHeader title="Explore Regions" subtitle="Every region from Kanto to Paldea" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {REGION_DATA.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }} whileHover={{ y: -4 }}>
              <Link href={`/pokedex?generation=${r.gen}`}>
                <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/20 cursor-pointer transition-all group relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ background: `radial-gradient(circle, ${GEN_COLORS[r.gen]}, transparent 70%)` }} />
                  <img src={artworkUrl(r.mascot)} alt={r.name}
                    className="w-16 h-16 object-contain mb-3 drop-shadow-lg group-hover:scale-110 transition-transform relative z-10" />
                  <h3 className="font-heading font-bold text-lg text-white">{r.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                  <div className="text-xs text-primary mt-2 font-medium">Gen {toRoman(r.gen)}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Statistics ───────────────────────────────────── */}
      <section>
        <SectionHeader title="Platform Statistics" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pokémon', value: stats?.totalPokemon, icon: Database, color: 'text-blue-400', glow: '#3b82f6' },
            { label: 'Moves', value: stats?.totalMoves, icon: Zap, color: 'text-red-400', glow: '#ef4444' },
            { label: 'Abilities', value: stats?.totalAbilities, icon: Sparkles, color: 'text-green-400', glow: '#22c55e' },
            { label: 'Types', value: stats?.totalTypes, icon: Layers, color: 'text-purple-400', glow: '#a855f7' },
            { label: 'Generations', value: 9, icon: Activity, color: 'text-yellow-400', glow: '#eab308' },
            { label: 'Regions', value: 9, icon: Globe, color: 'text-cyan-400', glow: '#06b6d4' },
            { label: 'Games', value: 50, icon: Search, color: 'text-orange-400', glow: '#f97316' },
            { label: 'Cards', value: stats?.totalCards ?? '10K+', icon: Layers, color: 'text-pink-400', glow: '#ec4899' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: s.glow }} />
              <s.icon className={cn('w-7 h-7 mb-4 opacity-80', s.color)} />
              <div className="text-3xl font-heading font-bold text-white mb-1">
                {s.value != null ? (typeof s.value === 'number' ? s.value.toLocaleString() : s.value) : <span className="w-16 h-7 bg-white/10 rounded animate-pulse block" />}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-white/5 pt-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 w-full h-[2px] bg-black -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-primary" />
          </div>
          <span className="font-heading font-bold text-xl text-primary">PKMP</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Fan-made Pokémon knowledge platform. Pokémon and all related names are trademarks of Nintendo / Game Freak.</p>
        <div className="flex items-center justify-center gap-6 text-sm">
          {[['Pokédex', '/pokedex'], ['Search', '/search'], ['Compare', '/compare'], ['Favorites', '/favorites']].map(([label, href]) => (
            <Link key={href} href={href} className="text-muted-foreground hover:text-white transition-colors">{label}</Link>
          ))}
        </div>
      </footer>
    </PageTransition>
  );
}

function toRoman(n: number) {
  const map: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX' };
  return map[n] ?? n;
}

const FALLBACK_TYPES = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
