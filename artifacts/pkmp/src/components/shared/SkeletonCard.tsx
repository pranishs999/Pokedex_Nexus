import React from 'react';

export function SkeletonCard() {
  return (
    <div className="h-[300px] glass-card rounded-2xl border border-white/5 p-5 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="flex justify-between items-start mb-2">
        <div className="w-12 h-6 bg-white/10 rounded-md" />
        <div className="w-8 h-8 bg-white/10 rounded-full" />
      </div>
      
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="w-32 h-32 rounded-full bg-white/10" />
      </div>
      
      <div className="mt-auto space-y-3">
        <div className="w-2/3 h-8 bg-white/10 rounded-md" />
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-white/10 rounded-full" />
          <div className="w-16 h-6 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
