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
    recommendedStrategy: StrategyType;
  };
  budget: number;
  onApplyStrategy: (strategy: StrategyType) => void;
  onClose: () => void;
}

const scenarioColors: Record<StrategyType, string> = {
  welcome_back: '#E8A83A', // Warm amber/gold
  balanced: '#6B9B4D', // Soft green
  new_neighbors: '#4A9B8C', // Fresh teal
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

  // Generate comparison summary based on actual calculation results
  const highestROIName = strategies[comparison.highestROI].name;
  const highestVolumeName = strategies[comparison.highestVolume].name;

  let summaryText: string;

  if (comparison.highestROI === comparison.highestVolume) {
    // One scenario dominates both metrics
    const winnerKey = comparison.highestROI;
    const winner = scenarios.find(s => s.strategy === winnerKey)!;
    const runnerUp = scenarios
      .filter(s => s.strategy !== winnerKey)
      .sort((a, b) => b.campaignROI - a.campaignROI)[0];

    const roiAdvantage = ((winner.campaignROI / runnerUp.campaignROI) - 1) * 100;
    const volumeAdvantage = ((winner.totalIncrementalInstalls / runnerUp.totalIncrementalInstalls) - 1) * 100;

    if (winnerKey === 'new_neighbors') {
      summaryText = `${highestROIName} leads on both ROI (${roiAdvantage.toFixed(0)}% higher) and volume (${volumeAdvantage.toFixed(0)}% more installs) than ${strategies[runnerUp.strategy].name}. This is driven by the higher organic multiplier on paid social campaigns, which generates significant viral/word-of-mouth lift. The trade-off: new players have slightly lower retention (11.1% D30) than reactivated players (12.5% D30), but the volume advantage more than compensates.`;
    } else if (winnerKey === 'welcome_back') {
      summaryText = `${highestROIName} leads on both ROI (${roiAdvantage.toFixed(0)}% higher) and volume (${volumeAdvantage.toFixed(0)}% more installs) than ${strategies[runnerUp.strategy].name}. This leverages the 50M+ dormant player pool from 341M lifetime downloads—players who already love Hay Day and convert at lower cost via eCRM. The birthday "welcome home" message resonates strongly with lapsed players.`;
    } else {
      summaryText = `${highestROIName} leads on both ROI (${roiAdvantage.toFixed(0)}% higher) and volume (${volumeAdvantage.toFixed(0)}% more installs) than ${strategies[runnerUp.strategy].name}. This balanced approach hedges risk across acquisition and reactivation, providing flexibility to shift resources based on early campaign performance.`;
    }
  } else {
    // Different scenarios win different metrics - show trade-off
    const roiWinner = scenarios.find(s => s.strategy === comparison.highestROI)!;
    const volumeWinner = scenarios.find(s => s.strategy === comparison.highestVolume)!;

    const roiDiff = ((roiWinner.campaignROI / volumeWinner.campaignROI) - 1) * 100;
    const volumeDiff = ((volumeWinner.totalIncrementalInstalls / roiWinner.totalIncrementalInstalls) - 1) * 100;

    summaryText = `${highestROIName} yields ${roiDiff.toFixed(0)}% higher ROI, while ${highestVolumeName} delivers ${volumeDiff.toFixed(0)}% more total installs. `;

    if (comparison.highestROI === 'welcome_back') {
      summaryText += `Given Hay Day's mature player base and 341M lifetime downloads, ${highestROIName} prioritizes efficiency by re-engaging lapsed players at lower cost. However, ${highestVolumeName} may be preferred if maximizing reach and brand awareness is the primary goal.`;
    } else if (comparison.highestROI === 'new_neighbors') {
      summaryText += `${highestROIName}'s higher organic multiplier on paid campaigns generates strong viral lift, making new player acquisition more efficient than expected. Consider the trade-off: new players retain slightly worse (11.1% D30) than reactivated players (12.5% D30).`;
    } else {
      summaryText += `Balanced Harvest offers the flexibility to shift resources based on early performance, hedging risk across both acquisition and reactivation.`;
    }
  }

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
          <div className="bg-hay-cream p-6 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScenarioCard
              scenario={welcomeBack}
              color={scenarioColors.welcome_back}
              onApply={() => onApplyStrategy('welcome_back')}
              isRecommended={comparison.recommendedStrategy === 'welcome_back'}
            />
            <ScenarioCard
              scenario={balanced}
              color={scenarioColors.balanced}
              onApply={() => onApplyStrategy('balanced')}
              isRecommended={comparison.recommendedStrategy === 'balanced'}
            />
            <ScenarioCard
              scenario={newNeighbors}
              color={scenarioColors.new_neighbors}
              onApply={() => onApplyStrategy('new_neighbors')}
              isRecommended={comparison.recommendedStrategy === 'new_neighbors'}
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
