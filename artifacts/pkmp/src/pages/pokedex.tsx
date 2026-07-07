import React, { useState } from 'react';
import { useListPokemon, useListTypes, type ListPokemonParams } from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { PokemonCard } from '@/components/shared/PokemonCard';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Pokedex() {
  const [, setLocation] = useLocation();
  const [params, setParams] = useState<ListPokemonParams>({
    page: 1,
    limit: 24,
    sortBy: 'id',
    sortOrder: 'asc',
  });

  const { data: listResponse, isLoading } = useListPokemon(params);
  const { data: typesResponse } = useListTypes();

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key: keyof ListPokemonParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const totalPages = listResponse ? Math.ceil(listResponse.total / (params.limit || 24)) : 0;

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            <span className="w-2 h-10 bg-primary rounded-full inline-block" />
            National Pokédex
          </h1>
          <p className="text-muted-foreground">Browse and filter all discovered Pokémon species.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filters</span>
          </div>
          
          <select 
            value={params.generation || ''}
            onChange={(e) => handleFilterChange('generation', e.target.value ? Number(e.target.value) : undefined)}
            className="bg-transparent text-white text-sm border-none focus:ring-0 cursor-pointer appearance-none px-2 py-1 hover:text-primary outline-none"
          >
            <option value="" className="bg-black text-white">All Gens</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(gen => (
              <option key={gen} value={gen} className="bg-black text-white">Gen {gen}</option>
            ))}
          </select>

          <select
            value={params.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            className="bg-transparent text-white text-sm border-none focus:ring-0 cursor-pointer appearance-none px-2 py-1 hover:text-primary outline-none capitalize"
          >
            <option value="" className="bg-black text-white">All Types</option>
            {typesResponse?.map(type => (
              <option key={type.name} value={type.name} className="bg-black text-white capitalize">{type.name}</option>
            ))}
          </select>

          <select
            value={params.sortBy || 'id'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
            className="bg-transparent text-white text-sm border-none focus:ring-0 cursor-pointer appearance-none px-2 py-1 hover:text-primary outline-none"
          >
            <option value="id" className="bg-black text-white">Sort by ID</option>
            <option value="name" className="bg-black text-white">Sort by Name</option>
            <option value="baseStatTotal" className="bg-black text-white">Sort by Base Stats</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {isLoading ? (
          Array(24).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : listResponse?.data && listResponse.data.length > 0 ? (
          listResponse.data.map((pokemon, i) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} index={i} />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white mb-2">No Pokémon found</h3>
            <p className="text-muted-foreground max-w-md">We couldn't find any Pokémon matching your current filters. Try adjusting your search criteria.</p>
            <button 
              onClick={() => setParams({ page: 1, limit: 24, sortBy: 'id', sortOrder: 'asc' })}
              className="mt-6 px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => handlePageChange((params.page || 1) - 1)}
            disabled={(params.page || 1) === 1}
            className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              const current = params.page || 1;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (current <= 3) {
                pageNum = i + 1;
              } else if (current >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = current - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-full font-medium transition-all ${
                    current === pageNum 
                      ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,204,0,0.3)]' 
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange((params.page || 1) + 1)}
            disabled={(params.page || 1) === totalPages}
            className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </PageTransition>
  );
}
