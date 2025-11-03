import React from 'react';
import { useStore } from '../../lib/store';
import type { Symbol } from '../../types';
import { RyCard } from '../primitives/RyCard';

interface RyFundingStatProps {
  sym: Symbol;
}

export const RyFundingStat: React.FC<RyFundingStatProps> = ({ sym }) => {
  const { perps } = useStore();
  const state = perps.metrics[sym] || { funding_apr: 0, next_funding_ts: Date.now() + 3600000 };  // Stub: 1hr interval

  const nextFunding = new Date(state.next_funding_ts).toLocaleTimeString();
  const fundingRate = (state.funding_apr * 100).toFixed(4);  // e.g., 0.01%

  // Funding timer: Countdown
  const [timeLeft, setTimeLeft] = React.useState(3600);  // Stub: 1hr in sec
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <RyCard>
      <h4 className="font-semibold mb-2">Funding</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Rate:</span>
          <span className={state.funding_apr > 0 ? 'text-success' : 'text-danger'}>
            {state.funding_apr > 0 ? '+' : ''}{fundingRate}%
          </span>
        </div>
        <div className="flex justify-between">
          <span>Next:</span>
          <span>{nextFunding}</span>
        </div>
        <div className="flex justify-between">
          <span>Countdown:</span>
          <span className="font-mono text-accent">{formatTime(timeLeft)}</span>
        </div>
        <div className="text-xs text-subtext">Longs pay shorts if positive</div>
      </div>
    </RyCard>
  );
};
