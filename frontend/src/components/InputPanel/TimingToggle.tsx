import React from 'react';
import { CampaignTiming } from '../../types';

interface TimingToggleProps {
  value: CampaignTiming;
  onChange: (timing: CampaignTiming) => void;
}

export function TimingToggle({ value, onChange }: TimingToggleProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-hay-brown mb-3 font-display">Campaign Timing</h3>
      <div className="flex gap-2">
        <button
          onClick={() => onChange('june_birthday')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
            value === 'june_birthday'
              ? 'bg-hay-gold text-white shadow-md'
              : 'bg-white text-hay-brown border border-hay-cream-dark hover:border-hay-gold/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>🎂</span>
            <span>June Birthday Focus</span>
          </div>
        </button>
        <button
          onClick={() => onChange('steady_state')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
            value === 'steady_state'
              ? 'bg-hay-gold text-white shadow-md'
              : 'bg-white text-hay-brown border border-hay-cream-dark hover:border-hay-gold/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>📊</span>
            <span>Steady State Month</span>
          </div>
        </button>
      </div>
    </div>
  );
}
