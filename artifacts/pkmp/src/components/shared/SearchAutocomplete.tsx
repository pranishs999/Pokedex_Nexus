import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '@workspace/api-client-react'; // assuming a generated hook exists
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  name: string;
  type: string;
}

export function SearchAutocomplete({ placeholder = 'Search…' }: { placeholder?: string }) {
  const [query, setQuery] = useState('');
  const { data: results = [], isLoading } = useSearch({
    query: { enabled: query.length > 0 },
    request: { params: { q: query } } as any,
  });
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className="w-full h-10 bg-black/40 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
      />
      <AnimatePresence>
        {open && query && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-1 bg-card-premium border border-border-subtle rounded-xl shadow-premium max-h-64 overflow-y-auto z-20"
          >
            {isLoading && (
              <li className="px-4 py-2 text-muted-foreground">Loading...</li>
            )}
            {!isLoading && results.length === 0 && (
              <li className="px-4 py-2 text-muted-foreground">No results</li>
            )}
            {results.map((item: SearchResult) => (
              <li
                key={item.id}
                className={cn(
                  'px-4 py-2 cursor-pointer hover:bg-white/5 hover:text-white flex items-center gap-2',
                )}
                onClick={() => {
                  setQuery(item.name);
                  setOpen(false);
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: `var(--color-type-${item.type.toLowerCase()})` }}
                />
                {item.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
