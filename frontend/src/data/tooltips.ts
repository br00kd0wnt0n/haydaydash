// Glossary tooltips
export const glossaryTooltips: Record<string, string> = {
  DAU: 'Daily Active Users - unique players who open the game each day',
  MAU: 'Monthly Active Users - unique players who open the game at least once per month',
  ARPDAU: 'Average Revenue Per Daily Active User - total revenue divided by DAU',
  D30: 'Retention measured at 30 days after install',
  D60: 'Retention measured at 60 days after install',
  D90: 'Retention measured at 90 days after install',
  CPI: 'Cost Per Install - ad spend divided by installs generated',
  LTV: 'Lifetime Value - total revenue expected from a player over their lifetime',
  Reactivation: 'When a lapsed player returns to the game',
  'Dormant Pool': 'Players who have installed but are no longer active',
  'Organic Multiplier': 'Additional installs generated organically when paid campaigns run',
  'Retention Decay': 'Rate at which retained players drop off over time',
  ROI: 'Return on Investment - value generated divided by investment',
  eCRM: 'Electronic Customer Relationship Management - email and notification campaigns',
};

// Benchmark tooltips
export const benchmarkTooltips: Record<string, string> = {
  d30RetentionNew: 'Percentage of new players still active after 30 days',
  d30RetentionReactivated: 'Lapsed players typically retain better - they already know the game',
  d60RetentionDecay: 'What percentage of D30 players remain at D60',
  d90RetentionDecay: 'What percentage of D60 players remain at D90',
  eCRMReactivationRate: 'Percentage of dormant players who return from email campaign',
  pushNotificationCTR: 'Click-through rate on push notifications',
  paidSocialCPI: 'Cost per install from paid social campaigns',
  organicMultiplier: 'Organic installs generated per paid install during campaign',
};

// Ralph methodology tooltips
export const ralphTooltips: Record<string, string> = {
  campaignSpikeMultiplier: 'June birthday expected to generate this multiplier of normal monthly installs',
  retentionQualityBonus: 'Players acquired during celebration campaigns retain better',
  socialAmplificationFactor: 'Engaged community shares birthday content organically',
};

// Scenario strengths and tradeoffs
export const scenarioContent = {
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
  digital_first: {
    strengths: [
      'Sustained engagement - year-round content vs. one-off spikes',
      'Authentic advocacy - creator partnerships feel organic',
      'Scalable reach - content lives on and compounds over time',
      'Measurable attribution - digital touchpoints are trackable',
    ],
    tradeoffs: [
      'Creator dependency - quality relies on partner execution',
      'Slower ramp-up - takes time to build content momentum',
      'Less "big moment" - no single tentpole for PR amplification',
      'Content fatigue risk - requires fresh creative throughout',
    ],
  },
};
