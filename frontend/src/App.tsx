import React, { useState, useCallback, useEffect } from 'react';
import { DashboardState, StrategyType, ChannelAllocation, RegionalSplit, CampaignTiming, IndustryBenchmarks } from './types';
import { defaultDashboardState, strategies } from './data/defaults';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ScenarioComparison } from './components/ScenarioComparison';
import { UnderTheHood } from './components/UnderTheHood';
import { useCalculations, useScenarioComparison } from './hooks/useCalculations';
import { useAIAssessment } from './hooks/useAIAssessment';
import { parseShareUrl, generateShareUrl } from './services/api';
import { useCurrency } from './contexts/CurrencyContext';
import { GitCompare, Link, Wifi } from 'lucide-react';

function App() {
  // Initialize state from URL or defaults
  const [state, setState] = useState<DashboardState>(() => {
    const urlState = parseShareUrl();
    if (urlState) {
      return { ...defaultDashboardState, ...urlState };
    }
    return defaultDashboardState;
  });

  const [showComparison, setShowComparison] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Currency
  const { currency, setCurrency } = useCurrency();

  // Calculations
  const { channelResults, monthlyProjections, playerValue, socialGrowth } = useCalculations(state);
  const { scenarios, comparison } = useScenarioComparison(
    state.budget,
    state.benchmarks,
    state.ralphAssumptions
  );
  const { assessment, isLoading: aiLoading, error: aiError, refresh: aiRefresh } = useAIAssessment(state);

  // State update handlers
  const handleStrategyChange = useCallback((strategy: StrategyType) => {
    setState(prev => ({ ...prev, strategy }));
  }, []);

  const handleBudgetChange = useCallback((budget: number) => {
    setState(prev => ({ ...prev, budget }));
  }, []);

  const handleChannelsChange = useCallback((channels: ChannelAllocation) => {
    setState(prev => ({ ...prev, channels }));
  }, []);

  const handleRegionsChange = useCallback((regions: RegionalSplit) => {
    setState(prev => ({ ...prev, regions }));
  }, []);

  const handleTimingChange = useCallback((timing: CampaignTiming) => {
    setState(prev => ({ ...prev, timing }));
  }, []);

  const handleBenchmarksChange = useCallback((benchmarks: IndustryBenchmarks) => {
    setState(prev => ({ ...prev, benchmarks }));
  }, []);

  const handleApplyStrategy = useCallback((strategy: StrategyType) => {
    const strategyConfig = strategies[strategy];
    setState(prev => ({
      ...prev,
      strategy,
      channels: strategyConfig.channelDefaults,
    }));
    setShowComparison(false);
  }, []);

  const handleApplySuggestions = useCallback((changes: Partial<DashboardState>) => {
    setState(prev => ({ ...prev, ...changes }));
  }, []);

  const handleCopyLink = useCallback(async () => {
    const url = await generateShareUrl(state);
    await navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }, [state]);

  return (
    <div className="min-h-screen bg-hay-cream flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-hay-cream-dark">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/hayday-logo.png"
                alt="Hay Day"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-hay-brown font-display">
                  Player Value & Growth Dashboard
                </h1>
                <p className="text-sm text-hay-brown-light">
                  Campaign Strategy Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Currency Toggle */}
              <div className="flex bg-hay-cream rounded-lg p-1">
                <button
                  onClick={() => setCurrency('EUR')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    currency === 'EUR'
                      ? 'bg-white text-hay-brown shadow-sm'
                      : 'text-hay-brown-light hover:text-hay-brown'
                  }`}
                >
                  EUR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    currency === 'USD'
                      ? 'bg-white text-hay-brown shadow-sm'
                      : 'text-hay-brown-light hover:text-hay-brown'
                  }`}
                >
                  USD
                </button>
              </div>
              {/* Ralph Connected Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-hay-green/10 border border-hay-green/30 rounded-full">
                <Wifi className="w-3.5 h-3.5 text-hay-green" />
                <span className="text-xs font-medium text-hay-green">Ralph</span>
                <span className="w-1.5 h-1.5 bg-hay-green rounded-full animate-pulse"></span>
              </div>
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-2 px-4 py-2 bg-hay-cream rounded-lg text-hay-brown font-medium text-sm hover:bg-hay-cream-dark transition-colors"
              >
                <GitCompare className="w-4 h-4" />
                Compare All Scenarios
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-hay-gold text-white rounded-lg font-medium text-sm hover:bg-hay-gold/90 transition-colors"
              >
                <Link className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        <div className="max-w-screen-2xl mx-auto w-full flex">
          {/* Input Panel (Left - ~35%) */}
          <div className="w-[400px] bg-hay-cream/50 border-r border-hay-cream-dark overflow-hidden">
            <InputPanel
              state={state}
              onStrategyChange={handleStrategyChange}
              onBudgetChange={handleBudgetChange}
              onChannelsChange={handleChannelsChange}
              onRegionsChange={handleRegionsChange}
              onTimingChange={handleTimingChange}
            />
          </div>

          {/* Output Panel (Right - ~65%) */}
          <div className="flex-1 overflow-hidden">
            <OutputPanel
              state={state}
              channelResults={channelResults}
              monthlyProjections={monthlyProjections}
              playerValue={playerValue}
              socialGrowth={socialGrowth}
              aiAssessment={assessment}
              aiLoading={aiLoading}
              aiError={aiError}
              onAIRefresh={aiRefresh}
              onApplySuggestions={handleApplySuggestions}
            />
          </div>
        </div>
      </main>

      {/* Under the Hood */}
      <UnderTheHood
        benchmarks={state.benchmarks}
        onBenchmarksChange={handleBenchmarksChange}
      />

      {/* Scenario Comparison Modal */}
      {showComparison && (
        <ScenarioComparison
          scenarios={scenarios}
          comparison={comparison}
          budget={state.budget}
          onApplyStrategy={handleApplyStrategy}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}

export default App;
