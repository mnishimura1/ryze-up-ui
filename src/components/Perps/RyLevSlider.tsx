import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import type { Symbol } from '../../types';
import { RyCard } from '../primitives/RyCard';

interface RyLevSliderProps {
  sym: Symbol;
  maxLev?: number;  // e.g., 100x
}

export const RyLevSlider: React.FC<RyLevSliderProps> = ({ sym, maxLev = 100 }) => {
  const [leverage, setLeverage] = useState(1);
  const { perps, safety } = useStore();
  const position = perps.positions[sym] || { size: 0, entryPx: 0 };
  const quotingEnabled = safety.quoting;
  const matchingEnabled = safety.matching;

  const isDisabled = !quotingEnabled || !matchingEnabled;

  const handleLeverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLev = Number(e.target.value);
    if (newLev >= 1 && newLev <= maxLev) {
      setLeverage(newLev);
      // In prod: Update position leverage via WS { t: 'perps.adjust_lev', d: { sym, lev: newLev } }
      console.log(`Adjust leverage for ${sym} to ${newLev}x`);
    }
  };

  const liqPrice = position.size > 0
    ? (position.entryPx * (1 - (1 / leverage) * 0.05)).toFixed(2)  // Stub: 5% maintenance margin
    : 'N/A';

  return (
    <RyCard className={isDisabled ? 'opacity-50 pointer-events-none' : ''}>
      <h3 className="text-lg font-semibold mb-2">Leverage</h3>
      <div className="space-y-3">
        <input
          type="range"
          min="1"
          max={maxLev}
          step="1"
          value={leverage}
          onChange={handleLeverageChange}
          className="w-full"
          disabled={isDisabled}
        />
        <div className="flex justify-between text-sm">
          <span>1x</span>
          <span className="font-mono">{leverage}x</span>
          <span>{maxLev}x</span>
        </div>
        <div className="text-xs text-subtext">
          Est. Liq Price: <span className="font-mono text-warn">${liqPrice}</span>
        </div>
        {!matchingEnabled && (
          <div className="text-danger text-xs text-center py-1 bg-danger/10 rounded">
            Matching Disabled
          </div>
        )}
        {!quotingEnabled && (
          <div className="text-warn text-xs text-center py-1 bg-warn/10 rounded">
            Quoting Disabled
          </div>
        )}
      </div>
    </RyCard>
  );
};
