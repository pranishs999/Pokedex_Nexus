import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

export function StatBar({ label, value, max = 255, color = 'var(--color-primary)', className }: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Calculate hue for color coding based on stat value (red -> yellow -> green)
  const getStatColor = (val: number) => {
    if (val < 50) return 'hsl(0 80% 60%)'; // Red
    if (val < 90) return 'hsl(45 100% 50%)'; // Yellow
    if (val < 120) return 'hsl(120 70% 50%)'; // Greenish
    return 'hsl(180 80% 50%)'; // Cyan/Blue for very high stats
  };

  const barColor = getStatColor(value);

  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <span className="w-12 text-muted-foreground font-bold tracking-wider text-xs uppercase">{label}</span>
      <span className="w-8 text-right font-heading font-bold text-foreground">{value}</span>
      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          style={{ backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
