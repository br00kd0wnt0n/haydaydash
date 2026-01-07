import React from 'react';
import { useFormatting } from '../../hooks/useFormatting';

export function FormulaDisplay() {
  const { symbol, formatCurrency } = useFormatting();
  return (
    <div className="space-y-6">
      <h4 className="text-sm font-semibold text-hay-brown">Forecast Formulas</h4>

      <div className="space-y-4">
        {/* Incremental Installs Formula */}
        <div className="bg-hay-cream rounded-lg p-4">
          <h5 className="text-xs font-semibold text-hay-brown-light mb-2 uppercase tracking-wide">
            Incremental Installs
          </h5>
          <code className="text-xs text-hay-brown block whitespace-pre-wrap font-mono leading-relaxed">
{`Incremental Installs =
  (Baseline Monthly × Spike Multiplier - Baseline Monthly) ×
  (Paid Efficiency × Paid Allocation +
   eCRM Efficiency × eCRM Allocation × Dormant Pool Factor +
   Organic Multiplier × Organic Allocation)`}
          </code>
        </div>

        {/* Player Value Formula */}
        <div className="bg-hay-cream rounded-lg p-4">
          <h5 className="text-xs font-semibold text-hay-brown-light mb-2 uppercase tracking-wide">
            Player Value
          </h5>
          <code className="text-xs text-hay-brown block whitespace-pre-wrap font-mono leading-relaxed">
{`Player Value =
  Incremental Installs ×
  Blended Retention Rate ×
  Average Days Retained ×
  ARPDAU

Where Blended Retention =
  (New Players × New Retention) + (Reactivated × Reactivated Retention)
  ───────────────────────────────────────────────────────────────────
                        Total Installs`}
          </code>
        </div>

        {/* ROI Formula */}
        <div className="bg-hay-cream rounded-lg p-4">
          <h5 className="text-xs font-semibold text-hay-brown-light mb-2 uppercase tracking-wide">
            Campaign ROI
          </h5>
          <code className="text-xs text-hay-brown block whitespace-pre-wrap font-mono leading-relaxed">
{`Campaign ROI = Player Value Generated / Campaign Investment

Example:
  ROI = ${formatCurrency(4649400)} / ${formatCurrency(1500000)} = 3.1x`}
          </code>
        </div>

        {/* Retention Chain */}
        <div className="bg-hay-cream rounded-lg p-4">
          <h5 className="text-xs font-semibold text-hay-brown-light mb-2 uppercase tracking-wide">
            Retention Chain
          </h5>
          <code className="text-xs text-hay-brown block whitespace-pre-wrap font-mono leading-relaxed">
{`D90 Retained Players =
  Installs × D30 Rate × D60 Decay × D90 Decay

With Birthday Bonus:
  D90 Retained = Installs × (D30 Rate + Quality Bonus) × D60 × D90`}
          </code>
        </div>

        {/* Channel Efficiency */}
        <div className="bg-hay-cream rounded-lg p-4">
          <h5 className="text-xs font-semibold text-hay-brown-light mb-2 uppercase tracking-wide">
            Channel Efficiency
          </h5>
          <code className="text-xs text-hay-brown block whitespace-pre-wrap font-mono leading-relaxed">
{`Paid Channel Installs = (Budget × Channel %) / CPI × Organic Multiplier

eCRM Installs = Dormant Pool × Reachable % × Reactivation Rate × Allocation Factor

Effective CPI = Total Spend / Total Installs`}
          </code>
        </div>
      </div>

      {/* Variable Reference */}
      <div className="mt-6">
        <h5 className="text-xs font-semibold text-hay-brown-light mb-3 uppercase tracking-wide">
          Variable Reference
        </h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <VariableItem name="Baseline Monthly" value="1.5M installs" />
          <VariableItem name="ARPDAU" value={`${symbol}0.35`} />
          <VariableItem name="Average Days" value="180 days" />
          <VariableItem name="Dormant Pool" value="~51M (15% of 341M)" />
          <VariableItem name="Spike Multiplier" value="2.0x - 3.0x (by strategy)" />
          <VariableItem name="Quality Bonus" value="+5% D30 (birthday)" />
        </div>
      </div>
    </div>
  );
}

function VariableItem({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-hay-cream-dark">
      <span className="text-hay-brown-light">{name}</span>
      <span className="text-hay-brown font-medium">{value}</span>
    </div>
  );
}
