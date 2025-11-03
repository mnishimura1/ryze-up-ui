import React from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

export const RyGreeksMini: React.FC = () => {
  const { perps } = useStore();

  if (!perps.greeks || perps.greeks.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-3">Greeks Snapshot</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-2 px-2 text-dark-text/70 font-medium">Symbol</th>
                <th className="text-right py-2 px-2 text-dark-text/70 font-medium">Δ (Delta)</th>
                <th className="text-right py-2 px-2 text-dark-text/70 font-medium">Γ (Gamma)</th>
                <th className="text-right py-2 px-2 text-dark-text/70 font-medium">Θ (Theta)</th>
                <th className="text-right py-2 px-2 text-dark-text/70 font-medium">ν (Vega)</th>
              </tr>
            </thead>
            <tbody>
              {perps.greeks.map((greek, idx) => (
                <tr key={idx} className="border-b border-dark-border/50 hover:bg-dark-bg/50">
                  <td className="py-2 px-2 font-semibold text-dark-text">{greek.symbol}</td>
                  <td className={`text-right py-2 px-2 font-mono ${greek.delta > 0 ? 'text-success' : 'text-danger'}`}>
                    {greek.delta > 0 ? '+' : ''}{greek.delta.toFixed(3)}
                  </td>
                  <td className={`text-right py-2 px-2 font-mono ${greek.gamma > 0 ? 'text-accent' : 'text-dark-text/50'}`}>
                    {greek.gamma.toFixed(4)}
                  </td>
                  <td className={`text-right py-2 px-2 font-mono ${greek.theta < 0 ? 'text-danger' : 'text-success'}`}>
                    {greek.theta < 0 ? '−' : '+'}{Math.abs(greek.theta).toFixed(4)}
                  </td>
                  <td className={`text-right py-2 px-2 font-mono ${greek.vega > 0 ? 'text-warn' : 'text-dark-text/50'}`}>
                    {greek.vega > 0 ? '+' : ''}{greek.vega.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-dark-text/50 mt-3 space-y-1">
          <div>Δ: Sensitivity to underlying price</div>
          <div>Γ: Rate of change of delta</div>
          <div>Θ: Daily decay (theta bleed)</div>
          <div>ν: Sensitivity to volatility</div>
        </div>
      </div>
    </Card>
  );
};
