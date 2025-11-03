import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { RyCard } from '../primitives/RyCard';
import type { Symbol } from '../../types';

export interface RyMarketCardProps {
  sym: Symbol;
  price: number;
  change: number; // percentage
  vol: number;   // 24h volume
  latency_us: number;
  venue: 'Base' | 'Bridged';
}

export const RyMarketCard: React.FC<RyMarketCardProps> = ({
  sym,
  price,
  change,
  vol,
  latency_us,
  venue
}) => {
  const isPositive = change >= 0;
  const changeClass = isPositive ? 'text-success' : 'text-danger';

  const formatVolume = (v: number) => {
    if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    return `$${(v / 1e3).toFixed(1)}K`;
  };

  const formatPrice = (p: number) => {
    if (p < 0.01) return `$${p.toFixed(6)}`;
    if (p < 1) return `$${p.toFixed(4)}`;
    if (p < 100) return `$${p.toFixed(2)}`;
    return `$${p.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <RyCard className="p-3 hover:border-accent transition-all cursor-pointer">
      <div className="space-y-2">
        {/* Header: Symbol + Venue */}
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-sm">{sym}</div>
            <div className="text-xs text-subtext">{venue}</div>
          </div>
          <div className={`text-xs px-2 py-1 rounded ${isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </div>
        </div>

        {/* Price */}
        <div className="text-lg font-mono font-bold">
          {formatPrice(price)}
        </div>

        {/* Volume */}
        <div className="text-xs text-subtext">
          Vol 24h: <span className="text-accent">{formatVolume(vol)}</span>
        </div>

        {/* Latency + Trend */}
        <div className="flex justify-between items-center pt-1 border-t border-dark-border">
          <div className="text-xs text-subtext">
            Latency: <span className="font-mono text-accent">{latency_us}μs</span>
          </div>
          <div className="text-accent">
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    </RyCard>
  );
};
