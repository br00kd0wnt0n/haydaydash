import {
  Strategy,
  ChannelAllocation,
  RegionalSplit,
  IndustryBenchmarks,
  RalphAssumptions,
  SupercellData,
  SocialChannelData,
  DashboardState
} from '../types';

// Strategy definitions
export const strategies: Record<string, Strategy> = {
  welcome_back: {
    id: 'welcome_back',
    name: 'Welcome Back to the Farm',
    emoji: '🌾',
    description: 'Re-engage players who loved Hay Day but drifted away',
    channelDefaults: {
      paidSocial: 25,
      influencer: 15,
      eCRM: 30,
      organic: 10,
      pr: 10,
      store: 7,
      giveBack: 3,
    },
    assumptions: {
      reactivationRatio: 0.70,
      d30Retention: 0.28,
      organicMultiplier: 1.2,
      campaignSpike: 2.0,
    },
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced Harvest',
    emoji: '⚖️',
    description: 'Grow the community while celebrating existing players',
    channelDefaults: {
      paidSocial: 35,
      influencer: 15,
      eCRM: 15,
      organic: 10,
      pr: 10,
      store: 10,
      giveBack: 5,
    },
    assumptions: {
      reactivationRatio: 0.50,
      d30Retention: 0.20,
      organicMultiplier: 1.3,
      campaignSpike: 2.5,
    },
  },
  new_neighbors: {
    id: 'new_neighbors',
    name: 'New Neighbors',
    emoji: '🌱',
    description: 'Introduce Hay Day to players who\'d love it but haven\'t found it yet',
    channelDefaults: {
      paidSocial: 45,
      influencer: 20,
      eCRM: 8,
      organic: 10,
      pr: 12,
      store: 3,
      giveBack: 2,
    },
    assumptions: {
      reactivationRatio: 0.20,
      d30Retention: 0.15,
      organicMultiplier: 1.5,
      campaignSpike: 3.0,
    },
  },
};

// Default channel allocation (Balanced)
export const defaultChannels: ChannelAllocation = {
  paidSocial: 35,
  influencer: 15,
  eCRM: 15,
  organic: 10,
  pr: 10,
  store: 10,
  giveBack: 5,
};

// Default regional split
export const defaultRegions: RegionalSplit = {
  us: 50,
  germany: 30,
  row: 20,
};

// Industry benchmarks
export const defaultBenchmarks: IndustryBenchmarks = {
  d30RetentionNew: 0.15,
  d30RetentionReactivated: 0.25,
  d60RetentionDecay: 0.60,
  d90RetentionDecay: 0.50,
  eCRMReactivationRate: 0.03,
  pushNotificationCTR: 0.05,
  paidSocialCPI: 2.50,
  organicMultiplier: 1.3,
};

// Ralph methodology assumptions
export const defaultRalphAssumptions: RalphAssumptions = {
  campaignSpikeMultiplier: 2.5,
  retentionQualityBonus: 0.05,
  socialAmplificationFactor: 1.4,
};

// Supercell data (confirmed)
export const supercellData: SupercellData = {
  lifetimeDownloads: 341_000_000,
  monthlyInstalls: 1_500_000, // Mid-range of 1-2M
  monthlyRevenue: 10_000_000,
  arpdau: 0.35, // Mid-range of $0.30-0.40
  appStoreRanking: 15,
};

// Social channel follower data
export const socialChannelData: SocialChannelData = {
  instagram: 5_000_000,
  tiktok: 786_000,
  youtube: 2_820_000,
  twitter: 285_000,
  reddit: 85_000,
  twitch: 22_300,
};

// Default dashboard state
export const defaultDashboardState: DashboardState = {
  strategy: 'balanced',
  budget: 1_500_000,
  channels: defaultChannels,
  regions: defaultRegions,
  timing: 'june_birthday',
  benchmarks: defaultBenchmarks,
  ralphAssumptions: defaultRalphAssumptions,
};

// Channel info for tooltips
export const channelInfo: Record<keyof ChannelAllocation, { name: string; tooltip: string }> = {
  paidSocial: {
    name: 'Paid Social',
    tooltip: 'Meta, TikTok, YouTube paid advertising campaigns',
  },
  influencer: {
    name: 'Influencer/Creator',
    tooltip: 'Creator partnerships, sponsored content, ambassador programs',
  },
  eCRM: {
    name: 'eCRM/Push',
    tooltip: 'Email campaigns and push notifications to dormant players',
  },
  organic: {
    name: 'Organic Social',
    tooltip: 'Non-paid social content, community management',
  },
  pr: {
    name: 'PR',
    tooltip: 'Press releases, media outreach, earned media',
  },
  store: {
    name: 'Supercell Store',
    tooltip: 'In-game promotional placements and store features',
  },
  giveBack: {
    name: 'GiveBack Integration',
    tooltip: 'Charitable partnerships and community initiatives',
  },
};

// Benchmark ranges for UI
export const benchmarkRanges: Record<keyof IndustryBenchmarks, { min: number; max: number; step: number }> = {
  d30RetentionNew: { min: 0.05, max: 0.30, step: 0.01 },
  d30RetentionReactivated: { min: 0.10, max: 0.40, step: 0.01 },
  d60RetentionDecay: { min: 0.40, max: 0.80, step: 0.05 },
  d90RetentionDecay: { min: 0.30, max: 0.70, step: 0.05 },
  eCRMReactivationRate: { min: 0.01, max: 0.08, step: 0.005 },
  pushNotificationCTR: { min: 0.02, max: 0.10, step: 0.01 },
  paidSocialCPI: { min: 1.00, max: 5.00, step: 0.25 },
  organicMultiplier: { min: 1.0, max: 2.0, step: 0.1 },
};

// Scenario strengths and tradeoffs
export const scenarioContent: Record<string, { strengths: string[]; tradeoffs: string[] }> = {
  welcome_back: {
    strengths: [
      'Higher player quality - reactivated users already love Hay Day',
      'Lower effective CPA - eCRM costs less than paid acquisition',
      'Faster time-to-value - no learning curve for returning players',
      'Community reinforcement - validates loyal player investment',
    ],
    tradeoffs: [
      'Finite pool - can only reactivate players who\'ve churned',
      'Smaller top-of-funnel - less brand awareness growth',
      'Diminishing returns - best reactivation targets respond first',
    ],
  },
  balanced: {
    strengths: [
      'Risk mitigation - not over-indexed on any single channel',
      'Predictable outcomes - blended approach smooths variance',
      'Full funnel coverage - acquisition + retention + community',
      'Flexibility - can shift resources based on early performance',
    ],
    tradeoffs: [
      'Jack of all trades - doesn\'t maximize any single KPI',
      'Harder to measure - multiple variables in play',
      'May underperform specialists - if one channel would have 3x\'d',
    ],
  },
  new_neighbors: {
    strengths: [
      'Largest reach - maximizes brand awareness and discovery',
      'Viral potential - new players share their discovery',
      'Long-term growth - expands the total addressable community',
      'Platform algorithm favor - new content gets distribution',
    ],
    tradeoffs: [
      'Lower retention - new players churn at higher rates',
      'Higher CPI - cold acquisition costs more than reactivation',
      'Quality variance - not all new players are good fits',
      'Slower payback - takes longer to see player value materialize',
    ],
  },
};
