import React from 'react';
import { RyMarketGrid } from './RyMarketGrid';
import { useStore } from '../../lib/store';

export const MarketsTab: React.FC = () => {
  const { safety } = useStore();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Markets (Base + Bridged Assets)</h3>
        <div className="text-sm text-subtext">
          Total Tokens: ~35 | Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      {!safety.quoting && (
        <div className="text-warn text-center py-2 bg-warn/10 rounded mb-4">Quoting Disabled</div>
      )}
      <RyMarketGrid />
    </div>
  );
};
