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

// Strategy definitions - all strategies include birthday tentpole + evergreen activity
export const strategies: Record<string, Strategy> = {
  welcome_back: {
    id: 'welcome_back',
    name: 'Welcome Back',
    emoji: '🌾',
    description: 'Reunion-led: Birthday celebrates returning players, heavy reactivation focus',
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
      reactivationRatio: 0.70,     // 70% lapsed / 30% new
      d30Retention: 0.125,         // Confirmed reactivated D30: 12.5%
      organicMultiplier: 6.0,      // Confirmed: 5-12x range, conservative for eCRM focus
      campaignSpike: 2.0,
    },
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced Growth',
    emoji: '⚖️',
    description: 'Community-led: Birthday honors all players, balanced acquisition + retention',
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
      reactivationRatio: 0.50,     // 50/50 split
      d30Retention: 0.118,         // Blended: (11.1% + 12.5%) / 2
      organicMultiplier: 8.0,      // Confirmed: 5-12x range, midpoint
      campaignSpike: 2.5,
    },
  },
  new_neighbors: {
    id: 'new_neighbors',
    name: 'New Neighbors',
    emoji: '🌱',
    description: 'Discovery-led: Birthday as "join the party" moment, acquisition focus',
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
      reactivationRatio: 0.20,     // 30% lapsed / 70% new
      d30Retention: 0.111,         // Confirmed new D30: 11.1%
      organicMultiplier: 10.0,     // Confirmed: 5-12x range, higher for virality
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

// Industry benchmarks (confirmed from Steph Dec '25)
export const defaultBenchmarks: IndustryBenchmarks = {
  d30RetentionNew: 0.111,        // Confirmed: 11.1%
  d30RetentionReactivated: 0.125, // Confirmed: 12.5%
  d60RetentionDecay: 0.667,      // Calculated: 7.4%/11.1% = 66.7%
  d90RetentionDecay: 0.703,      // Calculated: 5.2%/7.4% = 70.3%
  eCRMReactivationRate: 0.03,
  pushNotificationCTR: 0.05,
  paidSocialCPI: 2.50,
  organicMultiplier: 8.0,        // Confirmed: organic-to-paid ratio 5-12x, using midpoint
};

// Ralph methodology assumptions
export const defaultRalphAssumptions: RalphAssumptions = {
  campaignSpikeMultiplier: 2.5,
  retentionQualityBonus: 0.05,
  socialAmplificationFactor: 1.4,
};

// Supercell data (confirmed from Steph Dec '25)
export const supercellData: SupercellData = {
  lifetimeDownloads: 341_000_000,
  monthlyInstalls: 1_500_000,
  monthlyRevenue: 21_000_000,   // Calculated: DAU 7M × ARPDAU $0.10 × 30 days
  dau: 7_000_000,               // Confirmed: 7.0M (Dec '25)
  mau: 21_500_000,              // Confirmed: 21.5M (Dec '25)
  arpdau: 0.10,                 // Confirmed: $0.10 (Dec '25)
  appStoreRanking: 15,
};

// Social channel follower data (confirmed Sep '25)
export const socialChannelData: SocialChannelData = {
  facebook: 14_100_000,  // Confirmed: 14.1M
  instagram: 5_000_000,  // Confirmed: 5.0M
  tiktok: 700_000,       // Confirmed: 0.7M
  youtube: 2_700_000,    // Confirmed: 2.7M
  twitter: 300_000,      // Confirmed: 0.3M
  reddit: 85_000,        // Estimated (no data provided)
  twitch: 22_300,        // Estimated (no data provided)
};

// Default dashboard state
export const defaultDashboardState: DashboardState = {
  strategy: 'balanced',
  budget: 1_000_000,
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
      'Birthday as reunion - emotionally resonant for lapsed players',
      'Lower effective CPA - eCRM costs less than paid acquisition',
      'Awards/recognition - perfect fit for celebrating loyal community',
    ],
    tradeoffs: [
      'Finite pool - can only reactivate players who\'ve churned',
      'Smaller top-of-funnel - less brand awareness growth',
      'Diminishing returns - best reactivation targets respond first',
    ],
  },
  balanced: {
    strengths: [
      'Birthday appeals to all - celebration welcomes everyone',
      'Risk mitigation - not over-indexed on any single audience',
      'Full funnel coverage - acquisition + retention + community',
      'Flexibility - can shift resources based on early performance',
    ],
    tradeoffs: [
      'Creative complexity - messaging must resonate with both audiences',
      'Harder to measure - multiple variables in play',
      'May underperform specialists - if one audience would have 3x\'d',
    ],
  },
  new_neighbors: {
    strengths: [
      'Largest reach - maximizes brand awareness and discovery',
      'Birthday as "join the party" - compelling hook for new players',
      'Long-term growth - expands the total addressable community',
      'Strong holiday seasonality - Oct-Dec is peak acquisition period',
    ],
    tradeoffs: [
      'Lower retention - new players churn at higher rates (11.1% D30)',
      'Higher CPI - cold acquisition costs more than reactivation',
      'Birthday relevance - 14-year history less meaningful to newcomers',
    ],
  },
};
