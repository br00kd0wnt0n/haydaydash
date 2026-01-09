import React from 'react';
import { SocialGrowthForecast } from '../../types';
import { Card } from '../shared/Card';
import { useFormatting } from '../../hooks/useFormatting';

interface SocialForecastProps {
  data: SocialGrowthForecast[];
}

// Platform icon file mapping
const platformIconFiles: Record<string, string> = {
  instagram: 'insta_logo.png',
  tiktok: 'tiktok_logo.png',
  youtube: 'youtube_logo.png',
  twitter: 'x_logo.png',
  reddit: 'reddit_logo.png',
  twitch: 'twitch_logo.png',
};

// Platform logo components - using official brand icons
const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconFile = platformIconFiles[platform] || `${platform}.png`;
  const iconPath = `/icons/${iconFile}`;
  return (
    <img
      src={iconPath}
      alt={platform}
      className="w-6 h-6 object-contain"
      onError={(e) => {
        // Fallback to emoji if icon not found
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextElementSibling?.classList.remove('hidden');
      }}
    />
  );
};

// Fallback emojis in case icons aren't loaded
const platformEmojis: Record<string, string> = {
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

const SOCIAL_TOOLTIP = `Projections are affected by:
• Strategy selection (New Neighbors = highest social impact)
• Budget allocated to Influencer & Organic channels
• Total campaign budget
• Campaign timing (Birthday tentpole applies 1.4x multiplier)`;

export function SocialForecast({ data }: SocialForecastProps) {
  const { formatNumber } = useFormatting();
  return (
    <Card
      title="Social Growth Forecast"
      subtitle="Projected follower growth by platform"
      tooltip={SOCIAL_TOOLTIP}
    >
      <div className="space-y-3">
        {data.map((platform) => {
          const growth = platform.projected - platform.current;
          return (
            <div
              key={platform.platform}
              className="flex items-center gap-3 p-3 bg-hay-cream rounded-lg"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <PlatformIcon platform={platform.platform} />
                <span className="hidden text-xl">{platformEmojis[platform.platform] || '📱'}</span>
              </div>
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
