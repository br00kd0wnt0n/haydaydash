import { useState, useCallback, useRef, useEffect } from 'react';
import { DashboardState, AIAssessment } from '../types';
import { calculatePlayerValue } from '../utils/calculations';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function useAIAssessment(state: DashboardState) {
  const [assessment, setAssessment] = useState<AIAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialFetch = useRef(false);
  const stateRef = useRef(state);

  // Keep state ref updated for manual refresh
  stateRef.current = state;

  const fetchAssessment = useCallback(async (currentState: DashboardState) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/ai/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentState),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI assessment');
      }

      const data = await response.json();
      setAssessment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Provide fallback assessment
      setAssessment(generateFallbackAssessment(currentState));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Only fetch on initial page load
  useEffect(() => {
    if (!hasInitialFetch.current) {
      hasInitialFetch.current = true;
      fetchAssessment(state);
    }
  }, [fetchAssessment, state]);

  // Manual refresh uses current state
  const refresh = useCallback(() => {
    fetchAssessment(stateRef.current);
  }, [fetchAssessment]);

  return {
    assessment,
    isLoading,
    error,
    refresh,
  };
}

function generateFallbackAssessment(state: DashboardState): AIAssessment {
  const { strategy, budget, channels, timing } = state;

  // Calculate actual ROI from the model
  const playerValue = calculatePlayerValue(state);
  const actualROI = playerValue.campaignROI;

  const recommendations: string[] = [];
  const suggestedChanges: Partial<DashboardState> = {};

  // Generate contextual recommendations based on strategy
  if (strategy === 'welcome_back') {
    if (channels.eCRM < 25) {
      recommendations.push(
        `Your current eCRM allocation of ${channels.eCRM}% could be increased to 25-30%. Lapsed Hay Day players convert at approximately 3x the rate of cold acquisition, and your dormant player pool (estimated 50M+ from lifetime downloads) represents significant untapped value.`
      );
    }
    // Note: Welcome Back has lower ROI than New Neighbors due to lower organic multiplier
    recommendations.push(
      `Note: While Welcome Back prioritizes player quality and retention (12.5% D30 for reactivated vs 11.1% for new), the New Neighbors strategy may produce higher ROI due to stronger organic multiplier effects on paid social. Consider your primary objective: efficiency vs. volume.`
    );
  }

  if (strategy === 'new_neighbors') {
    if (channels.paidSocial < 40) {
      recommendations.push(
        `For a new player acquisition focus, consider increasing paid social allocation to 40-45%. This maximizes reach to players who haven't discovered Hay Day yet.`
      );
    }
    recommendations.push(
      `New Neighbors benefits from a higher organic multiplier (10x vs 6x for Welcome Back), generating significant viral lift on paid campaigns. This drives both higher volume and higher ROI, though new player retention is slightly lower (11.1% D30).`
    );
  }

  if (strategy === 'balanced') {
    recommendations.push(
      `Balanced Harvest hedges risk across acquisition and reactivation. This approach offers flexibility to shift resources based on early campaign performance, but may underperform a more focused strategy if one audience segment dramatically outperforms.`
    );
  }

  if (budget < 1_000_000 && timing === 'june_birthday') {
    recommendations.push(
      `Your ${formatBudget(budget)} budget may limit campaign spike impact for a birthday tentpole. Consider whether a larger investment would generate proportionally higher returns.`
    );
  }

  if (channels.giveBack > 10) {
    recommendations.push(
      `GiveBack integration at ${channels.giveBack}% is higher than typical. While community-positive, ensure charitable partnerships align with Hay Day's cozy brand tone.`
    );
  }

  const summaryParts = [
    `Based on your ${formatBudget(budget)} budget`,
    `with ${strategy.replace('_', ' ')} focus`,
  ];

  if (timing === 'june_birthday') {
    summaryParts.push(`targeting the June 2026 birthday campaign`);
  }

  return {
    summary: `${summaryParts.join(' ')}, this configuration projects a ${actualROI.toFixed(1)}x ROI. ${recommendations[0]}`,
    recommendations,
    suggestedChanges,
  };
}

function formatBudget(value: number): string {
  if (value >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(1)}M`;
  }
  return `€${(value / 1_000).toFixed(0)}K`;
}
