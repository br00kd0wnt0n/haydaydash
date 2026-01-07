import React from 'react';
import { IndustryBenchmarks } from '../../types';
import { benchmarkRanges } from '../../data/defaults';
import { benchmarkTooltips } from '../../data/tooltips';
import { Tooltip } from '../shared/Tooltip';
import { useFormatting } from '../../hooks/useFormatting';

interface CostModelProps {
  benchmarks: IndustryBenchmarks;
  onChange: (benchmarks: IndustryBenchmarks) => void;
}

export function CostModel({ benchmarks, onChange }: CostModelProps) {
  const { formatCurrency, symbol } = useFormatting();
  const handleChange = (key: keyof IndustryBenchmarks, value: number) => {
    onChange({ ...benchmarks, [key]: value });
  };

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-semibold text-hay-brown">Cost Assumptions</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Paid Social CPI */}
        <div className="bg-hay-cream rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-hay-brown">Paid Social CPI</span>
              <Tooltip content={benchmarkTooltips.paidSocialCPI} />
            </div>
            <span className="text-sm font-semibold text-hay-gold">
              {formatCurrency(benchmarks.paidSocialCPI)}
            </span>
          </div>
          <input
            type="range"
            min={benchmarkRanges.paidSocialCPI.min}
            max={benchmarkRanges.paidSocialCPI.max}
            step={benchmarkRanges.paidSocialCPI.step}
            value={benchmarks.paidSocialCPI}
            onChange={(e) => handleChange('paidSocialCPI', parseFloat(e.target.value))}
            className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-hay-brown-light mt-1">
            <span>{formatCurrency(benchmarkRanges.paidSocialCPI.min)}</span>
            <span>{formatCurrency(benchmarkRanges.paidSocialCPI.max)}</span>
          </div>
        </div>

        {/* Organic Multiplier */}
        <div className="bg-hay-cream rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-hay-brown">Organic Multiplier</span>
              <Tooltip content={benchmarkTooltips.organicMultiplier} />
            </div>
            <span className="text-sm font-semibold text-hay-gold">
              {benchmarks.organicMultiplier.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min={benchmarkRanges.organicMultiplier.min}
            max={benchmarkRanges.organicMultiplier.max}
            step={benchmarkRanges.organicMultiplier.step}
            value={benchmarks.organicMultiplier}
            onChange={(e) => handleChange('organicMultiplier', parseFloat(e.target.value))}
            className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-hay-brown-light mt-1">
            <span>{benchmarkRanges.organicMultiplier.min}x</span>
            <span>{benchmarkRanges.organicMultiplier.max}x</span>
          </div>
        </div>
      </div>

      {/* Channel CPI Reference */}
      <div className="mt-6">
        <h5 className="text-xs font-semibold text-hay-brown-light mb-3 uppercase tracking-wide">
          Channel CPI Reference
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <CostItem label="Paid Social" value={formatCurrency(2.50)} />
          <CostItem label="Influencer" value={formatCurrency(4.00)} />
          <CostItem label="eCRM" value={formatCurrency(0.50)} />
          <CostItem label="PR" value={formatCurrency(3.00)} />
          <CostItem label="Store" value={formatCurrency(1.00)} />
          <CostItem label="GiveBack" value={formatCurrency(2.00)} />
          <CostItem label="Organic" value={formatCurrency(0.00)} />
        </div>
      </div>
    </div>
  );
}

function CostItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-hay-cream-dark">
      <p className="text-xs text-hay-brown-light">{label}</p>
      <p className="text-sm font-semibold text-hay-brown">{value}</p>
    </div>
  );
}
