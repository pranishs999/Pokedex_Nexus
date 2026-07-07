import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useSearch, type SearchType } from '@workspace/api-client-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { Search as SearchIcon, Image as ImageIcon, Box, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchType>('all');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Update query when URL changes externally (e.g. from header search)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q && q !== query) {
      setQuery(q);
      setDebouncedQuery(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const { data: searchResults, isLoading } = useSearch({
    q: debouncedQuery,
    type: type !== 'all' ? type : undefined,
    limit: 50
  }, {
    query: { enabled: debouncedQuery.length > 1, queryKey: [] as unknown[] } as any
  });

  const getCategoryIcon = (cat: string) => {
    if (cat === 'pokemon') return <ImageIcon size={16} className="text-primary" />;
    if (cat === 'move') return <Zap size={16} className="text-blue-400" />;
    if (cat === 'ability') return <Box size={16} className="text-green-400" />;
    return <SearchIcon size={16} />;
  };

  return (
    <PageTransition className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Global Search</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Instantly find Pokémon, moves, and abilities across the entire database.
        </p>
      </div>

      <div className="glass-card p-4 rounded-full border border-white/10 flex items-center gap-4 relative z-20 shadow-2xl">
        <SearchIcon className="text-muted-foreground ml-4" size={24} />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type at least 2 characters..."
          className="flex-1 bg-transparent border-none text-white text-lg focus:outline-none focus:ring-0 placeholder:text-muted-foreground h-12"
          autoFocus
        />
        <div className="pr-2 hidden sm:flex">
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as SearchType)}
            className="bg-black/40 border border-white/10 text-white rounded-full px-4 py-2 text-sm focus:outline-none hover:bg-white/10 transition-colors cursor-pointer appearance-none outline-none"
          >
            <option value="all" className="bg-black">All Categories</option>
            <option value="pokemon" className="bg-black">Pokémon Only</option>
            <option value="move" className="bg-black">Moves Only</option>
            <option value="ability" className="bg-black">Abilities Only</option>
          </select>
        </div>
      </div>

      <div className="relative">
        {debouncedQuery.length <= 1 ? (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center">
            <SearchIcon size={48} className="opacity-20 mb-4" />
            <p>Start typing to search...</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : searchResults?.results.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center">
            <SearchIcon size={48} className="opacity-20 mb-4" />
            <p className="text-lg text-white mb-2">No results found for "{debouncedQuery}"</p>
            <p className="text-sm">Try adjusting your search terms or category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground px-2">
              Found {searchResults?.total} results for "{debouncedQuery}"
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults?.results.map((result, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  key={`${result.category}-${result.id}`}
                >
                  <Link href={result.url}>
                    <div className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-primary/50 transition-all group flex items-center gap-4 cursor-pointer hover:bg-white/[0.02]">
                      <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {result.imageUrl ? (
                          <img src={result.imageUrl} alt={result.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                        ) : (
                          getCategoryIcon(result.category)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-muted-foreground">
                            {result.category}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-xl text-white capitalize truncate group-hover:text-primary transition-colors">
                          {result.name.replace('-', ' ')}
                        </h3>
                        {result.subtitle && (
                          <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
