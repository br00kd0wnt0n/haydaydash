import React from 'react';
import { Tooltip } from './Tooltip';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  tooltip?: string;
  format?: (value: number) => string;
  disabled?: boolean;
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  tooltip,
  format = (v) => v.toString(),
  disabled = false,
}: SliderInputProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-hay-brown">{label}</label>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
        <span className="text-sm font-semibold text-hay-gold">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-hay-cream-dark rounded-lg appearance-none cursor-pointer disabled:opacity-50"
      />
      <div className="flex justify-between text-xs text-hay-brown-light mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
