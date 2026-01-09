import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { ProjectionMonth } from '../../types';
import { Card } from '../shared/Card';
import { GitCompare } from 'lucide-react';

interface ProjectionChartProps {
  data: ProjectionMonth[];
  timing: 'june_birthday' | 'steady_state';
  retentionRate?: number;
  onCompareClick?: () => void;
}

type ChartView = 'installs' | 'cumulative';

export function ProjectionChart({ data, timing, retentionRate = 0.18, onCompareClick }: ProjectionChartProps) {
  const [chartView, setChartView] = useState<ChartView>('installs');

  const formatValue = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    return `${(value / 1_000).toFixed(0)}K`;
  };

  // Calculate cumulative retained players
  const cumulativeData = useMemo(() => {
    let cumulativeBaseline = 0;
    let cumulativeProjected = 0;
    let cumulativeOptimistic = 0;
    let cumulativeConservative = 0;

    return data.map((month) => {
      // Add new installs, apply retention decay to existing
      cumulativeBaseline = (cumulativeBaseline * 0.95) + (month.baseline * retentionRate);
      cumulativeProjected = (cumulativeProjected * 0.95) + (month.projected * retentionRate);
      cumulativeOptimistic = (cumulativeOptimistic * 0.95) + (month.optimistic * retentionRate);
      cumulativeConservative = (cumulativeConservative * 0.95) + (month.conservative * retentionRate);

      return {
        month: month.month,
        baseline: Math.round(cumulativeBaseline),
        projected: Math.round(cumulativeProjected),
        optimistic: Math.round(cumulativeOptimistic),
        conservative: Math.round(cumulativeConservative),
      };
    });
  }, [data, retentionRate]);

  const chartData = chartView === 'installs' ? data : cumulativeData;

  const juneIndex = data.findIndex(d => d.month === 'Jun');
  const juneData = data[juneIndex];
  const spikeAboveBaseline = juneData ? juneData.projected - juneData.baseline : 0;

  // Calculate cumulative difference at year end
  const yearEndCumulative = cumulativeData[cumulativeData.length - 1];
  const cumulativeLift = yearEndCumulative ? yearEndCumulative.projected - yearEndCumulative.baseline : 0;

  return (
    <Card
      title="Campaign Projection"
      subtitle={timing === 'june_birthday' ? 'January - December 2026' : 'Steady state monthly performance'}
    >
      {/* Compare Button - Top Right */}
      {onCompareClick && (
        <div className="flex justify-end mb-3">
          <button
            onClick={onCompareClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-hay-cream rounded-lg text-hay-brown font-medium text-xs hover:bg-hay-cream-dark transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare All Scenarios
          </button>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-xs text-hay-brown-light">View:</span>
        <div className="flex bg-hay-cream rounded-lg p-1">
          <button
            onClick={() => setChartView('installs')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              chartView === 'installs'
                ? 'bg-white text-hay-brown shadow-sm'
                : 'text-hay-brown-light hover:text-hay-brown'
            }`}
          >
            Monthly Installs
          </button>
          <button
            onClick={() => setChartView('cumulative')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              chartView === 'cumulative'
                ? 'bg-white text-hay-brown shadow-sm'
                : 'text-hay-brown-light hover:text-hay-brown'
            }`}
          >
            Cumulative Retained
          </button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4D4D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4D4D4" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8B923" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E8B923" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5ECD3" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#3D2914', fontSize: 12 }}
              axisLine={{ stroke: '#D4D4D4' }}
            />
            <YAxis
              tickFormatter={formatValue}
              tick={{ fill: '#3D2914', fontSize: 12 }}
              axisLine={{ stroke: '#D4D4D4' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatValue(value), name]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E8B923',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: '#3D2914', fontWeight: 600 }}
            />

            {/* Baseline band */}
            <Area
              type="monotone"
              dataKey="baseline"
              fill="url(#baselineGradient)"
              stroke="#9CA3AF"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Baseline"
            />

            {/* Conservative scenario */}
            <Line
              type="monotone"
              dataKey="conservative"
              stroke="#5B8C3E"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Conservative"
            />

            {/* Optimistic scenario */}
            <Line
              type="monotone"
              dataKey="optimistic"
              stroke="#E8A83A"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Optimistic"
            />

            {/* Projected (main line) */}
            <Area
              type="monotone"
              dataKey="projected"
              fill="url(#projectedGradient)"
              stroke="#E8B923"
              strokeWidth={3}
              name="Projected"
            />

            {/* Campaign tentpole markers */}
            {timing === 'june_birthday' && (
              <>
                <ReferenceLine
                  x="Jun"
                  stroke="#B8433E"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Birthday Tentpole',
                    position: 'top',
                    fill: '#B8433E',
                    fontSize: 10,
                  }}
                />
                <ReferenceLine
                  x="Oct"
                  stroke="#E8A83A"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Halloween',
                    position: 'top',
                    fill: '#E8A83A',
                    fontSize: 10,
                  }}
                />
                <ReferenceLine
                  x="Dec"
                  stroke="#5B8C3E"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Holiday',
                    position: 'top',
                    fill: '#5B8C3E',
                    fontSize: 10,
                  }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Key callouts */}
      {timing === 'june_birthday' && spikeAboveBaseline > 0 && (
        <div className="mt-4 flex gap-4">
          <div className="flex-1 bg-hay-red/10 rounded-lg p-3">
            <p className="text-xs text-hay-brown-light">Birthday Tentpole</p>
            <p className="text-lg font-bold text-hay-red font-display">
              +{formatValue(spikeAboveBaseline)}
            </p>
            <p className="text-xs text-hay-brown-light">June peak above baseline</p>
          </div>
          <div className="flex-1 bg-hay-gold/10 rounded-lg p-3">
            <p className="text-xs text-hay-brown-light">Always-On Activity</p>
            <p className="text-lg font-bold text-hay-gold font-display">12 Months</p>
            <p className="text-xs text-hay-brown-light">continuous engagement</p>
          </div>
          <div className="flex-1 bg-hay-green/10 rounded-lg p-3">
            <p className="text-xs text-hay-brown-light">Seasonal Beats</p>
            <p className="text-lg font-bold text-hay-green font-display">Oct + Dec</p>
            <p className="text-xs text-hay-brown-light">Halloween & Holiday lifts</p>
          </div>
        </div>
      )}
    </Card>
  );
}
