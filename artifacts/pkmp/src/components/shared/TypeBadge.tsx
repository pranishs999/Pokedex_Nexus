import React from 'react';
import { cn } from '@/lib/utils';

interface TypeBadgeProps {
  type: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const typeColors: Record<string, string> = {
  normal: 'var(--color-type-normal)',
  fire: 'var(--color-type-fire)',
  water: 'var(--color-type-water)',
  electric: 'var(--color-type-electric)',
  grass: 'var(--color-type-grass)',
  ice: 'var(--color-type-ice)',
  fighting: 'var(--color-type-fighting)',
  poison: 'var(--color-type-poison)',
  ground: 'var(--color-type-ground)',
  flying: 'var(--color-type-flying)',
  psychic: 'var(--color-type-psychic)',
  bug: 'var(--color-type-bug)',
  rock: 'var(--color-type-rock)',
  ghost: 'var(--color-type-ghost)',
  dragon: 'var(--color-type-dragon)',
  dark: 'var(--color-type-dark)',
  steel: 'var(--color-type-steel)',
  fairy: 'var(--color-type-fairy)',
};

export function TypeBadge({ type, className, size = 'md' }: TypeBadgeProps) {
  const typeLower = type.toLowerCase();
  const color = typeColors[typeLower] || 'var(--color-muted)';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold tracking-wider uppercase rounded-full border border-white/20 shadow-sm backdrop-blur-sm',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 40%, transparent)`,
        color: '#fff',
        borderColor: `color-mix(in srgb, ${color} 80%, transparent)`,
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      }}
    >
      {type}
    </span>
  );
}
