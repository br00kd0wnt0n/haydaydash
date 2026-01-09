import React from 'react';
import { DashboardState, ChannelResult, ProjectionMonth, PlayerValueCalculation, SocialGrowthForecast, AIAssessment as AIAssessmentType } from '../../types';
import { ProjectionChart } from './ProjectionChart';
import { PlayerValueCalculator } from './PlayerValueCalculator';
import { ChannelBreakdown } from './ChannelBreakdown';
import { SocialForecast } from './SocialForecast';
import { AIAssessment } from './AIAssessment';

interface OutputPanelProps {
  state: DashboardState;
  channelResults: ChannelResult[];
  monthlyProjections: ProjectionMonth[];
  playerValue: PlayerValueCalculation;
  socialGrowth: SocialGrowthForecast[];
  aiAssessment: AIAssessmentType | null;
  aiLoading: boolean;
  aiError: string | null;
  onAIRefresh: () => void;
  onApplySuggestions?: (changes: Partial<DashboardState>) => void;
  onCompareClick?: () => void;
}

export function OutputPanel({
  state,
  channelResults,
  monthlyProjections,
  playerValue,
  socialGrowth,
  aiAssessment,
  aiLoading,
  aiError,
  onAIRefresh,
  onApplySuggestions,
  onCompareClick,
}: OutputPanelProps) {
  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-6">
      {/* Campaign Projection Chart */}
      <ProjectionChart data={monthlyProjections} timing={state.timing} onCompareClick={onCompareClick} />

      {/* Two column layout for smaller cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Value Calculator */}
        <PlayerValueCalculator data={playerValue} />

        {/* Social Growth Forecast */}
        <SocialForecast data={socialGrowth} />
      </div>

      {/* Channel Efficiency Breakdown */}
      <ChannelBreakdown data={channelResults} />

      {/* AI Strategy Assessment */}
      <AIAssessment
        assessment={aiAssessment}
        isLoading={aiLoading}
        error={aiError}
        onRefresh={onAIRefresh}
        onApplySuggestions={onApplySuggestions}
      />
    </div>
  );
}
