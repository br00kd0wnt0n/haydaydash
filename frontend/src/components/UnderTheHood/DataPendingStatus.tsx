import React from 'react';
import { DataPointStatus, DataConfidenceLevel } from '../../types';
import { supercellData, defaultBenchmarks } from '../../data/defaults';
import { useFormatting } from '../../hooks/useFormatting';
import { Tooltip } from '../shared/Tooltip';

// Define which data points are pending client confirmation
const dataPointStatuses: DataPointStatus[] = [
  // Awaiting from client (your email request)
  {
    key: 'dau',
    label: 'DAU',
    value: '1.5M',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'Daily Active Users - awaiting actual data from client',
  },
  {
    key: 'mau',
    label: 'MAU',
    value: '10M',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'Monthly Active Users - awaiting actual data from client',
  },
  {
    key: 'arpdau',
    label: 'ARPDAU',
    value: '€0.35',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'Average Revenue Per DAU - critical for player value calculation',
  },
  {
    key: 'd7Retention',
    label: 'D7 Retention',
    value: 'Unknown',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'Client mentioned "sharp D7 drop" - need actual figures',
  },
  {
    key: 'd30Retention',
    label: 'D30/60/90 Retention Curves',
    value: '15%/9%/4.5%',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'Full retention curves for new and reactivated players',
  },
  {
    key: 'reactivationRate',
    label: 'Reactivation Success Rate',
    value: '3%',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'What % of dormant players return when targeted',
  },
  {
    key: 'dormantPool',
    label: 'Reachable Dormant Pool',
    value: '~51M (15%)',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'How many lapsed players are actually reachable',
  },
  {
    key: 'historicalCampaign',
    label: 'Historical Campaign Spikes',
    value: '2.0-3.0x',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'Past birthday/holiday tentpole performance',
  },
  {
    key: 'channelCPI',
    label: 'Channel CPI Benchmarks',
    value: 'Industry avg',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'Actual paid social / influencer costs for Hay Day',
  },
  {
    key: 'organicMultiplier',
    label: 'Organic Multiplier (Observed)',
    value: '1.3x',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'Actual paid-to-organic lift observed in past campaigns',
  },
  {
    key: 'regionalPerf',
    label: 'Regional Efficiency',
    value: 'US/DE/RoW split',
    confidence: 'pending',
    source: 'Requested from Stef',
    tooltip: 'US vs Germany vs RoW performance differences',
  },
  // Already confirmed
  {
    key: 'lifetimeDownloads',
    label: 'Lifetime Downloads',
    value: '341M',
    confidence: 'confirmed',
    source: 'Supercell public data',
    tooltip: 'Total downloads since launch - confirmed',
  },
  {
    key: 'monthlyInstalls',
    label: 'Monthly Installs (Baseline)',
    value: '1-2M',
    confidence: 'confirmed',
    source: 'Client brief',
    tooltip: 'Approximate monthly install range',
  },
  // Estimated (Ralph methodology)
  {
    key: 'campaignSpike',
    label: 'Campaign Spike Multiplier',
    value: '2.5x',
    confidence: 'estimated',
    source: 'Ralph methodology',
    tooltip: 'Based on industry benchmarks - will refine with actual data',
  },
  {
    key: 'socialAmplification',
    label: 'Social Amplification Factor',
    value: '1.4x',
    confidence: 'estimated',
    source: 'Ralph methodology',
    tooltip: 'Estimated organic social boost during campaign',
  },
];

const confidenceConfig: Record<DataConfidenceLevel, { color: string; bgColor: string; icon: string; label: string }> = {
  confirmed: {
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    icon: '✓',
    label: 'Confirmed',
  },
  estimated: {
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    icon: '~',
    label: 'Estimated',
  },
  pending: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: '⏳',
    label: 'Awaiting Data',
  },
};

export function DataPendingStatus() {
  const pendingCount = dataPointStatuses.filter(d => d.confidence === 'pending').length;
  const confirmedCount = dataPointStatuses.filter(d => d.confidence === 'confirmed').length;
  const estimatedCount = dataPointStatuses.filter(d => d.confidence === 'estimated').length;

  const groupedData = {
    pending: dataPointStatuses.filter(d => d.confidence === 'pending'),
    estimated: dataPointStatuses.filter(d => d.confidence === 'estimated'),
    confirmed: dataPointStatuses.filter(d => d.confidence === 'confirmed'),
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-sm font-semibold text-hay-brown">Data Confidence Status</h4>
        <span className="text-xs text-hay-brown-light">(What we know vs. what we're waiting for)</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
          <p className="text-xs text-amber-600">Awaiting Client Data</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">{estimatedCount}</p>
          <p className="text-xs text-purple-600">Estimated (Ralph)</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{confirmedCount}</p>
          <p className="text-xs text-green-600">Confirmed</p>
        </div>
      </div>

      {/* Alert banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-sm font-medium text-amber-800">
              {pendingCount} data points awaiting client confirmation
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Model projections will be refined once Stef responds to your data request.
              Current estimates use industry benchmarks which may not reflect Hay Day's actual performance.
            </p>
          </div>
        </div>
      </div>

      {/* Pending data points */}
      <div className="space-y-4">
        {(['pending', 'estimated', 'confirmed'] as DataConfidenceLevel[]).map((level) => (
          <div key={level}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm ${confidenceConfig[level].color}`}>
                {confidenceConfig[level].icon}
              </span>
              <h5 className={`text-sm font-medium ${confidenceConfig[level].color}`}>
                {confidenceConfig[level].label}
              </h5>
              <span className="text-xs text-hay-brown-light">
                ({groupedData[level].length} items)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {groupedData[level].map((item) => (
                <div
                  key={item.key}
                  className={`${confidenceConfig[level].bgColor} border rounded-lg p-3`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-hay-brown">{item.label}</span>
                      {item.tooltip && <Tooltip content={item.tooltip} />}
                    </div>
                    <span className={`text-xs font-mono ${confidenceConfig[level].color}`}>
                      {item.value}
                    </span>
                  </div>
                  <p className="text-xs text-hay-brown-light mt-1">{item.source}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
