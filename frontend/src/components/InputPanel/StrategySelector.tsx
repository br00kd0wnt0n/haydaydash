import React from 'react';
import { StrategyType } from '../../types';
import { strategies } from '../../data/defaults';
import { Tooltip } from '../shared/Tooltip';

interface StrategySelectorProps {
  value: StrategyType;
  onChange: (strategy: StrategyType) => void;
}

export function StrategySelector({ value, onChange }: StrategySelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-hay-brown mb-3 font-display">Strategy Focus</h3>
      <div className="space-y-3">
        {Object.values(strategies).map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => onChange(strategy.id)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              value === strategy.id
                ? 'border-hay-gold bg-hay-gold/10 shadow-md'
                : 'border-hay-cream-dark bg-white hover:border-hay-gold/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{strategy.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-hay-brown font-display">
                    {strategy.name}
                  </span>
                  <Tooltip content={`Auto-adjusts channel mix and retention assumptions for ${strategy.name.toLowerCase()} strategy`} />
                </div>
                <p className="text-sm text-hay-brown-light mt-1">{strategy.description}</p>
              </div>
              {value === strategy.id && (
                <div className="w-5 h-5 rounded-full bg-hay-gold flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
