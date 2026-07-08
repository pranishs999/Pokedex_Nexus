import React, { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

export function Header({ setMobileOpen }: { setMobileOpen: (v: boolean) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-background/80 px-4 md:px-6 backdrop-blur-md border-b border-border/50">
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-white"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 flex justify-center md:justify-start">
        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search Pokémon, moves, abilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-black/40 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Link href="/search" className="sm:hidden p-2 text-muted-foreground hover:text-white">
          <Search size={20} />
        </Link>
      </div>
    </header>
  );
}
