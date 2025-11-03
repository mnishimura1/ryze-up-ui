import React from 'react';
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';

interface RyStrategyListProps {
  strategies?: Array<{ id: string; name: string; description: string; apr: number; tvl: number; risk_level: 'low' | 'medium' | 'high' }>;
}

const riskColors = {
  low: 'text-success',
  medium: 'text-warn',
  high: 'text-danger'
};

export const RyStrategyList: React.FC<RyStrategyListProps> = ({ strategies = [] }) => {
  const { vaults } = useStore();

  const strategyData = strategies.length > 0 ? strategies : vaults.list || [
    { id: 'strat-1', name: 'ETH Yield Farm', description: 'Auto-compound ETH/USDC LP', apr: 12.5, tvl: 5000000, risk_level: 'low' as const },
    { id: 'strat-2', name: 'BTC Hedged Vault', description: 'Delta-neutral BTC perp + spot', apr: 8.2, tvl: 3000000, risk_level: 'medium' as const },
    { id: 'strat-3', name: 'Meme Momentum', description: 'High-vol Base tokens rotation', apr: 45.0, tvl: 1000000, risk_level: 'high' as const }
  ];

  return (
    <RyCard>
      <h4 className="font-semibold mb-2">Strategies</h4>
      <ul className="space-y-3">
        {strategyData.map((strat) => (
          <li key={strat.id} className="border-b border-dark-border/50 pb-3 last:border-b-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h5 className="font-medium">{strat.name}</h5>
                <p className="text-xs text-subtext">{strat.description}</p>
              </div>
              <div className="text-right ml-4">
                <div className="font-mono text-sm">{strat.apr}% APR</div>
                <div className="text-xs text-subtext">TVL: ${(strat.tvl / 1e6).toFixed(1)}M</div>
                <div className={`text-xs ${riskColors[strat.risk_level]}`}>{strat.risk_level.toUpperCase()}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </RyCard>
  );
};
