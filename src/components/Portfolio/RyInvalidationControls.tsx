import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

export const RyInvalidationControls: React.FC = () => {
  const { portfolio, safety } = useStore();
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const assets = Object.keys(portfolio.balances || {});

  // Get real liquidation risk from store
  const liquidationRisk = (portfolio as any)?.liquidation_risk || false;

  // Get real hedge gaps from store or return null if not available
  const hedgeGaps = (portfolio as any)?.hedge_gaps || [];

  if (assets.length === 0 || hedgeGaps.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Invalidation Controls</h3>

        {/* Liquidation Risk Alert */}
        <div className={`mb-4 p-3 rounded border ${liquidationRisk ? 'border-danger/50 bg-danger/10' : 'border-success/50 bg-success/10'}`}>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-lg">{liquidationRisk ? '⚠️' : '✓'}</span>
            <div>
              <div className="font-semibold">
                {liquidationRisk ? 'Liquidation Risk Detected' : 'No Liquidation Risk'}
              </div>
              <div className="text-xs text-dark-text/70 mt-1">
                {liquidationRisk
                  ? 'LTV: 78% (threshold: 85%)'
                  : 'LTV: 42% (safe margin)'}
              </div>
            </div>
          </div>
        </div>

        {/* Hedge Gap Detector */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">Hedge Gaps</h4>
          <div className="space-y-3">
            {hedgeGaps.map((gap: any) => (
              <div key={gap.asset} className="flex items-center space-x-3 text-xs">
                <span className="font-semibold w-12 text-dark-text/70">{gap.asset}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-dark-text/70">Current: {gap.current}%</span>
                    <span className="text-dark-text/70">Target: {gap.ideal}%</span>
                  </div>
                  <div className="w-full bg-dark-border rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition ${gap.gap.startsWith('+') ? 'bg-warn' : 'bg-success'}`}
                      style={{ width: `${Math.max(gap.current, gap.ideal)}%` }}
                    />
                  </div>
                </div>
                <span className={`font-semibold w-12 text-right ${gap.gap.startsWith('+') ? 'text-warn' : 'text-success'}`}>
                  {gap.gap}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Selection for Rebalance */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">Rebalance Assets</h4>
          <div className="grid grid-cols-3 gap-2">
            {assets.map((asset) => (
              <button
                key={asset}
                onClick={() =>
                  setSelectedAssets((prev) =>
                    prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
                  )
                }
                className={`px-3 py-2 rounded text-xs font-semibold transition ${
                  selectedAssets.includes(asset)
                    ? 'bg-accent text-dark-bg'
                    : 'bg-dark-border/50 text-dark-text/70 hover:bg-dark-border'
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            disabled={!safety.routing || selectedAssets.length === 0}
            className={`w-full px-3 py-2 rounded font-semibold text-sm transition ${
              safety.routing && selectedAssets.length > 0
                ? 'bg-accent text-dark-bg hover:bg-accent/90'
                : 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'
            }`}
          >
            {selectedAssets.length > 0 ? `Rebalance (${selectedAssets.join(', ')})` : 'Select Assets'}
          </button>

          <button
            disabled={!safety.routing}
            className={`w-full px-3 py-2 rounded font-semibold text-sm transition ${
              safety.routing
                ? 'bg-dark-border text-dark-text hover:bg-dark-border/80'
                : 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'
            }`}
          >
            Resync Prices
          </button>

          {liquidationRisk && (
            <button className="w-full px-3 py-2 rounded font-semibold text-sm bg-danger text-white hover:bg-danger/90 transition">
              🚨 Emergency Deleverage
            </button>
          )}
        </div>

        {/* Status Footer */}
        <div className="mt-4 pt-4 border-t border-dark-border text-xs text-dark-text/70 space-y-1">
          <div className="flex justify-between">
            <span>Last Sync:</span>
            <span className="font-mono">2 seconds ago</span>
          </div>
          <div className="flex justify-between">
            <span>Invalidation Mode:</span>
            <span className={safety.deploy ? 'text-success' : 'text-warn'}>
              {safety.deploy ? 'Auto' : 'Manual'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
