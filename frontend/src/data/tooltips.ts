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
