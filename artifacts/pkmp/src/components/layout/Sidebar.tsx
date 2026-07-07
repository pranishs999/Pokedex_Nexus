import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Database, 
  Search, 
  Heart, 
  BarChart2, 
  User, 
  ShieldAlert,
  Menu,
  X,
  LogOut,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/pokedex', label: 'Pokédex', icon: Database },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/compare', label: 'Compare', icon: BarChart2 },
  ];

  if (isAuthenticated) {
    links.push({ href: '/favorites', label: 'Favorites', icon: Heart });
  }

  const bottomLinks: Array<{ href: string; label: string; icon: React.ElementType }> = [];
  if (isAuthenticated) {
    bottomLinks.push({ href: '/profile', label: 'Profile', icon: User });
    if (user?.role === 'admin') {
      bottomLinks.push({ href: '/admin', label: 'Admin', icon: ShieldAlert });
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 pt-6 pb-6">
      <div className="px-6 mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 w-full h-[2px] bg-black -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-primary" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-wider text-primary group-hover:text-primary/80 transition-colors">PKMP</span>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-muted-foreground hover:text-white">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block">
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}>
                <link.icon size={20} className={isActive ? "text-primary" : ""} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto space-y-2 pt-6 border-t border-white/5">
        {bottomLinks.map((link) => {
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block">
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}>
                <link.icon size={20} className={isActive ? "text-primary" : ""} />
                {link.label}
              </div>
            </Link>
          );
        })}
        
        {isAuthenticated ? (
          <button 
            onClick={() => { logout(); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        ) : (
          <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-primary hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/20">
              <LogIn size={20} />
              Login
            </div>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
