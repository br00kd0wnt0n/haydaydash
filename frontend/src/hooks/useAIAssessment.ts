import { useState, useCallback, useRef, useEffect } from 'react';
import { DashboardState, AIAssessment } from '../types';

const DEBOUNCE_MS = 2000;
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function useAIAssessment(state: DashboardState) {
  const [assessment, setAssessment] = useState<AIAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const lastStateRef = useRef<string>('');

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

  useEffect(() => {
    const stateString = JSON.stringify(state);

    // Skip if state hasn't changed
    if (stateString === lastStateRef.current) {
      return;
    }

    lastStateRef.current = stateString;

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the API call
    debounceRef.current = setTimeout(() => {
      fetchAssessment(state);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [state, fetchAssessment]);

  const refresh = useCallback(() => {
    fetchAssessment(state);
  }, [state, fetchAssessment]);

  return {
    assessment,
    isLoading,
    error,
    refresh,
  };
}

function generateFallbackAssessment(state: DashboardState): AIAssessment {
  const { strategy, budget, channels, timing } = state;

  const recommendations: string[] = [];
  const suggestedChanges: Partial<DashboardState> = {};

  // Generate contextual recommendations
  if (strategy === 'welcome_back' && channels.eCRM < 25) {
    recommendations.push(
      `Your current eCRM allocation of ${channels.eCRM}% could be increased to 25-30%. Lapsed Hay Day players convert at approximately 3x the rate of cold acquisition, and your dormant player pool (estimated 50M+ from lifetime downloads) represents significant untapped value.`
    );
  }

  if (strategy === 'new_neighbors' && channels.paidSocial < 40) {
    recommendations.push(
      `For a new player acquisition focus, consider increasing paid social allocation to 40-45%. This maximizes reach to players who haven't discovered Hay Day yet.`
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

  if (recommendations.length === 0) {
    recommendations.push(
      `Your current configuration is well-balanced for a ${strategy.replace('_', ' ')} approach. Consider A/B testing channel allocations to optimize further.`
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
    summary: `${summaryParts.join(' ')}, this configuration projects a ${(strategy === 'welcome_back' ? '3.2x' : strategy === 'balanced' ? '3.1x' : '2.8x')} ROI. ${recommendations[0]}`,
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
