import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative text-foreground">
      {/* Base noise and grain - moved to index.css base but keeping structural relative here */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden relative">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 relative z-10 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
        
        {/* Subtle ambient light from bottom right */}
        <div className="fixed bottom-0 right-0 w-[50vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      </div>
    </div>
  );
}
