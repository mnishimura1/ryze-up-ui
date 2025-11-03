import React, { useState } from 'react';
import { RyLevSlider } from './RyLevSlider';
import { RyFundingStat } from './RyFundingStat';
import { RyPnLChart } from './RyPnLChart';
import { RyRiskBadges } from './RyRiskBadges';
import { useStore } from '../../lib/store';

export const PerpsTab: React.FC = () => {
  const [selectedSym] = useState('BTC-PERP');  // Stub; from Markets or search
  const { safety, perps } = useStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Left: Leverage + Positions */}
      <div className="lg:col-span-1 space-y-4">
        <RyLevSlider sym={selectedSym} />
      </div>

      {/* Center: PnL Chart + Funding */}
      <div className="lg:col-span-1 space-y-4">
        <RyPnLChart sym={selectedSym} />
        <RyFundingStat sym={selectedSym} />
      </div>

      {/* Right: Risk Badges */}
      <div className="lg:col-span-1 space-y-4">
        <RyRiskBadges sym={selectedSym} />
        {/* Additional metrics from REST /api/perps/:sym/metrics */}
        <div className="text-xs space-y-1">
          <div>Index: ${perps.metrics[selectedSym]?.index?.toFixed(2) || 'N/A'}</div>
          <div>Mark: ${perps.metrics[selectedSym]?.mark?.toFixed(2) || 'N/A'}</div>
          {!safety.matching && (
            <div className="text-danger text-center py-1 bg-danger/10 rounded">Matching Disabled</div>
          )}
          {!safety.quoting && (
            <div className="text-warn text-center py-1 bg-warn/10 rounded">Quoting Disabled</div>
          )}
        </div>
      </div>
    </div>
  );
};
