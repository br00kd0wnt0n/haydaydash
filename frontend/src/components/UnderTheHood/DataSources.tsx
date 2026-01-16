import React from 'react';
import { supercellData, socialChannelData, defaultBenchmarks, defaultRalphAssumptions } from '../../data/defaults';
import { useFormatting } from '../../hooks/useFormatting';
import { Tooltip } from '../shared/Tooltip';

export function DataSources() {
  const { formatNumber, formatCurrency } = useFormatting();
  return (
    <div className="space-y-6">
      {/* Supercell Data */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <h4 className="text-sm font-semibold text-hay-brown">Supercell Data</h4>
          <span className="text-xs text-hay-brown-light">(Confirmed Dec '25)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DataItem label="Lifetime Downloads" value={formatNumber(supercellData.lifetimeDownloads)} />
          <DataItem label="Monthly Installs" value={`${formatNumber(supercellData.monthlyInstalls)} (baseline)`} />
          <DataItem label="Monthly Revenue" value={formatCurrency(supercellData.monthlyRevenue)} tooltip="Calculated from DAU × ARPDAU × 30" />
          <DataItem
            label="DAU"
            value={formatNumber(supercellData.dau)}
            tooltip="Daily Active Users - confirmed Dec '25"
          />
          <DataItem
            label="MAU"
            value={formatNumber(supercellData.mau)}
            tooltip="Monthly Active Users - confirmed Dec '25"
          />
          <DataItem
            label="ARPDAU"
            value={`$${supercellData.arpdau.toFixed(2)}`}
            tooltip="Average Revenue Per Daily Active User - confirmed Dec '25"
          />
          <DataItem label="US App Store Ranking" value={`#${supercellData.appStoreRanking} Games/Family`} />
        </div>
      </div>

      {/* Social Channel Data */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <h4 className="text-sm font-semibold text-hay-brown">Social Data</h4>
          <span className="text-xs text-hay-brown-light">(Confirmed Sep '25)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DataItem label="Facebook" value={formatNumber(socialChannelData.facebook)} />
          <DataItem label="Instagram" value={formatNumber(socialChannelData.instagram)} />
          <DataItem label="TikTok" value={formatNumber(socialChannelData.tiktok)} />
          <DataItem label="YouTube" value={formatNumber(socialChannelData.youtube)} />
          <DataItem label="X (Twitter)" value={formatNumber(socialChannelData.twitter)} />
          <DataItem label="Reddit" value={formatNumber(socialChannelData.reddit)} estimated />
          <DataItem label="Twitch" value={formatNumber(socialChannelData.twitch)} estimated />
        </div>
      </div>

      {/* Retention & Performance Data */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <h4 className="text-sm font-semibold text-hay-brown">Retention Data</h4>
          <span className="text-xs text-hay-brown-light">(Confirmed from Steph)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DataItem label="D30 Retention (New)" value={`${(defaultBenchmarks.d30RetentionNew * 100).toFixed(1)}%`} tooltip="Confirmed: 11.1%" />
          <DataItem label="D30 Retention (Reactivated)" value={`${(defaultBenchmarks.d30RetentionReactivated * 100).toFixed(1)}%`} tooltip="Confirmed: 12.5%" />
          <DataItem label="D60 Decay" value={`${(defaultBenchmarks.d60RetentionDecay * 100).toFixed(0)}% of D30`} tooltip="Calculated from D60: 7.4%" />
          <DataItem label="D90 Decay" value={`${(defaultBenchmarks.d90RetentionDecay * 100).toFixed(0)}% of D60`} tooltip="Calculated from D90: 5.2%" />
          <DataItem label="Paid Social CPI" value={formatCurrency(defaultBenchmarks.paidSocialCPI)} estimated />
          <DataItem label="Organic Multiplier" value={`${defaultBenchmarks.organicMultiplier}x`} tooltip="Confirmed: organic-to-paid ratio 5-12x" />
        </div>
      </div>

      {/* Ralph Methodology */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          <h4 className="text-sm font-semibold text-hay-brown">Ralph Methodology</h4>
          <span className="text-xs text-hay-brown-light">(Proprietary assumptions)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DataItem label="Campaign Spike Multiplier" value={`${defaultRalphAssumptions.campaignSpikeMultiplier}x baseline`} />
          <DataItem label="Birthday Retention Bonus" value={`+${(defaultRalphAssumptions.retentionQualityBonus * 100).toFixed(0)}% D30`} />
          <DataItem label="Social Amplification" value={`${defaultRalphAssumptions.socialAmplificationFactor}x`} />
        </div>
      </div>
    </div>
  );
}

function DataItem({ label, value, tooltip, estimated }: { label: string; value: string; tooltip?: string; estimated?: boolean }) {
  return (
    <div className="bg-hay-cream rounded-lg p-3">
      <div className="flex items-center gap-1">
        <p className="text-xs text-hay-brown-light">{label}</p>
        {tooltip && <Tooltip content={tooltip} />}
        {estimated && <span className="text-xs text-hay-gold">*</span>}
      </div>
      <p className="text-sm font-semibold text-hay-brown">{value}</p>
    </div>
  );
}
