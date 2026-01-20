import React from 'react';
import { DashboardState, StrategyType, ChannelAllocation as ChannelAllocationType, RegionalSplit as RegionalSplitType, CampaignTiming } from '../../types';
import { StrategySelector } from './StrategySelector';
import { BudgetSlider } from './BudgetSlider';
import { ChannelAllocation } from './ChannelAllocation';
import { RegionalSplit } from './RegionalSplit';
import { TimingToggle } from './TimingToggle';
import { strategies } from '../../data/defaults';

interface InputPanelProps {
  state: DashboardState;
  onStrategyChange: (strategy: StrategyType) => void;
  onBudgetChange: (budget: number) => void;
  onChannelsChange: (channels: ChannelAllocationType) => void;
  onRegionsChange: (regions: RegionalSplitType) => void;
  onTimingChange: (timing: CampaignTiming) => void;
  recommendedStrategy?: StrategyType;
}

export function InputPanel({
  state,
  onStrategyChange,
  onBudgetChange,
  onChannelsChange,
  onRegionsChange,
  onTimingChange,
  recommendedStrategy,
}: InputPanelProps) {
  const handleStrategyChange = (strategy: StrategyType) => {
    onStrategyChange(strategy);
    // Auto-adjust channels when strategy changes
    const strategyDefaults = strategies[strategy].channelDefaults;
    onChannelsChange(strategyDefaults);
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <StrategySelector value={state.strategy} onChange={handleStrategyChange} recommendedStrategy={recommendedStrategy} />
      <BudgetSlider value={state.budget} onChange={onBudgetChange} />
      <ChannelAllocation value={state.channels} onChange={onChannelsChange} />
      <RegionalSplit value={state.regions} onChange={onRegionsChange} />
      <TimingToggle value={state.timing} onChange={onTimingChange} />
    </div>
  );
}
