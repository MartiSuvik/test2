import React from 'react';
import { EffectCard } from './EffectCard';
import type { Effect } from '../data/effects';

interface EffectGridProps {
  effects: Effect[];
  selectedEffect: Effect | null;
  onSelectEffect: (effect: Effect) => void;
}

export function EffectGrid({ effects, selectedEffect, onSelectEffect }: EffectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {effects.map((effect) => (
        <EffectCard
          key={effect.id}
          effect={effect}
          selected={selectedEffect?.id === effect.id}
          onSelect={onSelectEffect}
        />
      ))}
    </div>
  );
}