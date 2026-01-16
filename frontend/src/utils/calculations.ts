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

  // Confirmed seasonality: Holiday (Oct-Dec) is BEST, Summer (Jun-Aug) is WORST
  const seasonalityMultipliers: Record<string, number> = {
    Jan: 1.00,   // Post-holiday normalization
    Feb: 0.95,   // Slow month
    Mar: 0.95,   // Pre-spring
    Apr: 0.90,   // Spring - lower engagement
    May: 0.85,   // Late spring
    Jun: 0.80,   // Summer starts - WORST (but birthday campaign can spike)
    Jul: 0.80,   // Summer - WORST
    Aug: 0.85,   // Late summer - recovering
    Sep: 0.95,   // Back to school
    Oct: 1.15,   // Halloween - BEST period starts
    Nov: 1.20,   // Pre-holiday - BEST
    Dec: 1.25,   // Holiday season - BEST
  };

  const projections: ProjectionMonth[] = [];

  months.forEach((month) => {
    const seasonality = seasonalityMultipliers[month];
    const seasonalBaseline = Math.round(baseline * seasonality);

    let projected = seasonalBaseline;
    let optimistic = Math.round(seasonalBaseline * 1.1);
    let conservative = Math.round(seasonalBaseline * 0.9);

    if (state.timing === 'june_birthday') {
      if (month === 'Jun') {
        // Birthday campaign spike overrides poor summer seasonality
        const spike = strategyAssumptions.campaignSpike;
        projected = Math.round(baseline * spike); // Use full baseline, not seasonal
        optimistic = Math.round(baseline * (spike * 1.2));
        conservative = Math.round(baseline * (spike * 0.8));
      } else if (month === 'Jul') {
        // Decay month 1 - still elevated from campaign
        const decay = 0.6;
        const spike = strategyAssumptions.campaignSpike;
        projected = Math.round(baseline * (1 + (spike - 1) * decay) * 0.9); // Summer penalty
        optimistic = Math.round(baseline * (1 + (spike * 1.2 - 1) * decay));
        conservative = Math.round(baseline * (1 + (spike * 0.8 - 1) * decay) * 0.85);
      } else if (month === 'Aug') {
        // Decay month 2
        const decay = 0.3;
        const spike = strategyAssumptions.campaignSpike;
        projected = Math.round(baseline * (1 + (spike - 1) * decay) * 0.9);
        optimistic = Math.round(baseline * (1 + (spike * 1.2 - 1) * decay));
        conservative = Math.round(baseline * (1 + (spike * 0.8 - 1) * decay) * 0.85);
      }
      // Other months use seasonal baseline calculated above
    }

    projections.push({
      month,
      baseline: seasonalBaseline,
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
  // Annual growth rates calculated from confirmed historical data (Mar '24 - Sep '25)
  const growthRates: Record<string, number> = {
    facebook: 0.01,   // Confirmed: 13.9M→14.1M = ~1% annual (mature platform)
    instagram: 0.04,  // Confirmed: 4.7M→5.0M = ~4% annual
    tiktok: 0.50,     // Confirmed: 0.4M→0.7M = ~50% annual (high growth)
    youtube: 0.23,    // Confirmed: 2.0M→2.7M = ~23% annual
    twitter: 0.00,    // Confirmed: flat at 0.3M
    reddit: 0.10,     // Estimated
    twitch: 0.06,     // Estimated
  };

  // Strategy multipliers - different strategies have different social impact
  const strategyMultipliers: Record<StrategyType, number> = {
    welcome_back: 0.9,  // Focused on reactivation, less social buzz
    balanced: 1.0,      // Baseline
    new_neighbors: 1.2, // Heavy social focus for new player acquisition
    digital_first: 1.4, // Creator-led content drives highest social engagement
  };

  // Calculate budget impact from social-relevant channels
  // Influencer and Organic channels drive social growth
  const socialChannelSpend = (state.channels.influencer + state.channels.organic) / 100;
  const budgetFactor = 1 + (socialChannelSpend * 0.5); // Up to 1.5x if 100% in social channels

  // Budget scale factor - higher budgets = more reach
  const budgetScale = Math.sqrt(state.budget / 1_000_000); // Diminishing returns on budget

  // Apply campaign timing multiplier
  const campaignMultiplier = state.timing === 'june_birthday'
    ? state.ralphAssumptions.socialAmplificationFactor
    : 1.0;

  // Combined multiplier
  const strategyFactor = strategyMultipliers[state.strategy];
  const totalMultiplier = campaignMultiplier * strategyFactor * budgetFactor * budgetScale;

  return Object.entries(socialChannelData).map(([platform, current]) => {
    const baseGrowth = growthRates[platform] || 0.05;
    const growthPercent = baseGrowth * totalMultiplier;
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
