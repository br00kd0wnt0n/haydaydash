import React from 'react';
import { IndustryBenchmarks } from '../../types';
import { benchmarkRanges } from '../../data/defaults';
import { benchmarkTooltips } from '../../data/tooltips';
import { Tooltip } from '../shared/Tooltip';

interface RetentionModelProps {
  benchmarks: IndustryBenchmarks;
  onChange: (benchmarks: IndustryBenchmarks) => void;
  onReset: () => void;
}

export function RetentionModel({ benchmarks, onChange, onReset }: RetentionModelProps) {
  const handleChange = (key: keyof IndustryBenchmarks, value: number) => {
    onChange({ ...benchmarks, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-hay-brown">Retention Assumptions</h4>
        <button
          onClick={onReset}
          className="text-xs text-hay-gold hover:text-hay-gold/80 font-medium"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* D30 Retention - New */}
        <BenchmarkSlider
          label="D30 Retention (New Players)"
          value={benchmarks.d30RetentionNew}
          range={benchmarkRanges.d30RetentionNew}
          tooltip={benchmarkTooltips.d30RetentionNew}
          format={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(v) => handleChange('d30RetentionNew', v)}
        />

        {/* D30 Retention - Reactivated */}
        <BenchmarkSlider
          label="D30 Retention (Reactivated)"
          value={benchmarks.d30RetentionReactivated}
          range={benchmarkRanges.d30RetentionReactivated}
          tooltip={benchmarkTooltips.d30RetentionReactivated}
          format={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(v) => handleChange('d30RetentionReactivated', v)}
        />

        {/* D60 Decay */}
        <BenchmarkSlider
          label="D60 Retention Decay"
          value={benchmarks.d60RetentionDecay}
          range={benchmarkRanges.d60RetentionDecay}
          tooltip={benchmarkTooltips.d60RetentionDecay}
          format={(v) => `${(v * 100).toFixed(0)}% of D30`}
          onChange={(v) => handleChange('d60RetentionDecay', v)}
        />

        {/* D90 Decay */}
        <BenchmarkSlider
          label="D90 Retention Decay"
          value={benchmarks.d90RetentionDecay}
          range={benchmarkRanges.d90RetentionDecay}
          tooltip={benchmarkTooltips.d90RetentionDecay}
          format={(v) => `${(v * 100).toFixed(0)}% of D60`}
          onChange={(v) => handleChange('d90RetentionDecay', v)}
        />

        {/* eCRM Reactivation Rate */}
        <BenchmarkSlider
          label="eCRM Reactivation Rate"
          value={benchmarks.eCRMReactivationRate}
          range={benchmarkRanges.eCRMReactivationRate}
          tooltip={benchmarkTooltips.eCRMReactivationRate}
          format={(v) => `${(v * 100).toFixed(1)}%`}
          onChange={(v) => handleChange('eCRMReactivationRate', v)}
        />

        {/* Push Notification CTR */}
        <BenchmarkSlider
          label="Push Notification CTR"
          value={benchmarks.pushNotificationCTR}
          range={benchmarkRanges.pushNotificationCTR}
          tooltip={benchmarkTooltips.pushNotificationCTR}
          format={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(v) => handleChange('pushNotificationCTR', v)}
        />
      </div>

      {/* Retention Formula Display */}
      <div className="mt-6 p-4 bg-hay-brown/5 rounded-lg">
        <h5 className="text-xs font-semibold text-hay-brown-light mb-2 uppercase tracking-wide">
          Retention Calculation
        </h5>
        <code className="text-xs text-hay-brown block whitespace-pre-wrap font-mono">
{`D90 Retained = Installs × D30 Rate × D60 Decay × D90 Decay

Example (New Players):
  D90 = 100,000 × ${(benchmarks.d30RetentionNew * 100).toFixed(0)}% × ${(benchmarks.d60RetentionDecay * 100).toFixed(0)}% × ${(benchmarks.d90RetentionDecay * 100).toFixed(0)}%
  D90 = ${Math.round(100000 * benchmarks.d30RetentionNew * benchmarks.d60RetentionDecay * benchmarks.d90RetentionDecay).toLocaleString()} retained`}
        </code>
      </div>
    </div>
  );
}

interface BenchmarkSliderProps {
  label: string;
  value: number;
  range: { min: number; max: number; step: number };
  tooltip: string;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function BenchmarkSlider({ label, value, range, tooltip, format, onChange }: BenchmarkSliderProps) {
  return (
    <div className="bg-hay-cream rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-hay-brown">{label}</span>
          <Tooltip content={tooltip} />
        </div>
        <span className="text-sm font-semibold text-hay-gold">{format(value)}</span>
      </div>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-hay-brown-light mt-1">
        <span>{format(range.min)}</span>
        <span>{format(range.max)}</span>
      </div>
    </div>
  );
}
