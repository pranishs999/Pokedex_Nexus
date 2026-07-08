import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetPokemon,
  useGetPokemonEvolutionChain,
  useGetPokemonForms,
  useGetPokemonMoves,
  useGetPokemonCards,
  type EvolutionNode,
} from '@workspace/api-client-react';
import { useFavorites } from '@/hooks/useFavorites';
import { PageTransition } from '@/components/shared/PageTransition';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { StatBar } from '@/components/shared/StatBar';
import { formatNumber, cn } from '@/lib/utils';
import {
  ChevronLeft, ChevronRight, Heart, Activity, Sword, Zap, Shield,
  Egg, ArrowRight, Eye, BookOpen,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'stats', label: 'Stats', icon: Activity },
  { id: 'moves', label: 'Moves', icon: Sword },
  { id: 'evolution', label: 'Evolution', icon: ArrowRight },
  { id: 'forms', label: 'Forms', icon: Zap },
  { id: 'breeding', label: 'Breeding', icon: Egg },
  { id: 'cards', label: 'Cards', icon: Shield },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const { isLiked, toggle: toggleFavorite } = useFavorites();
  const [activeSection, setActiveSection] = useState<SectionId>('overview');

  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    overview: null, stats: null, moves: null, evolution: null, forms: null, breeding: null, cards: null,
  });

  const { data: pokemon, isLoading } = useGetPokemon(id || '', {
    query: { enabled: !!id, queryKey: [] as unknown[] } as any,
  });
  const { data: evoChain } = useGetPokemonEvolutionChain(id || '', {
    query: { enabled: !!id, queryKey: [] as unknown[] } as any,
  });
  const { data: forms } = useGetPokemonForms(id || '', {
    query: { enabled: !!id, queryKey: [] as unknown[] } as any,
  });
  const { data: moves } = useGetPokemonMoves(id || '', {
    query: { enabled: !!id, queryKey: [] as unknown[] } as any,
  });
  const { data: cards } = useGetPokemonCards(id || '', {
    query: { enabled: !!id, queryKey: [] as unknown[] } as any,
  });

  // Intersection observer to track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id: sid }) => {
      const el = sectionRefs.current[sid];
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(sid);
      }, { rootMargin: '-30% 0px -60% 0px' });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [pokemon]);

  const scrollTo = (sid: SectionId) => {
    sectionRefs.current[sid]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading || !pokemon) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const mainType = pokemon.types[0]?.toLowerCase() || 'normal';
  const favorited = isLiked(pokemon.nationalDexNumber);
  const idNum = Number(id);

  // Radar data
  const radarData = [
    { stat: 'HP', value: pokemon.stats.hp },
    { stat: 'ATK', value: pokemon.stats.attack },
    { stat: 'DEF', value: pokemon.stats.defense },
    { stat: 'SP.A', value: pokemon.stats.specialAttack },
    { stat: 'SP.D', value: pokemon.stats.specialDefense },
    { stat: 'SPD', value: pokemon.stats.speed },
  ];

  return (
    <PageTransition className="pb-24">
      {/* Dynamic type glow */}
      <div className="fixed top-0 left-0 w-full h-[50vh] opacity-15 blur-[120px] pointer-events-none -z-10 transition-colors duration-1000"
        style={{ backgroundColor: `var(--color-type-${mainType})` }} />

      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/pokedex" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all">
          <ChevronLeft size={16} /> Back to Pokédex
        </Link>
        <div className="flex gap-2">
          {idNum > 1 && <Link href={`/pokemon/${idNum - 1}`} className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"><ChevronLeft size={18} /></Link>}
          {idNum < 1025 && <Link href={`/pokemon/${idNum + 1}`} className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"><ChevronRight size={18} /></Link>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── Left: Sticky side nav (lg+) ────────────────── */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-6 space-y-1">
            {SECTIONS.map(({ id: sid, label, icon: Icon }) => (
              <button key={sid} onClick={() => scrollTo(sid)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  activeSection === sid
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent',
                )}>
                <Icon size={15} className={activeSection === sid ? 'text-primary' : ''} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* ─── Center: Artwork + identity ─────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          {/* Artwork card */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
            <div className="absolute top-5 left-5 font-heading font-bold text-4xl text-white/15">#{formatNumber(pokemon.nationalDexNumber)}</div>
            <button onClick={() => toggleFavorite(pokemon.nationalDexNumber)}
              className={cn('absolute top-5 right-5 p-3 rounded-full border backdrop-blur-md transition-all',
                favorited ? 'bg-primary/15 border-primary/40' : 'bg-black/40 border-white/10 hover:bg-white/10')}>
              <Heart size={22} className={cn('transition-colors', favorited ? 'fill-primary text-primary' : 'text-white/50')} />
            </button>
            <div className="absolute inset-0 opacity-8 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border-[48px]" style={{ borderColor: `color-mix(in srgb, var(--color-type-${mainType}) 30%, transparent)` }} />
            </div>
            <motion.img initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, delay: 0.15 }}
              src={pokemon.artworkUrl || pokemon.spriteUrl} alt={pokemon.name}
              className="w-full max-w-[300px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative z-10" />
          </div>

          {/* Identity card */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <h1 className="text-3xl font-heading font-bold text-white mb-1 capitalize">{pokemon.name}</h1>
            {pokemon.category && <p className="text-sm text-muted-foreground mb-3">{pokemon.category}</p>}
            <div className="flex flex-wrap gap-2 mb-4">
              {pokemon.types.map(t => <TypeBadge key={t} type={t} size="lg" />)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <InfoCell label="Height" value={pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : '—'} />
              <InfoCell label="Weight" value={pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : '—'} />
              <InfoCell label="Generation" value={`Gen ${pokemon.generation}`} />
              <InfoCell label="Color" value={pokemon.color ? capitalize(pokemon.color) : '—'} />
            </div>
          </div>
        </div>

        {/* ─── Right: Content sections ─────────────────────── */}
        <div className="lg:col-span-6 space-y-6">

          {/* Mobile section tabs */}
          <div className="flex overflow-x-auto hide-scrollbar gap-1.5 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl lg:hidden">
            {SECTIONS.map(({ id: sid, label, icon: Icon }) => (
              <button key={sid} onClick={() => scrollTo(sid)}
                className={cn('flex-none flex items-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium transition-all',
                  activeSection === sid ? 'bg-white/10 text-white border border-white/20' : 'text-muted-foreground hover:text-white')}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* ── Overview ────────────────────────────────────── */}
          <Section ref={el => { sectionRefs.current.overview = el; }} title="Overview" icon={Eye}>
            <p className="text-muted-foreground leading-relaxed mb-5">
              {pokemon.description || `A ${pokemon.types.join('/')} type Pokémon from Generation ${pokemon.generation}.`}
            </p>
            {pokemon.abilities && pokemon.abilities.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Abilities</div>
                <div className="space-y-2">
                  {pokemon.abilities.map((a: any) => (
                    <div key={a.name} className="bg-black/40 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white capitalize">{a.name}</span>
                        {a.isHidden && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Hidden</span>}
                      </div>
                      {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* ── Stats ──────────────────────────────────────── */}
          <Section ref={el => { sectionRefs.current.stats = el; }} title="Base Stats" icon={Activity}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-muted-foreground">Base Stat Total</span>
              <span className="bg-primary/15 text-primary px-4 py-1.5 rounded-full font-bold border border-primary/30">{pokemon.stats.total}</span>
            </div>
            <div className="space-y-3 mb-8">
              <StatBar label="HP" value={pokemon.stats.hp} />
              <StatBar label="ATK" value={pokemon.stats.attack} />
              <StatBar label="DEF" value={pokemon.stats.defense} />
              <StatBar label="SP.A" value={pokemon.stats.specialAttack} />
              <StatBar label="SP.D" value={pokemon.stats.specialDefense} />
              <StatBar label="SPD" value={pokemon.stats.speed} />
            </div>

            {/* Radar chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600 }} />
                  <Radar name="Stats" dataKey="value" stroke="#ffcc00" fill="#ffcc00" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Type effectiveness */}
            {pokemon.typeEffectiveness && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-sm font-semibold text-white mb-4">Type Defenses</div>
                <div className="space-y-4">
                  {pokemon.typeEffectiveness.doubleDamageFrom?.length ? (
                    <EffRow label="Weak (2×)" color="text-red-400" types={pokemon.typeEffectiveness.doubleDamageFrom} />
                  ) : null}
                  {pokemon.typeEffectiveness.halfDamageFrom?.length ? (
                    <EffRow label="Resists (½×)" color="text-green-400" types={pokemon.typeEffectiveness.halfDamageFrom} />
                  ) : null}
                  {pokemon.typeEffectiveness.noDamageFrom?.length ? (
                    <EffRow label="Immune (0×)" color="text-muted-foreground" types={pokemon.typeEffectiveness.noDamageFrom} />
                  ) : null}
                </div>
              </div>
            )}
          </Section>

          {/* ── Moves ──────────────────────────────────────── */}
          <Section ref={el => { sectionRefs.current.moves = el; }} title="Learnset" icon={Sword}>
            {!moves ? <Spinner /> : moves.length === 0 ? <Empty text="No moves found." /> : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-y border-white/10">
                    <tr>
                      <th className="px-4 py-3">Move</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Cat</th>
                      <th className="px-4 py-3 text-center">Pwr</th>
                      <th className="px-4 py-3 text-center">Acc</th>
                      <th className="px-4 py-3">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {moves.map((pm: any, i: number) => (
                      <tr key={`${pm.move.id}-${i}`} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-white capitalize">{pm.move.name.replace(/-/g, ' ')}</td>
                        <td className="px-4 py-2.5"><TypeBadge type={pm.move.type} size="sm" /></td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">{pm.move.category}</td>
                        <td className="px-4 py-2.5 text-center text-white">{pm.move.power || '—'}</td>
                        <td className="px-4 py-2.5 text-center text-white">{pm.move.accuracy ? `${pm.move.accuracy}%` : '—'}</td>
                        <td className="px-4 py-2.5">
                          <span className="bg-black/40 px-2 py-1 rounded text-xs border border-white/5 text-muted-foreground capitalize">
                            {pm.learnMethod}{pm.levelLearnedAt ? ` ${pm.levelLearnedAt}` : ''}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* ── Evolution Chain ─────────────────────────────── */}
          <Section ref={el => { sectionRefs.current.evolution = el; }} title="Evolution Chain" icon={ArrowRight}>
            {!evoChain?.chain ? <Empty text="No evolution data." /> : (
              <div className="overflow-x-auto py-2">
                <EvoChain node={evoChain.chain} currentId={id || ''} />
              </div>
            )}
          </Section>

          {/* ── Forms ──────────────────────────────────────── */}
          <Section ref={el => { sectionRefs.current.forms = el; }} title="Alternate Forms" icon={Zap}>
            {!forms ? <Spinner /> : forms.length === 0 ? <Empty text="No alternate forms." /> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {forms.map((f: any) => (
                  <div key={f.id ?? f.name} className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:border-white/20 transition-all">
                    <img src={f.artworkUrl || f.spriteUrl} alt={f.name} className="w-28 h-28 object-contain drop-shadow-lg mb-3" />
                    <h4 className="font-heading font-bold text-white capitalize mb-1">{f.name.replace(/-/g, ' ')}</h4>
                    <span className="text-[10px] bg-primary/20 text-primary px-3 py-0.5 rounded-full uppercase tracking-wider font-bold mb-2">{f.formType}</span>
                    {f.region && <span className="text-xs text-muted-foreground">{f.region}</span>}
                    {f.types && <div className="flex flex-wrap gap-1.5 justify-center mt-2">{f.types.map((t: string) => <TypeBadge key={t} type={t} size="sm" />)}</div>}
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* ── Breeding ───────────────────────────────────── */}
          <Section ref={el => { sectionRefs.current.breeding = el; }} title="Breeding" icon={Egg}>
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Egg Groups" value={[pokemon.eggGroup1, pokemon.eggGroup2].filter(Boolean).map(capitalize).join(', ') || '—'} />
              <InfoCell label="Gender Ratio" value={formatGender(pokemon.genderRatio)} />
              <InfoCell label="Catch Rate" value={`${pokemon.captureRate ?? '—'}`} />
              <InfoCell label="Base Friendship" value={`${pokemon.baseFriendship ?? '—'}`} />
              <InfoCell label="Growth Rate" value={pokemon.growthRate ? capitalize(pokemon.growthRate.replace(/-/g, ' ')) : '—'} />
              <InfoCell label="Hatch Steps" value={pokemon.captureRate ? `${Math.round((255 - (pokemon.captureRate ?? 0) / 2.55) * 20)} approx.` : '—'} />
            </div>
            {pokemon.genderRatio !== null && pokemon.genderRatio !== undefined && (
              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">Gender Distribution</div>
                <div className="h-2.5 rounded-full overflow-hidden bg-white/10 flex">
                  <div className="bg-blue-400 transition-all" style={{ width: `${(1 - (pokemon.genderRatio ?? 0)) * 100}%` }} />
                  <div className="bg-pink-400 flex-1" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>♂ {((1 - (pokemon.genderRatio ?? 0)) * 100).toFixed(1)}%</span>
                  <span>♀ {((pokemon.genderRatio ?? 0) * 100).toFixed(1)}%</span>
                </div>
              </div>
            )}
          </Section>

          {/* ── Trading Cards ──────────────────────────────── */}
          <Section ref={el => { sectionRefs.current.cards = el; }} title="Trading Cards" icon={Shield}>
            {!cards ? <Spinner /> : cards.length === 0 ? <Empty text="No trading cards found." /> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {cards.map((c: any) => (
                  <div key={c.id} className="group relative">
                    <div className="aspect-[63/88] rounded-xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-all">
                      <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

        </div>
      </div>
    </PageTransition>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

const Section = React.forwardRef<HTMLDivElement, { title: string; icon: React.ElementType; children: React.ReactNode }>(
  ({ title, icon: Icon, children }, ref) => (
    <div ref={ref} className="glass-card rounded-2xl p-6 border border-white/10 scroll-mt-6">
      <h3 className="text-lg font-heading font-bold text-white mb-5 flex items-center gap-2">
        <Icon size={18} className="text-primary" /> {title}
      </h3>
      {children}
    </div>
  ),
);

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/40 rounded-xl p-3 border border-white/5">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-medium text-white capitalize">{value}</div>
    </div>
  );
}

function EffRow({ label, color, types }: { label: string; color: string; types: string[] }) {
  return (
    <div>
      <span className={cn('text-xs font-medium mb-2 block', color)}>{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
      </div>
    </div>
  );
}

function EvoChain({ node, currentId }: { node: EvolutionNode; currentId: string }) {
  const isCurrent = node.pokemon.id.toString() === currentId;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
      <Link href={`/pokemon/${node.pokemon.id}`}>
        <motion.div whileHover={{ scale: 1.05 }}
          className={cn('glass-panel rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer border min-w-[110px] transition-all',
            isCurrent ? 'border-primary/60 shadow-[0_0_20px_rgba(255,204,0,0.2)] bg-primary/5' : 'border-white/10 hover:border-white/30')}>
          <img src={node.pokemon.spriteUrl} alt={node.pokemon.name} className="w-20 h-20 object-contain drop-shadow-lg" />
          <span className="font-heading font-bold text-sm capitalize text-center">{node.pokemon.name}</span>
          <span className="text-xs text-muted-foreground">#{formatNumber(node.pokemon.nationalDexNumber)}</span>
          {node.pokemon.types && (
            <div className="flex gap-1">
              {node.pokemon.types.map((t: string) => <TypeBadge key={t} type={t} size="sm" />)}
            </div>
          )}
        </motion.div>
      </Link>

      {node.evolvesTo && node.evolvesTo.length > 0 && (
        <div className={cn('flex items-center', node.evolvesTo.length > 1 ? 'flex-col gap-4' : 'flex-row gap-3')}>
          {node.evolvesTo.map(next => (
            <div key={next.pokemon.id} className="flex flex-col sm:flex-row items-center gap-3">
              {/* Evo trigger */}
              <div className="flex flex-col items-center px-3 text-muted-foreground text-center">
                <ChevronRight className="hidden sm:block w-6 h-6 opacity-40" />
                <div className="sm:hidden w-px h-6 bg-white/20" />
                <EvoDetails details={next.evolutionDetails} />
              </div>
              <EvoChain node={next} currentId={currentId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EvoDetails({ details }: { details?: any }) {
  if (!details) return null;
  const parts: string[] = [];
  if (details.minLevel) parts.push(`Lv. ${details.minLevel}`);
  if (details.item) parts.push(details.item.replace(/-/g, ' '));
  if (details.trigger === 'trade') parts.push('Trade');
  if (details.minHappiness) parts.push(`Happiness ${details.minHappiness}+`);
  if (details.timeOfDay) parts.push(capitalize(details.timeOfDay));
  if (details.knownMoveType) parts.push(`Know ${capitalize(details.knownMoveType)} move`);
  if (parts.length === 0) return null;
  return (
    <div className="space-y-0.5 mt-1">
      {parts.map((p, i) => (
        <span key={i} className="block text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded-full border border-white/5 text-center">{p}</span>
      ))}
    </div>
  );
}

function Spinner() {
  return <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="text-center py-10 text-muted-foreground">{text}</div>;
}

function capitalize(s?: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function formatGender(ratio?: number | null) {
  if (ratio === null || ratio === undefined) return 'Genderless';
  if (ratio === 0) return '♂ 100%';
  if (ratio === 1) return '♀ 100%';
  return `♂ ${((1 - ratio) * 100).toFixed(1)}% / ♀ ${(ratio * 100).toFixed(1)}%`;
}
