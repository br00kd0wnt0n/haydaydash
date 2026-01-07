import {
  DashboardState,
  ChannelResult,
  ProjectionMonth,
  PlayerValueCalculation,
  SocialGrowthForecast,
  ScenarioResult,
  StrategyType,
} from '../types';
import { supercellData, socialChannelData, strategies, scenarioContent } from '../data/defaults';

// Channel CPI estimates (cost per install or equivalent action)
const channelCPIs: Record<string, number> = {
  paidSocial: 2.50,
  influencer: 4.00, // Higher CPI but better quality
  eCRM: 0.50, // Very efficient for reactivation
  organic: 0.00, // No direct cost
  pr: 3.00, // Estimated cost per install from PR
  store: 1.00, // Internal cost estimate
  giveBack: 2.00, // Partnership cost per install
};

// Channel quality scores (1-5)
const channelQuality: Record<string, number> = {
  paidSocial: 3,
  influencer: 4,
  eCRM: 5, // Highest - reactivated players
  organic: 4,
  pr: 3,
  store: 4,
  giveBack: 3,
};

export function calculateChannelResults(state: DashboardState): ChannelResult[] {
  const results: ChannelResult[] = [];
  const strategyAssumptions = strategies[state.strategy].assumptions;

  Object.entries(state.channels).forEach(([channel, allocation]) => {
    const spend = state.budget * (allocation / 100);
    const baseCPI = channelCPIs[channel] || 2.50;

    // Adjust CPI based on strategy and timing
    let adjustedCPI = baseCPI;
    if (state.timing === 'june_birthday') {
      adjustedCPI *= 0.9; // 10% more efficient during campaign
    }

    // Calculate installs
    let installs = 0;
    if (channel === 'organic') {
      // Organic doesn't have direct spend-to-install
      installs = Math.round(
        state.budget * (state.channels.paidSocial / 100) / channelCPIs.paidSocial *
        (strategyAssumptions.organicMultiplier - 1) * (allocation / 10)
      );
    } else if (channel === 'eCRM') {
      // eCRM effectiveness based on dormant pool
      const dormantPool = supercellData.lifetimeDownloads * 0.15; // Assume 15% are reachable
      installs = Math.round(
        dormantPool * state.benchmarks.eCRMReactivationRate * (allocation / 15)
      );
    } else if (adjustedCPI > 0) {
      installs = Math.round(spend / adjustedCPI);
    }

    // Apply organic multiplier for paid channels
    if (channel === 'paidSocial' || channel === 'influencer') {
      installs = Math.round(installs * strategyAssumptions.organicMultiplier);
    }

    const effectiveCPI = installs > 0 ? spend / installs : 0;

    results.push({
      name: channel,
      spend,
      installs,
      cpi: effectiveCPI,
      qualityScore: channelQuality[channel] || 3,
    });
  });

  return results;
}

export function calculateMonthlyProjections(state: DashboardState): ProjectionMonth[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseline = supercellData.monthlyInstalls;
  const strategyAssumptions = strategies[state.strategy].assumptions;

  const projections: ProjectionMonth[] = [];

  months.forEach((month, index) => {
    let projected = baseline;
    let optimistic = baseline;
    let conservative = baseline;

    if (state.timing === 'june_birthday') {
      if (month === 'Jun') {
        // Peak spike month - Birthday campaign
        const spike = strategyAssumptions.campaignSpike;
        projected = Math.round(baseline * spike);
        optimistic = Math.round(baseline * (spike * 1.2));
        conservative = Math.round(baseline * (spike * 0.8));
      } else if (month === 'Jul') {
        // Decay month 1
        const decay = 0.6;
        const spike = strategyAssumptions.campaignSpike;
        projected = Math.round(baseline * (1 + (spike - 1) * decay));
        optimistic = Math.round(baseline * (1 + (spike * 1.2 - 1) * decay));
        conservative = Math.round(baseline * (1 + (spike * 0.8 - 1) * decay));
      } else if (month === 'Aug') {
        // Decay month 2
        const decay = 0.3;
        const spike = strategyAssumptions.campaignSpike;
        projected = Math.round(baseline * (1 + (spike - 1) * decay));
        optimistic = Math.round(baseline * (1 + (spike * 1.2 - 1) * decay));
        conservative = Math.round(baseline * (1 + (spike * 0.8 - 1) * decay));
      } else if (month === 'Sep') {
        // Return to slightly elevated baseline
        projected = Math.round(baseline * 1.1);
        optimistic = Math.round(baseline * 1.15);
        conservative = Math.round(baseline * 1.05);
      } else if (month === 'Oct') {
        // Halloween mini-bump
        projected = Math.round(baseline * 1.15);
        optimistic = Math.round(baseline * 1.2);
        conservative = Math.round(baseline * 1.1);
      } else if (month === 'Dec') {
        // Holiday season bump
        projected = Math.round(baseline * 1.2);
        optimistic = Math.round(baseline * 1.3);
        conservative = Math.round(baseline * 1.1);
      } else {
        // Normal months
        projected = baseline;
        optimistic = Math.round(baseline * 1.05);
        conservative = Math.round(baseline * 0.95);
      }
    } else {
      // Steady state - consistent across months
      projected = baseline;
      optimistic = Math.round(baseline * 1.1);
      conservative = Math.round(baseline * 0.9);
    }

    projections.push({
      month,
      baseline,
      projected,
      optimistic,
      conservative,
    });
  });

  return projections;
}

export function calculatePlayerValue(state: DashboardState): PlayerValueCalculation {
  const channelResults = calculateChannelResults(state);
  const strategyAssumptions = strategies[state.strategy].assumptions;

  // Total incremental installs
  const totalInstalls = channelResults.reduce((sum, ch) => sum + ch.installs, 0);

  // Split between new and reactivated
  const reactivatedPlayers = Math.round(totalInstalls * strategyAssumptions.reactivationRatio);
  const newPlayers = totalInstalls - reactivatedPlayers;

  // Calculate blended retention
  const newRetention = state.benchmarks.d30RetentionNew * state.benchmarks.d60RetentionDecay * state.benchmarks.d90RetentionDecay;
  const reactivatedRetention = state.benchmarks.d30RetentionReactivated * state.benchmarks.d60RetentionDecay * state.benchmarks.d90RetentionDecay;

  const blendedRetention = (
    (newPlayers * newRetention) + (reactivatedPlayers * reactivatedRetention)
  ) / totalInstalls;

  // Birthday quality bonus
  const retentionWithBonus = state.timing === 'june_birthday'
    ? blendedRetention + state.ralphAssumptions.retentionQualityBonus
    : blendedRetention;

  const retainedAtD90 = Math.round(totalInstalls * retentionWithBonus);

  // Player value calculation
  const avgDaysRetained = 180; // Average days over 12 months
  const playerValue = retainedAtD90 * supercellData.arpdau * avgDaysRetained;

  // ROI
  const roi = playerValue / state.budget;

  return {
    incrementalInstalls: totalInstalls,
    newPlayers,
    reactivatedPlayers,
    retainedAtD90,
    retentionRate: retentionWithBonus,
    playerValue,
    arpdau: supercellData.arpdau,
    avgDaysRetained,
    campaignROI: roi,
    valueGenerated: playerValue,
    campaignInvestment: state.budget,
  };
}

export function calculateSocialGrowth(state: DashboardState): SocialGrowthForecast[] {
  const growthRates: Record<string, number> = {
    instagram: 0.08,
    tiktok: 0.15,
    youtube: 0.05,
    twitter: 0.03,
    reddit: 0.10,
    twitch: 0.06,
  };

  // Apply campaign multiplier
  const campaignMultiplier = state.timing === 'june_birthday'
    ? state.ralphAssumptions.socialAmplificationFactor
    : 1.0;

  return Object.entries(socialChannelData).map(([platform, current]) => {
    const baseGrowth = growthRates[platform] || 0.05;
    const growthPercent = baseGrowth * campaignMultiplier;
    const projected = Math.round(current * (1 + growthPercent));

    return {
      platform,
      current,
      projected,
      growthPercent: growthPercent * 100,
    };
  });
}

export function calculateScenario(
  strategyType: StrategyType,
  budget: number,
  benchmarks: DashboardState['benchmarks'],
  ralphAssumptions: DashboardState['ralphAssumptions']
): ScenarioResult {
  const strategy = strategies[strategyType];

  const state: DashboardState = {
    strategy: strategyType,
    budget,
    channels: strategy.channelDefaults,
    regions: { us: 50, germany: 30, row: 20 },
    timing: 'june_birthday',
    benchmarks,
    ralphAssumptions,
  };

  const playerValue = calculatePlayerValue(state);
  const monthlyProjections = calculateMonthlyProjections(state);
  const channelResults = calculateChannelResults(state);

  const totalSpend = channelResults.reduce((sum, ch) => sum + ch.spend, 0);
  const totalInstalls = channelResults.reduce((sum, ch) => sum + ch.installs, 0);
  const avgCPI = totalSpend / totalInstalls;

  // Quality score based on retention
  const qualityScore = Math.min(5, Math.round(playerValue.retentionRate * 20 + 1));

  return {
    strategy: strategyType,
    totalIncrementalInstalls: playerValue.incrementalInstalls,
    retainedAtD90: playerValue.retainedAtD90,
    retentionPercent: playerValue.retentionRate * 100,
    campaignROI: playerValue.campaignROI,
    avgCPI,
    qualityScore,
    monthlyProjections,
    strengths: scenarioContent[strategyType].strengths,
    tradeoffs: scenarioContent[strategyType].tradeoffs,
  };
}

export function formatCurrency(value: number, currency: string = '€'): string {
  if (value >= 1_000_000) {
    return `${currency}${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${currency}${(value / 1_000).toFixed(0)}K`;
  }
  return `${currency}${value.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toLocaleString();
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
