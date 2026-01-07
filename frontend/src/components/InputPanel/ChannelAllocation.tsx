import React, { useCallback } from 'react';
import { ChannelAllocation as ChannelAllocationType } from '../../types';
import { channelInfo } from '../../data/defaults';
import { Tooltip } from '../shared/Tooltip';

interface ChannelAllocationProps {
  value: ChannelAllocationType;
  onChange: (channels: ChannelAllocationType) => void;
}

const channelGroups = [
  {
    name: 'Paid Channels',
    channels: ['paidSocial', 'influencer'] as const,
  },
  {
    name: 'Owned Channels',
    channels: ['eCRM', 'organic'] as const,
  },
  {
    name: 'Earned/Partnership',
    channels: ['pr', 'store', 'giveBack'] as const,
  },
];

export function ChannelAllocation({ value, onChange }: ChannelAllocationProps) {
  const total = Object.values(value).reduce((sum, v) => sum + v, 0);

  const handleChange = useCallback((channel: keyof ChannelAllocationType, newValue: number) => {
    const oldValue = value[channel];
    const diff = newValue - oldValue;
    const otherTotal = total - oldValue;

    if (otherTotal + newValue > 100) {
      // Scale down other channels proportionally
      const scale = (100 - newValue) / otherTotal;
      const newChannels = { ...value };
      Object.keys(newChannels).forEach((key) => {
        if (key !== channel) {
          newChannels[key as keyof ChannelAllocationType] = Math.round(
            newChannels[key as keyof ChannelAllocationType] * scale
          );
        }
      });
      newChannels[channel] = newValue;
      onChange(newChannels);
    } else {
      onChange({ ...value, [channel]: newValue });
    }
  }, [value, onChange, total]);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-hay-brown font-display">Channel Allocation</h3>
        <span className={`text-sm font-medium ${total === 100 ? 'text-hay-green' : 'text-hay-red'}`}>
          {total}%
        </span>
      </div>

      {channelGroups.map((group) => (
        <div key={group.name} className="mb-4">
          <h4 className="text-xs font-medium text-hay-brown-light mb-2 uppercase tracking-wide">
            {group.name}
          </h4>
          <div className="space-y-3">
            {group.channels.map((channel) => {
              const info = channelInfo[channel];
              return (
                <div key={channel} className="bg-white rounded-lg p-3 border border-hay-cream-dark">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-hay-brown">{info.name}</span>
                      <Tooltip content={info.tooltip} />
                    </div>
                    <span className="text-sm font-semibold text-hay-gold">{value[channel]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={value[channel]}
                    onChange={(e) => handleChange(channel, parseInt(e.target.value))}
                    className="w-full h-2 bg-hay-cream-dark rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
