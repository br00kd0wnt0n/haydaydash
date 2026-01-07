import React, { useCallback } from 'react';
import { RegionalSplit as RegionalSplitType } from '../../types';

interface RegionalSplitProps {
  value: RegionalSplitType;
  onChange: (regions: RegionalSplitType) => void;
}

const regions = [
  { key: 'us' as const, name: 'United States', flag: '🇺🇸' },
  { key: 'germany' as const, name: 'Germany', flag: '🇩🇪' },
  { key: 'row' as const, name: 'Rest of World', flag: '🌍' },
];

export function RegionalSplit({ value, onChange }: RegionalSplitProps) {
  const total = value.us + value.germany + value.row;

  const handleChange = useCallback((region: keyof RegionalSplitType, newValue: number) => {
    const oldValue = value[region];
    const otherTotal = total - oldValue;

    if (otherTotal + newValue > 100) {
      const scale = (100 - newValue) / otherTotal;
      const newRegions = { ...value };
      Object.keys(newRegions).forEach((key) => {
        if (key !== region) {
          newRegions[key as keyof RegionalSplitType] = Math.round(
            newRegions[key as keyof RegionalSplitType] * scale
          );
        }
      });
      newRegions[region] = newValue;
      onChange(newRegions);
    } else {
      onChange({ ...value, [region]: newValue });
    }
  }, [value, onChange, total]);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-hay-brown font-display">Regional Split</h3>
        <span className={`text-sm font-medium ${total === 100 ? 'text-hay-green' : 'text-hay-red'}`}>
          {total}%
        </span>
      </div>
      <div className="space-y-3">
        {regions.map((region) => (
          <div key={region.key} className="bg-white rounded-lg p-3 border border-hay-cream-dark">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{region.flag}</span>
                <span className="text-sm font-medium text-hay-brown">{region.name}</span>
              </div>
              <span className="text-sm font-semibold text-hay-gold">{value[region.key]}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={value[region.key]}
              onChange={(e) => handleChange(region.key, parseInt(e.target.value))}
              className="w-full h-2 bg-hay-cream-dark rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
