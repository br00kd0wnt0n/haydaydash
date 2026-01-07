import React from 'react';
import { ChannelResult } from '../../types';
import { Card } from '../shared/Card';
import { channelInfo } from '../../data/defaults';
import { useFormatting } from '../../hooks/useFormatting';

interface ChannelBreakdownProps {
  data: ChannelResult[];
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 justify-end">
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

export function ChannelBreakdown({ data }: ChannelBreakdownProps) {
  const { formatCurrency, formatNumber } = useFormatting();
  // Sort by spend
  const sortedData = [...data].sort((a, b) => b.spend - a.spend);
  const totalSpend = data.reduce((sum, ch) => sum + ch.spend, 0);
  const totalInstalls = data.reduce((sum, ch) => sum + ch.installs, 0);

  return (
    <Card title="Channel Efficiency" subtitle="Spend, installs, and quality by channel">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hay-cream-dark">
              <th className="text-left py-2 text-hay-brown-light font-medium">Channel</th>
              <th className="text-right py-2 text-hay-brown-light font-medium">Spend</th>
              <th className="text-right py-2 text-hay-brown-light font-medium">Installs</th>
              <th className="text-right py-2 text-hay-brown-light font-medium">CPI</th>
              <th className="text-right py-2 text-hay-brown-light font-medium">Quality</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((channel) => {
              const info = channelInfo[channel.name as keyof typeof channelInfo];
              return (
                <tr key={channel.name} className="border-b border-hay-cream">
                  <td className="py-3">
                    <span className="font-medium text-hay-brown">
                      {info?.name || channel.name}
                    </span>
                  </td>
                  <td className="text-right py-3 text-hay-brown">
                    {formatCurrency(channel.spend)}
                  </td>
                  <td className="text-right py-3 text-hay-brown">
                    {formatNumber(channel.installs)}
                  </td>
                  <td className="text-right py-3 text-hay-brown">
                    {channel.cpi > 0 ? formatCurrency(channel.cpi) : '-'}
                  </td>
                  <td className="text-right py-3">
                    <StarRating rating={channel.qualityScore} />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-hay-cream font-semibold">
              <td className="py-3 text-hay-brown">Total</td>
              <td className="text-right py-3 text-hay-brown">{formatCurrency(totalSpend)}</td>
              <td className="text-right py-3 text-hay-brown">{formatNumber(totalInstalls)}</td>
              <td className="text-right py-3 text-hay-brown">
                {formatCurrency(totalSpend / totalInstalls)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
