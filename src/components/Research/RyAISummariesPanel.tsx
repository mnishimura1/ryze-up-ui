import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

export const RyAISummariesPanel: React.FC = () => {
  const { mesh, ai } = useStore();
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<'all' | 'market' | 'risk' | 'opportunity'>('all');

  const summaries = (mesh.ai_summaries || []).filter((s) => {
    if (filterTopic === 'all') return true;
    return s.summary.toLowerCase().includes(filterTopic);
  });

  if (summaries.length === 0) {
    return null;
  }

  const getTopicColor = (summary: string) => {
    const lower = summary.toLowerCase();
    if (lower.includes('risk') || lower.includes('danger') || lower.includes('liquidation')) return 'text-danger';
    if (lower.includes('opportunity') || lower.includes('gain') || lower.includes('profit')) return 'text-success';
    if (lower.includes('market') || lower.includes('volatility')) return 'text-warn';
    return 'text-dark-text/70';
  };

  const getSentimentScore = (summary: string): number => {
    const lower = summary.toLowerCase();
    const positive = (lower.match(/gain|profit|rise|up|bullish|strong|excellent/gi) || []).length;
    const negative = (lower.match(/risk|loss|fall|down|bearish|weak|danger/gi) || []).length;
    return positive - negative;
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">AI Research Summaries</h3>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-4">
          {(['all', 'market', 'risk', 'opportunity'] as const).map((topic) => (
            <button
              key={topic}
              onClick={() => setFilterTopic(topic)}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                filterTopic === topic
                  ? 'bg-accent text-dark-bg'
                  : 'bg-dark-border/50 text-dark-text/70 hover:bg-dark-border'
              }`}
            >
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {summaries.length > 0 ? (
            summaries.map((s) => {
              const sentiment = getSentimentScore(s.summary);
              const isSelected = selectedSummary === s.sym;

              return (
                <div
                  key={s.sym}
                  onClick={() => setSelectedSummary(isSelected ? null : s.sym)}
                  className={`p-4 rounded border cursor-pointer transition ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-dark-border/50 hover:border-dark-border'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-dark-text">{s.sym}</span>
                        <span className="text-xs px-2 py-1 rounded bg-dark-bg">Market Data</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold ${getTopicColor(s.summary)}`}>
                      {sentiment > 0 ? '📈' : sentiment < 0 ? '📉' : '➡️'} {Math.abs(sentiment)}
                    </span>
                  </div>

                  <p className="text-sm text-dark-text/80 mb-3">{s.summary}</p>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-dark-border/30 space-y-3">
                      {/* Detailed Analysis */}
                      <div>
                        <h4 className="text-xs font-semibold text-dark-text/70 mb-2">Confidence Score</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                            <div
                              className={`h-full transition ${
                                sentiment > 0 ? 'bg-success' : sentiment < 0 ? 'bg-danger' : 'bg-warn'
                              }`}
                              style={{ width: `${Math.min(100, 50 + Math.abs(sentiment) * 10)}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono">
                            {(50 + Math.abs(sentiment) * 5).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full px-3 py-2 rounded text-xs font-semibold bg-accent text-dark-bg hover:bg-accent/90 transition">
                        View Full Analysis
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-dark-text/70 text-sm">
              No AI summaries available for selected filter
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-dark-border grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-dark-text/70 mb-1">Total Summaries</div>
            <div className="text-lg font-bold text-dark-text">{summaries.length}</div>
          </div>
          <div>
            <div className="text-dark-text/70 mb-1">Avg Confidence</div>
            <div className="text-lg font-bold text-dark-text">
              {summaries.length > 0
                ? (
                    summaries.reduce((sum, s) => sum + (50 + Math.abs(getSentimentScore(s.summary)) * 5), 0) /
                    summaries.length
                  ).toFixed(0)
                : '0'}
              %
            </div>
          </div>
          <div>
            <div className="text-dark-text/70 mb-1">Sentiment</div>
            <div className={`text-lg font-bold ${summaries.length > 0 && summaries.reduce((s, sum) => s + getSentimentScore(sum.summary), 0) > 0 ? 'text-success' : 'text-danger'}`}>
              {summaries.length > 0
                ? (summaries.reduce((s, sum) => s + getSentimentScore(sum.summary), 0) > 0 ? 'Bullish' : 'Bearish')
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
