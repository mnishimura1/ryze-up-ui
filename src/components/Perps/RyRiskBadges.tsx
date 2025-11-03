import React from 'react';
import { useStore } from '../../lib/store';
import type { Symbol } from '../../types';
import { RyCard } from '../primitives/RyCard';

interface RyRiskBadgesProps {
  sym: Symbol;
}

const greeks = {  // Stub mini greeks
  delta: 0.65,
  gamma: 0.02,
  theta: -5.2,
  vega: 12.1
};

export const RyRiskBadges: React.FC<RyRiskBadgesProps> = ({ sym }) => {
  const { perps } = useStore();
  const metrics = perps.metrics[sym] || { oi: 0, skew: 0 };

  return (
    <RyCard className="grid grid-cols-2 gap-2">
      <div className="text-xs">
        <div>Open Interest: {metrics.oi.toLocaleString()}</div>
        <div>Skew: {metrics.skew.toFixed(2)}%</div>
      </div>
      <div className="text-xs space-y-1">
        <div>Δ: {greeks.delta}</div>
        <div>Γ: {greeks.gamma}</div>
        <div>Θ: {greeks.theta}</div>
        <div>ν: {greeks.vega}</div>
      </div>
    </RyCard>
  );
};
