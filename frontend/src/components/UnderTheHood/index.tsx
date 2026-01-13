import React, { useState } from 'react';
import { DashboardState, IndustryBenchmarks } from '../../types';
import { defaultBenchmarks } from '../../data/defaults';
import { DataSources } from './DataSources';
import { RetentionModel } from './RetentionModel';
import { CostModel } from './CostModel';
import { FormulaDisplay } from './FormulaDisplay';
import { SensitivityAnalysis } from './SensitivityAnalysis';
import { DataPendingStatus } from './DataPendingStatus';
import { ChevronDown, ChevronUp, Database, TrendingDown, DollarSign, Code, BarChart3, AlertCircle } from 'lucide-react';

interface UnderTheHoodProps {
  state: DashboardState;
  benchmarks: IndustryBenchmarks;
  onBenchmarksChange: (benchmarks: IndustryBenchmarks) => void;
}

type TabType = 'pending' | 'sources' | 'sensitivity' | 'retention' | 'cost' | 'formula';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'pending', label: 'Data Status', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'sources', label: 'Data Sources', icon: <Database className="w-4 h-4" /> },
  { id: 'sensitivity', label: 'Sensitivity', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'retention', label: 'Retention Model', icon: <TrendingDown className="w-4 h-4" /> },
  { id: 'cost', label: 'Cost Model', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'formula', label: 'Forecast Formula', icon: <Code className="w-4 h-4" /> },
];

export function UnderTheHood({ state, benchmarks, onBenchmarksChange }: UnderTheHoodProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const handleReset = () => {
    onBenchmarksChange(defaultBenchmarks);
  };

  return (
    <div className="bg-white border-t border-hay-cream-dark">
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-hay-cream/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔧</span>
          <span className="font-semibold text-hay-brown font-display">Under the Hood</span>
          <span className="text-xs text-hay-brown-light">
            (Data sources, assumptions, and formulas)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-hay-brown-light" />
        ) : (
          <ChevronDown className="w-5 h-5 text-hay-brown-light" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-hay-cream-dark">
          {/* Tab Navigation */}
          <div className="px-6 py-3 border-b border-hay-cream-dark bg-hay-cream/30">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-hay-gold text-white'
                      : 'text-hay-brown-light hover:bg-hay-cream'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-6">
            {activeTab === 'pending' && <DataPendingStatus />}
            {activeTab === 'sources' && <DataSources />}
            {activeTab === 'sensitivity' && <SensitivityAnalysis state={state} />}
            {activeTab === 'retention' && (
              <RetentionModel
                benchmarks={benchmarks}
                onChange={onBenchmarksChange}
                onReset={handleReset}
              />
            )}
            {activeTab === 'cost' && (
              <CostModel
                benchmarks={benchmarks}
                onChange={onBenchmarksChange}
              />
            )}
            {activeTab === 'formula' && <FormulaDisplay />}
          </div>
        </div>
      )}
    </div>
  );
}
