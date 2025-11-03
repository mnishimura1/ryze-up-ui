import React, { useState } from 'react'
import { Sliders, TrendingUp } from 'lucide-react'

interface AssetRisk {
  symbol: string
  risk_weight: number
  max_exposure: number
  current_exposure: number
  volatility: number
}

export const RyAssetRiskConfig: React.FC<{ assets: AssetRisk[] }> = ({ assets }) => {
  const [expanded, setExpanded] = useState<string | null>(null)

  const getVolatilityColor = (vol: number) => {
    if (vol > 100) return 'text-danger'
    if (vol > 50) return 'text-warn'
    return 'text-success'
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          Asset Risk Configuration
        </h4>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {assets.map((asset) => (
          <div key={asset.symbol}>
            <button
              onClick={() => setExpanded(expanded === asset.symbol ? null : asset.symbol)}
              className="w-full flex items-center justify-between bg-dark-bg border border-dark-border rounded-lg p-2 hover:border-accent/50 transition-colors text-left text-xs"
            >
              <div className="flex items-center justify-between flex-1">
                <div>
                  <div className="font-semibold">{asset.symbol}</div>
                  <div className="text-subtext">Risk: {asset.risk_weight.toFixed(2)}</div>
                </div>
                <div className={`font-mono font-bold ${getVolatilityColor(asset.volatility)}`}>
                  σ {asset.volatility.toFixed(1)}%
                </div>
              </div>
            </button>

            {expanded === asset.symbol && (
              <div className="bg-dark-bg border border-dark-border/50 border-t-0 rounded-b-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-subtext">Current Exposure:</span>
                  <span className="font-mono font-bold">${asset.current_exposure.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-subtext">Max Exposure:</span>
                  <span className="font-mono font-bold text-accent">${asset.max_exposure.toLocaleString()}</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-dark-border rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${(asset.current_exposure / asset.max_exposure) * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-subtext mt-1">
                    {((asset.current_exposure / asset.max_exposure) * 100).toFixed(1)}% utilized
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
