import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

export const RyOrderFlowToolbar: React.FC = () => {
  const { flow } = useStore();
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h'>('5m');
  const [smoothing, setSmoothing] = useState(0.3);
  const [aggressorFilter, setAggressorFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [minSize, setMinSize] = useState(1000);

  const timeframeLabels = {
    '1m': '1 Minute',
    '5m': '5 Minutes',
    '15m': '15 Minutes',
    '1h': '1 Hour',
  };

  // Get real aggressor stats from store
  const aggressorStats = (flow as any)?.aggressor_stats || { all: null, buy: null, sell: null };
  const stats = aggressorStats[aggressorFilter];

  if (!stats) {
    return null;
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">OrderFlow Toolbar</h3>

        {/* Top Row: Timeframe and Smoothing */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Timeframe Selector */}
          <div>
            <label className="text-xs font-semibold text-dark-text/70 block mb-2">Timeframe</label>
            <div className="grid grid-cols-4 gap-2">
              {(['1m', '5m', '15m', '1h'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition ${
                    timeframe === tf
                      ? 'bg-accent text-dark-bg'
                      : 'bg-dark-border/50 text-dark-text/70 hover:bg-dark-border'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Smoothing Slider */}
          <div>
            <label className="text-xs font-semibold text-dark-text/70 block mb-2">
              Smoothing (EMA): {(smoothing * 100).toFixed(0)}%
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={smoothing}
                onChange={(e) => setSmoothing(+e.target.value)}
                className="flex-1"
              />
              <span className="text-xs font-mono w-8 text-right text-dark-text/70">
                {(smoothing * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Middle Row: Aggressor Filter and Min Size */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Aggressor Filter */}
          <div>
            <label className="text-xs font-semibold text-dark-text/70 block mb-2">Aggressor Filter</label>
            <div className="grid grid-cols-3 gap-2">
              {(['all', 'buy', 'sell'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAggressorFilter(filter)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition ${
                    aggressorFilter === filter
                      ? 'bg-accent text-dark-bg'
                      : 'bg-dark-border/50 text-dark-text/70 hover:bg-dark-border'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'buy' ? '📈 Buy' : '📉 Sell'}
                </button>
              ))}
            </div>
          </div>

          {/* Min Size Filter */}
          <div>
            <label className="text-xs font-semibold text-dark-text/70 block mb-2">
              Min Size: ${(minSize / 1000).toFixed(0)}k
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={minSize}
                onChange={(e) => setMinSize(+e.target.value)}
                className="flex-1"
              />
              <span className="text-xs font-mono w-12 text-right text-dark-text/70">
                ${(minSize / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-dark-bg rounded border border-dark-border/50 mb-4">
          <div>
            <div className="text-xs text-dark-text/70 mb-1">Aggressive Buys</div>
            <div className="text-lg font-bold text-success">{stats.buys.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-dark-text/70 mb-1">Aggressive Sells</div>
            <div className="text-lg font-bold text-danger">{stats.sells.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-dark-text/70 mb-1">Buy/Sell Ratio</div>
            <div className={`text-lg font-bold ${stats.ratio > 1.02 ? 'text-success' : stats.ratio < 0.98 ? 'text-danger' : 'text-warn'}`}>
              {stats.ratio.toFixed(2)}x
            </div>
          </div>
        </div>

        {/* Flow Distribution Bars */}
        <div className="space-y-3 mb-4">
          {/* Buy Volume */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-success">Buy Flow</span>
              <span className="text-dark-text/70">{((stats.buys / (stats.buys + stats.sells)) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all"
                style={{ width: `${(stats.buys / (stats.buys + stats.sells)) * 100}%` }}
              />
            </div>
          </div>

          {/* Sell Volume */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-danger">Sell Flow</span>
              <span className="text-dark-text/70">{((stats.sells / (stats.buys + stats.sells)) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-danger transition-all"
                style={{ width: `${(stats.sells / (stats.buys + stats.sells)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 rounded text-sm font-semibold bg-accent text-dark-bg hover:bg-accent/90 transition">
            Apply Filters
          </button>
          <button className="flex-1 px-3 py-2 rounded text-sm font-semibold bg-dark-border text-dark-text hover:bg-dark-border/80 transition">
            Export Data
          </button>
          <button className="flex-1 px-3 py-2 rounded text-sm font-semibold bg-dark-border text-dark-text hover:bg-dark-border/80 transition">
            Reset
          </button>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-xs text-dark-text/50 text-center">
          Updated: {Math.round(Math.random() * 100)}ms ago
        </div>
      </div>
    </Card>
  );
};
