import React from 'react';
import type { Effect } from '../data/effects';

interface EffectCardProps {
  effect: Effect;
  selected: boolean;
  onSelect: (effect: Effect) => void;
}

export function EffectCard({ effect, selected, onSelect }: EffectCardProps) {
  return (
    <button
      onClick={() => onSelect(effect)}
      className={`relative overflow-hidden rounded-lg transition-all ${
        selected ? 'ring-2 ring-blue-500 scale-95' : 'hover:scale-105'
      }`}
    >
      <img
        src={effect.imageUrl}
        alt={effect.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-medium">{effect.name}</p>
        <p className="text-white/80 text-sm">{effect.description}</p>
      </div>
    </button>
  );
}