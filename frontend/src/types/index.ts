// Strategy types
export type StrategyType = 'welcome_back' | 'balanced' | 'new_neighbors';

export interface Strategy {
  id: StrategyType;
  name: string;
  emoji: string;
  description: string;
  channelDefaults: ChannelAllocation;
  assumptions: StrategyAssumptions;
}

export interface StrategyAssumptions {
  reactivationRatio: number; // % of incremental that are reactivations
  d30Retention: number;
  organicMultiplier: number;
  campaignSpike: number;
}

// Channel allocation
export interface ChannelAllocation {
  paidSocial: number;
  influencer: number;
  eCRM: number;
  organic: number;
  pr: number;
  store: number;
  giveBack: number;
}

// Regional split
export interface RegionalSplit {
  us: number;
  germany: number;
  row: number;
}

// Campaign timing
export type CampaignTiming = 'june_birthday' | 'steady_state';

// Industry benchmarks (editable)
export interface IndustryBenchmarks {
  d30RetentionNew: number;
  d30RetentionReactivated: number;
  d60RetentionDecay: number;
  d90RetentionDecay: number;
  eCRMReactivationRate: number;
  pushNotificationCTR: number;
  paidSocialCPI: number;
  organicMultiplier: number;
}

// Ralph methodology assumptions
export interface RalphAssumptions {
  campaignSpikeMultiplier: number;
  retentionQualityBonus: number;
  socialAmplificationFactor: number;
}

// Social channel data
export interface SocialChannelData {
  facebook: number;
  instagram: number;
  tiktok: number;
  youtube: number;
  twitter: number;
  reddit: number;
  twitch: number;
}

// Supercell data
export interface SupercellData {
  lifetimeDownloads: number;
  monthlyInstalls: number;
  monthlyRevenue: number;
  dau: number;
  mau: number;
  arpdau: number;
  appStoreRanking: number;
}

// Dashboard state
export interface DashboardState {
  strategy: StrategyType;
  budget: number;
  channels: ChannelAllocation;
  regions: RegionalSplit;
  timing: CampaignTiming;
  benchmarks: IndustryBenchmarks;
  ralphAssumptions: RalphAssumptions;
}

// Calculation results
export interface ChannelResult {
  name: string;
  spend: number;
  installs: number;
  cpi: number;
  qualityScore: number;
}

export interface ProjectionMonth {
  month: string;
  baseline: number;
  projected: number;
  optimistic: number;
  conservative: number;
}

export interface PlayerValueCalculation {
  incrementalInstalls: number;
  newPlayers: number;
  reactivatedPlayers: number;
  retainedAtD90: number;
  retentionRate: number;
  playerValue: number;
  arpdau: number;
  avgDaysRetained: number;
  campaignROI: number;
  valueGenerated: number;
  campaignInvestment: number;
}

export interface SocialGrowthForecast {
  platform: string;
  current: number;
  projected: number;
  growthPercent: number;
}

export interface ScenarioResult {
  strategy: StrategyType;
  totalIncrementalInstalls: number;
  retainedAtD90: number;
  retentionPercent: number;
  campaignROI: number;
  avgCPI: number;
  qualityScore: number;
  monthlyProjections: ProjectionMonth[];
  strengths: string[];
  tradeoffs: string[];
}

// AI Assessment
export interface AIAssessment {
  summary: string;
  recommendations: string[];
  suggestedChanges: Partial<DashboardState>;
}

// Sensitivity Analysis
export interface SensitivityRange {
  parameter: string;
  label: string;
  lowValue: number;
  baseValue: number;
  highValue: number;
  lowROI: number;
  baseROI: number;
  highROI: number;
  unit: string;
}

// Data Pending Status
export type DataConfidenceLevel = 'confirmed' | 'estimated' | 'pending';

export interface DataPointStatus {
  key: string;
  label: string;
  value: string | number;
  confidence: DataConfidenceLevel;
  source: string;
  tooltip?: string;
}
