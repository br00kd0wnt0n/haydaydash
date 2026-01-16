import React from 'react';
import { SliderInput } from '../shared/SliderInput';
import { useFormatting } from '../../hooks/useFormatting';

interface BudgetSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const { formatCurrencyCompact } = useFormatting();
  const formatBudget = (v: number) => formatCurrencyCompact(v);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-hay-brown mb-3 font-display">Campaign Budget</h3>
      <div className="bg-white rounded-xl p-4 border border-hay-cream-dark">
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-hay-gold font-display">
            {formatBudget(value)}
          </span>
        </div>
        <SliderInput
          label=""
          value={value}
          onChange={onChange}
          min={500_000}
          max={2_500_000}
          step={250_000}
          format={formatBudget}
        />
        <p className="text-xs text-hay-brown-light text-center mt-2">
          Birthday campaign (June 2026) - all-inclusive production + media
        </p>
      </div>
    </div>
  );
}
