import React from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

export const RyExposureBar: React.FC = () => {
  const { portfolio } = useStore();

  // Calculate exposure percentages from real data
  const balances = portfolio.balances || [];

  if (balances.length === 0) {
    return null;
  }

  const totalValue = balances.reduce((sum, bal) => sum + (bal.usdValue || 0), 0);

  if (totalValue <= 0) {
    return null;
  }

  const exposures = balances.map((balance) => ({
    symbol: balance.symbol,
    usdValue: balance.usdValue || 0,
    percentage: ((balance.usdValue || 0) / totalValue) * 100,
  })).filter(e => e.percentage > 0.1);

  const getColor = (symbol: string, idx: number) => {
    const colors = [
      '#ff1493', // hot pink
      '#00d4ff', // cyan
      '#00ff88', // lime
      '#ffa500', // orange
      '#ff6b9d', // light pink
      '#a78bfa', // purple
      '#60a5fa', // blue
      '#34d399', // teal
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Exposure</h3>

          {/* Stacked Bar */}
          <div className="mb-6">
            <div className="flex h-8 rounded-lg overflow-hidden border border-dark-border shadow-sm">
              {exposures.map((exp, idx) => (
                <div
                  key={exp.symbol}
                  style={{
                    width: `${exp.percentage}%`,
                    backgroundColor: getColor(exp.symbol, idx),
                    opacity: 0.8,
                  }}
                  className="transition-all hover:opacity-100"
                  title={`${exp.symbol}: ${exp.percentage.toFixed(1)}%`}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3">
            {exposures.map((exp, idx) => (
              <div key={exp.symbol} className="flex items-center space-x-2 text-sm">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: getColor(exp.symbol, idx) }}
                />
                <span className="text-dark-text/70">{exp.symbol}</span>
                <span className="font-semibold">{exp.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>

          {/* Concentration Risk */}
          <div className="mt-6 pt-4 border-t border-dark-border">
            <div className="text-xs text-dark-text/70 mb-2">Concentration Risk</div>
            {exposures.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Top Position:</span>
                  <span className="font-semibold">
                    {exposures[0]?.symbol}: {exposures[0]?.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Diversification:</span>
                  <span className={`font-semibold ${exposures[0]?.percentage > 50 ? 'text-warn' : 'text-success'}`}>
                    {exposures.length} assets
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
