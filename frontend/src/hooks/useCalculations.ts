import { useMemo } from 'react';
import { DashboardState, ChannelResult, ProjectionMonth, PlayerValueCalculation, SocialGrowthForecast, ScenarioResult } from '../types';
import {
  calculateChannelResults,
  calculateMonthlyProjections,
  calculatePlayerValue,
  calculateSocialGrowth,
  calculateScenario,
} from '../utils/calculations';

export function useCalculations(state: DashboardState) {
  const channelResults = useMemo<ChannelResult[]>(
    () => calculateChannelResults(state),
    [state]
  );

  const monthlyProjections = useMemo<ProjectionMonth[]>(
    () => calculateMonthlyProjections(state),
    [state]
  );

  const playerValue = useMemo<PlayerValueCalculation>(
    () => calculatePlayerValue(state),
    [state]
  );

  const socialGrowth = useMemo<SocialGrowthForecast[]>(
    () => calculateSocialGrowth(state),
    [state]
  );

  return {
    channelResults,
    monthlyProjections,
    playerValue,
    socialGrowth,
  };
}

export function useScenarioComparison(
  budget: number,
  benchmarks: DashboardState['benchmarks'],
  ralphAssumptions: DashboardState['ralphAssumptions']
) {
  const scenarios = useMemo<ScenarioResult[]>(() => {
    return [
      calculateScenario('welcome_back', budget, benchmarks, ralphAssumptions),
      calculateScenario('balanced', budget, benchmarks, ralphAssumptions),
      calculateScenario('new_neighbors', budget, benchmarks, ralphAssumptions),
    ];
  }, [budget, benchmarks, ralphAssumptions]);

  const comparison = useMemo(() => {
    const [welcomeBack, balanced, newNeighbors] = scenarios;

    const highestROI = scenarios.reduce((max, s) => s.campaignROI > max.campaignROI ? s : max);
    const highestVolume = scenarios.reduce((max, s) => s.totalIncrementalInstalls > max.totalIncrementalInstalls ? s : max);

    const roiDiff = ((highestROI.campaignROI / balanced.campaignROI) - 1) * 100;
    const volumeDiff = ((highestVolume.totalIncrementalInstalls / welcomeBack.totalIncrementalInstalls) - 1) * 100;

    return {
      highestROI: highestROI.strategy,
      highestVolume: highestVolume.strategy,
      roiDifference: roiDiff,
      volumeDifference: volumeDiff,
    };
  }, [scenarios]);

  return { scenarios, comparison };
}
