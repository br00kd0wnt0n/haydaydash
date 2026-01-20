import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { ScenarioResult, StrategyType } from '../../types';
import { strategies } from '../../data/defaults';
import { useFormatting } from '../../hooks/useFormatting';
import { Star } from 'lucide-react';

interface ScenarioCardProps {
  scenario: ScenarioResult;
  color: string;
  onApply: () => void;
  isRecommended?: boolean;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3 h-3 ${star <= rating ? 'text-hay-gold' : 'text-hay-cream-dark'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export function ScenarioCard({ scenario, color, onApply, isRecommended }: ScenarioCardProps) {
  const { formatCurrency, formatNumber } = useFormatting();
  const strategy = strategies[scenario.strategy];

  const formatValue = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    return `${(value / 1_000).toFixed(0)}K`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden relative ${isRecommended ? 'ring-2 ring-hay-gold ring-offset-2' : ''}`}>
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-1 bg-hay-gold text-white text-xs font-semibold rounded-full shadow-lg">
          <Star className="w-3 h-3 fill-white" />
          <span>Best ROI at Current Settings</span>
        </div>
      )}
      {/* Header */}
      <div
        className="px-4 py-3 text-white"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{strategy.emoji}</span>
          <div>
            <h3 className="font-semibold font-display">{strategy.name}</h3>
            <p className="text-xs opacity-90">{strategy.description}</p>
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-32 px-2 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={scenario.monthlyProjections} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${scenario.strategy}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={['auto', 'auto']} />
            <Area
              type="monotone"
              dataKey="baseline"
              fill="#e5e5e5"
              stroke="#9CA3AF"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="projected"
              fill={`url(#gradient-${scenario.strategy})`}
              stroke={color}
              strokeWidth={2}
            />
            <ReferenceLine x="Jun" stroke="#B8433E" strokeDasharray="2 2" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="p-4 bg-hay-cream">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-hay-brown-light text-xs">Total Installs</p>
            <p className="font-bold text-hay-brown">{formatNumber(scenario.totalIncrementalInstalls)}</p>
          </div>
          <div>
            <p className="text-hay-brown-light text-xs">Retained D90</p>
            <p className="font-bold text-hay-brown">{formatNumber(scenario.retainedAtD90)}</p>
          </div>
          <div>
            <p className="text-hay-brown-light text-xs">ROI</p>
            <p className="font-bold text-hay-gold">{scenario.campaignROI.toFixed(2)}x</p>
          </div>
          <div>
            <p className="text-hay-brown-light text-xs">Avg CPI</p>
            <p className="font-bold text-hay-brown">{formatCurrency(scenario.avgCPI)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-hay-brown-light text-xs mb-1">Quality Score</p>
            <StarRating rating={scenario.qualityScore} />
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="p-4 border-t border-hay-cream-dark">
        <h4 className="text-xs font-semibold text-hay-green mb-2 uppercase tracking-wide">Strengths</h4>
        <ul className="space-y-1">
          {scenario.strengths.slice(0, 3).map((strength, i) => (
            <li key={i} className="text-xs text-hay-brown-light flex items-start gap-1">
              <span className="text-hay-green mt-0.5">•</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trade-offs */}
      <div className="p-4 border-t border-hay-cream-dark">
        <h4 className="text-xs font-semibold text-hay-red mb-2 uppercase tracking-wide">Trade-offs</h4>
        <ul className="space-y-1">
          {scenario.tradeoffs.slice(0, 2).map((tradeoff, i) => (
            <li key={i} className="text-xs text-hay-brown-light flex items-start gap-1">
              <span className="text-hay-red mt-0.5">•</span>
              <span>{tradeoff}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t border-hay-cream-dark">
        <button
          onClick={onApply}
          className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors"
          style={{
            backgroundColor: color,
            color: 'white',
          }}
        >
          Apply This Strategy
        </button>
      </div>
    </div>
  );
}
