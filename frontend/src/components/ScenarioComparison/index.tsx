import React from 'react';
import { ScenarioResult, StrategyType } from '../../types';
import { ScenarioCard } from './ScenarioCard';
import { strategies } from '../../data/defaults';
import { useFormatting } from '../../hooks/useFormatting';
import { X } from 'lucide-react';

interface ScenarioComparisonProps {
  scenarios: ScenarioResult[];
  comparison: {
    highestROI: StrategyType;
    highestVolume: StrategyType;
    roiDifference: number;
    volumeDifference: number;
  };
  budget: number;
  onApplyStrategy: (strategy: StrategyType) => void;
  onClose: () => void;
}

const scenarioColors: Record<StrategyType, string> = {
  welcome_back: '#E8A83A', // Warm amber/gold
  balanced: '#6B9B4D', // Soft green
  new_neighbors: '#4A9B8C', // Fresh teal
  digital_first: '#7C5BBF', // Creator purple
};

export function ScenarioComparison({
  scenarios,
  comparison,
  budget,
  onApplyStrategy,
  onClose,
}: ScenarioComparisonProps) {
  const { formatCurrency } = useFormatting();
  // Find scenario results
  const welcomeBack = scenarios.find(s => s.strategy === 'welcome_back')!;
  const balanced = scenarios.find(s => s.strategy === 'balanced')!;
  const newNeighbors = scenarios.find(s => s.strategy === 'new_neighbors')!;
  const digitalFirst = scenarios.find(s => s.strategy === 'digital_first')!;

  // Generate comparison summary
  const highestROIName = strategies[comparison.highestROI].name;
  const highestVolumeName = strategies[comparison.highestVolume].name;

  const summaryText = `${highestROIName} yields ${Math.abs(comparison.roiDifference).toFixed(0)}% higher ROI but ${Math.abs(comparison.volumeDifference).toFixed(0)}% fewer total installs than ${highestVolumeName}. Balanced Harvest sits between, optimizing for predictable year-round growth. Given Hay Day's mature player base and 341M lifetime downloads, ${highestROIName} aligns best with the brief's emphasis on "re-engaging lapsed players first, while attracting new ones naturally."`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-xl px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-hay-brown font-display">
                Scenario Comparison: 2026 Outlook
              </h2>
              <p className="text-hay-brown-light mt-1">
                Three paths to growth - same June tentpole • Budget: {formatCurrency(budget)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-hay-cream rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-hay-brown-light" />
            </button>
          </div>

          {/* Scenario Cards */}
          <div className="bg-hay-cream p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <ScenarioCard
              scenario={welcomeBack}
              color={scenarioColors.welcome_back}
              onApply={() => onApplyStrategy('welcome_back')}
            />
            <ScenarioCard
              scenario={balanced}
              color={scenarioColors.balanced}
              onApply={() => onApplyStrategy('balanced')}
            />
            <ScenarioCard
              scenario={newNeighbors}
              color={scenarioColors.new_neighbors}
              onApply={() => onApplyStrategy('new_neighbors')}
            />
            <ScenarioCard
              scenario={digitalFirst}
              color={scenarioColors.digital_first}
              onApply={() => onApplyStrategy('digital_first')}
            />
          </div>

          {/* Comparison Summary */}
          <div className="bg-white rounded-b-xl px-6 py-5 border-t border-hay-cream-dark">
            <h3 className="text-sm font-semibold text-hay-brown mb-3 uppercase tracking-wide">
              Comparison Summary
            </h3>
            <p className="text-hay-brown-light leading-relaxed">
              "{summaryText}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
