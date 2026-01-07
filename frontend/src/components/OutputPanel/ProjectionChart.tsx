import React from 'react';
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

interface ProjectionChartProps {
  data: ProjectionMonth[];
  timing: 'june_birthday' | 'steady_state';
}

export function ProjectionChart({ data, timing }: ProjectionChartProps) {
  const formatValue = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    return `${(value / 1_000).toFixed(0)}K`;
  };

  const juneIndex = data.findIndex(d => d.month === 'Jun');
  const juneData = data[juneIndex];
  const spikeAboveBaseline = juneData ? juneData.projected - juneData.baseline : 0;

  return (
    <Card
      title="Campaign Projection"
      subtitle={timing === 'june_birthday' ? 'January - December 2026' : 'Steady state monthly performance'}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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

            {/* June marker */}
            {timing === 'june_birthday' && (
              <ReferenceLine
                x="Jun"
                stroke="#B8433E"
                strokeDasharray="3 3"
                label={{
                  value: 'Campaign Launch',
                  position: 'top',
                  fill: '#B8433E',
                  fontSize: 11,
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Key callouts */}
      {timing === 'june_birthday' && spikeAboveBaseline > 0 && (
        <div className="mt-4 flex gap-4">
          <div className="flex-1 bg-hay-gold/10 rounded-lg p-3">
            <p className="text-xs text-hay-brown-light">June Spike</p>
            <p className="text-lg font-bold text-hay-gold font-display">
              +{formatValue(spikeAboveBaseline)}
            </p>
            <p className="text-xs text-hay-brown-light">above baseline</p>
          </div>
          <div className="flex-1 bg-hay-green/10 rounded-lg p-3">
            <p className="text-xs text-hay-brown-light">Sustained Lift</p>
            <p className="text-lg font-bold text-hay-green font-display">Through Q3</p>
            <p className="text-xs text-hay-brown-light">elevated performance</p>
          </div>
        </div>
      )}
    </Card>
  );
}
