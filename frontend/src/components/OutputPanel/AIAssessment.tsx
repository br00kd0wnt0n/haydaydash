import React from 'react';
import { AIAssessment as AIAssessmentType, DashboardState } from '../../types';
import { Card } from '../shared/Card';
import { RefreshCw, Lightbulb, Sparkles } from 'lucide-react';

interface AIAssessmentProps {
  assessment: AIAssessmentType | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onApplySuggestions?: (changes: Partial<DashboardState>) => void;
}

export function AIAssessment({
  assessment,
  isLoading,
  error,
  onRefresh,
  onApplySuggestions,
}: AIAssessmentProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-hay-gold" />
          <h3 className="text-lg font-semibold text-hay-brown font-display">
            AI Strategy Assessment
          </h3>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-hay-cream transition-colors disabled:opacity-50"
          title="Refresh assessment"
        >
          <RefreshCw className={`w-4 h-4 text-hay-brown-light ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && !assessment && (
        <div className="py-8 text-center">
          <div className="inline-flex items-center gap-2 text-hay-brown-light">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Analyzing your configuration...</span>
          </div>
        </div>
      )}

      {error && !assessment && (
        <div className="py-4 px-4 bg-hay-red/10 rounded-lg text-hay-red text-sm">
          {error}
        </div>
      )}

      {assessment && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="p-4 bg-hay-cream rounded-lg border-l-4 border-hay-gold">
            <p className="text-hay-brown leading-relaxed">{assessment.summary}</p>
          </div>

          {/* Recommendations */}
          {assessment.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-hay-brown mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-hay-gold" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {assessment.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="text-sm text-hay-brown-light pl-4 border-l-2 border-hay-cream-dark"
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply Suggestions Button */}
          {assessment.suggestedChanges && Object.keys(assessment.suggestedChanges).length > 0 && onApplySuggestions && (
            <button
              onClick={() => onApplySuggestions(assessment.suggestedChanges)}
              className="w-full py-3 px-4 bg-hay-gold text-white font-medium rounded-lg hover:bg-hay-gold/90 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Apply Suggestions
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
