import React, { useState } from 'react';
import { useComparePokemon } from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { TypeBadge } from '@/components/shared/TypeBadge';
import { Plus, X, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock simple selection for demo purposes. In a real app, this would use the search endpoint to pick.
// For now, we'll let users input IDs.
export default function ComparePage() {
  const [idsToCompare, setIdsToCompare] = useState<string[]>(['3', '6']); // Venusaur and Charizard default
  const [newId, setNewId] = useState('');

  const { data: comparedPokemon, isLoading } = useComparePokemon({ ids: idsToCompare }, {
    query: { enabled: idsToCompare.length > 0, queryKey: [] as unknown[] } as any
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newId && !idsToCompare.includes(newId) && idsToCompare.length < 4) {
      setIdsToCompare([...idsToCompare, newId]);
      setNewId('');
    }
  };

  const handleRemove = (idToRemove: string) => {
    setIdsToCompare(idsToCompare.filter(id => id !== idToRemove));
  };

  const statLabels = [
    { key: 'hp', label: 'HP' },
    { key: 'attack', label: 'Attack' },
    { key: 'defense', label: 'Defense' },
    { key: 'specialAttack', label: 'Sp. Atk' },
    { key: 'specialDefense', label: 'Sp. Def' },
    { key: 'speed', label: 'Speed' },
    { key: 'total', label: 'Total' }
  ] as const;

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
          <BarChart2 className="text-primary" size={32} />
          Compare Stats
        </h1>
        <p className="text-muted-foreground">Compare base stats side-by-side (up to 4 Pokémon).</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <form onSubmit={handleAdd} className="flex gap-4 max-w-md">
          <input 
            type="number" 
            placeholder="Enter National Dex ID..." 
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary transition-colors"
            min="1"
          />
          <button 
            type="submit" 
            disabled={idsToCompare.length >= 4 || !newId}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Add
          </button>
        </form>
        {idsToCompare.length >= 4 && <p className="text-sm text-primary mt-2">Maximum of 4 Pokémon reached.</p>}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : comparedPokemon && comparedPokemon.length > 0 ? (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 w-40 text-left border-b border-white/10 text-muted-foreground font-medium">Stat</th>
                  {comparedPokemon.map(p => (
                    <th key={p.id} className="p-4 w-1/4 border-b border-white/10 text-center relative group">
                      <button 
                        onClick={() => handleRemove(p.id.toString())}
                        className="absolute top-2 right-2 p-1 bg-destructive/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X size={14} />
                      </button>
                      <div className="flex flex-col items-center gap-2">
                        <img src={p.spriteUrl} alt={p.name} className="w-20 h-20 object-contain drop-shadow-lg" />
                        <span className="font-heading font-bold text-xl capitalize text-white">{p.name}</span>
                        <div className="flex gap-1 justify-center">
                          {p.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {statLabels.map(({ key, label }) => {
                  const maxInRow = Math.max(...comparedPokemon.map(p => p.stats[key]));
                  
                  return (
                    <tr key={key} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-sm">
                        {label}
                      </td>
                      {comparedPokemon.map(p => {
                        const val = p.stats[key];
                        const isMax = val === maxInRow && comparedPokemon.length > 1;
                        
                        return (
                          <td key={`${p.id}-${key}`} className="p-4">
                            <div className="flex flex-col gap-1">
                              <span className={cn(
                                "text-center font-heading font-bold text-lg",
                                isMax ? "text-primary" : "text-white"
                              )}>
                                {val}
                              </span>
                              {key !== 'total' && (
                                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                  <div 
                                    className={cn("h-full rounded-full", isMax ? "bg-primary" : "bg-white/40")}
                                    style={{ width: `${Math.min(100, (val / 255) * 100)}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p>No Pokémon selected for comparison.</p>
        </div>
      )}
    </PageTransition>
  );
}
