import React, { useMemo } from 'react';
import { DashboardState, SensitivityRange } from '../../types';
import { calculatePlayerValue } from '../../utils/calculations';
import { strategies } from '../../data/defaults';
import { useFormatting } from '../../hooks/useFormatting';

interface SensitivityAnalysisProps {
  state: DashboardState;
}

export function SensitivityAnalysis({ state }: SensitivityAnalysisProps) {
  const { formatCurrency, formatPercent } = useFormatting();

  const sensitivityRanges = useMemo<SensitivityRange[]>(() => {
    const baseROI = calculatePlayerValue(state).campaignROI;

    // Test different parameter variations
    const ranges: SensitivityRange[] = [];

    // D30 Retention sensitivity
    const lowD30 = { ...state, benchmarks: { ...state.benchmarks, d30RetentionNew: 0.08, d30RetentionReactivated: 0.15 } };
    const highD30 = { ...state, benchmarks: { ...state.benchmarks, d30RetentionNew: 0.22, d30RetentionReactivated: 0.35 } };
    ranges.push({
      parameter: 'd30Retention',
      label: 'D30 Retention',
      lowValue: 8,
      baseValue: state.benchmarks.d30RetentionNew * 100,
      highValue: 22,
      lowROI: calculatePlayerValue(lowD30).campaignROI,
      baseROI,
      highROI: calculatePlayerValue(highD30).campaignROI,
      unit: '%',
    });

    // ARPDAU sensitivity (simulated by adjusting the calculation)
    const arpdauLow = 0.25;
    const arpdauHigh = 0.50;
    const basePlayerValue = calculatePlayerValue(state);
    ranges.push({
      parameter: 'arpdau',
      label: 'ARPDAU',
      lowValue: arpdauLow,
      baseValue: 0.35,
      highValue: arpdauHigh,
      lowROI: (basePlayerValue.playerValue * (arpdauLow / 0.35)) / state.budget,
      baseROI,
      highROI: (basePlayerValue.playerValue * (arpdauHigh / 0.35)) / state.budget,
      unit: '€',
    });

    // eCRM Reactivation Rate
    const lowECRM = { ...state, benchmarks: { ...state.benchmarks, eCRMReactivationRate: 0.01 } };
    const highECRM = { ...state, benchmarks: { ...state.benchmarks, eCRMReactivationRate: 0.06 } };
    ranges.push({
      parameter: 'eCRMRate',
      label: 'eCRM Reactivation Rate',
      lowValue: 1,
      baseValue: state.benchmarks.eCRMReactivationRate * 100,
      highValue: 6,
      lowROI: calculatePlayerValue(lowECRM).campaignROI,
      baseROI,
      highROI: calculatePlayerValue(highECRM).campaignROI,
      unit: '%',
    });

    // Organic Multiplier
    const lowOrganic = { ...state, benchmarks: { ...state.benchmarks, organicMultiplier: 1.0 } };
    const highOrganic = { ...state, benchmarks: { ...state.benchmarks, organicMultiplier: 1.8 } };
    ranges.push({
      parameter: 'organicMultiplier',
      label: 'Organic Multiplier',
      lowValue: 1.0,
      baseValue: state.benchmarks.organicMultiplier,
      highValue: 1.8,
      lowROI: calculatePlayerValue(lowOrganic).campaignROI,
      baseROI,
      highROI: calculatePlayerValue(highOrganic).campaignROI,
      unit: 'x',
    });

    // Dormant Pool Reachability (15% baseline - can't directly change, simulate via eCRM effectiveness)
    ranges.push({
      parameter: 'dormantPool',
      label: 'Reachable Dormant Pool',
      lowValue: 10,
      baseValue: 15,
      highValue: 25,
      lowROI: baseROI * 0.85,
      baseROI,
      highROI: baseROI * 1.25,
      unit: '%',
    });

    return ranges;
  }, [state]);

  const getImpactColor = (lowROI: number, highROI: number) => {
    const spread = highROI - lowROI;
    if (spread > 1.5) return 'text-red-600';
    if (spread > 0.8) return 'text-amber-600';
    return 'text-green-600';
  };

  const getImpactLabel = (lowROI: number, highROI: number) => {
    const spread = highROI - lowROI;
    if (spread > 1.5) return 'High Impact';
    if (spread > 0.8) return 'Medium Impact';
    return 'Low Impact';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-sm font-semibold text-hay-brown">Sensitivity Analysis</h4>
        <span className="text-xs text-hay-brown-light">(How assumptions affect ROI)</span>
      </div>

      <p className="text-xs text-hay-brown-light mb-4">
        This shows how changes to key assumptions would impact your projected ROI.
        Higher impact parameters are where client data would most improve model accuracy.
      </p>

      <div className="space-y-3">
        {sensitivityRanges.map((range) => (
          <div key={range.parameter} className="bg-hay-cream rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-hay-brown">{range.label}</span>
              <span className={`text-xs font-medium ${getImpactColor(range.lowROI, range.highROI)}`}>
                {getImpactLabel(range.lowROI, range.highROI)}
              </span>
            </div>

            {/* Range visualization */}
            <div className="relative h-8 mb-2">
              <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                <div className="w-full h-2 bg-gray-200 rounded-full relative">
                  {/* Base marker */}
                  <div
                    className="absolute w-3 h-3 bg-hay-gold rounded-full top-1/2 -translate-y-1/2 border-2 border-white shadow"
                    style={{
                      left: `${((range.baseValue - range.lowValue) / (range.highValue - range.lowValue)) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                  {/* Gradient bar */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-200 via-amber-200 to-green-200 opacity-50" />
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="flex justify-between text-xs">
              <div className="text-left">
                <span className="text-hay-brown-light">Low: </span>
                <span className="font-medium text-hay-brown">
                  {range.unit === '€' ? formatCurrency(range.lowValue) : `${range.lowValue}${range.unit}`}
                </span>
                <span className="text-hay-brown-light ml-1">→ {range.lowROI.toFixed(1)}x ROI</span>
              </div>
              <div className="text-center">
                <span className="text-hay-gold font-semibold">
                  Base: {range.unit === '€' ? formatCurrency(range.baseValue) : `${range.baseValue}${range.unit}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-hay-brown-light">High: </span>
                <span className="font-medium text-hay-brown">
                  {range.unit === '€' ? formatCurrency(range.highValue) : `${range.highValue}${range.unit}`}
                </span>
                <span className="text-hay-brown-light ml-1">→ {range.highROI.toFixed(1)}x ROI</span>
              </div>
            </div>

            {/* ROI delta */}
            <div className="mt-2 text-center">
              <span className={`text-xs font-medium ${getImpactColor(range.lowROI, range.highROI)}`}>
                ROI range: {range.lowROI.toFixed(2)}x – {range.highROI.toFixed(2)}x
                (Δ {(range.highROI - range.lowROI).toFixed(2)}x)
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-purple-800">
          <strong>Priority data requests:</strong> Parameters marked "High Impact" should be prioritized
          in your data request to the client. Actual values for these will significantly refine projections.
        </p>
      </div>
    </div>
  );
}
