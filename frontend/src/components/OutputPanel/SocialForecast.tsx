import React from 'react';
import { SocialGrowthForecast } from '../../types';
import { Card } from '../shared/Card';
import { formatNumber } from '../../utils/calculations';

interface SocialForecastProps {
  data: SocialGrowthForecast[];
}

const platformIcons: Record<string, string> = {
  instagram: '📸',
  tiktok: '🎵',
  youtube: '🎬',
  twitter: '🐦',
  reddit: '🤖',
  twitch: '🎮',
};

const platformNames: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X (Twitter)',
  reddit: 'Reddit',
  twitch: 'Twitch',
};

export function SocialForecast({ data }: SocialForecastProps) {
  return (
    <Card title="Social Growth Forecast" subtitle="Projected follower growth by platform">
      <div className="space-y-3">
        {data.map((platform) => {
          const growth = platform.projected - platform.current;
          return (
            <div
              key={platform.platform}
              className="flex items-center gap-3 p-3 bg-hay-cream rounded-lg"
            >
              <span className="text-xl">{platformIcons[platform.platform] || '📱'}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-hay-brown">
                  {platformNames[platform.platform] || platform.platform}
                </p>
                <div className="flex items-center gap-2 text-xs text-hay-brown-light mt-1">
                  <span>{formatNumber(platform.current)}</span>
                  <span>→</span>
                  <span className="text-hay-green font-medium">
                    {formatNumber(platform.projected)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-hay-green">
                  +{platform.growthPercent.toFixed(1)}%
                </span>
                <p className="text-xs text-hay-brown-light">
                  +{formatNumber(growth)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
