import React from 'react'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface HealthMetrics {
  collateral_ratio: number
  liquidation_threshold: number
  utilization: number
  health_score: number
}

export const RyHealthGauges: React.FC<{ metrics: HealthMetrics }> = ({ metrics }) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 50) return 'text-warn'
    return 'text-danger'
  }

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-success/10'
    if (score >= 50) return 'bg-warn/10'
    return 'bg-danger/10'
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Collateral Ratio */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-3">
        <div className="text-xs text-subtext mb-2">Collateral Ratio</div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-lg font-bold text-accent">{metrics.collateral_ratio.toFixed(1)}%</div>
          {metrics.collateral_ratio > 150 ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <AlertCircle className="w-4 h-4 text-warn" />
          )}
        </div>
        <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${Math.min(100, (metrics.collateral_ratio / 200) * 100)}%` }}
          />
        </div>
      </div>

      {/* Liquidation Threshold */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-3">
        <div className="text-xs text-subtext mb-2">Liquidation Threshold</div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-lg font-bold text-accent">{metrics.liquidation_threshold.toFixed(1)}%</div>
          {metrics.collateral_ratio > metrics.liquidation_threshold + 10 ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <AlertCircle className="w-4 h-4 text-danger" />
          )}
        </div>
        <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-danger transition-all"
            style={{ width: `${Math.min(100, metrics.liquidation_threshold)}%` }}
          />
        </div>
      </div>

      {/* Utilization */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-3">
        <div className="text-xs text-subtext mb-2">Utilization</div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-lg font-bold text-accent">{metrics.utilization.toFixed(1)}%</div>
          {metrics.utilization < 80 ? (
            <TrendingDown className="w-4 h-4 text-success" />
          ) : (
            <AlertCircle className="w-4 h-4 text-warn" />
          )}
        </div>
        <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-warn transition-all"
            style={{ width: `${Math.min(100, metrics.utilization)}%` }}
          />
        </div>
      </div>

      {/* Health Score */}
      <div className={`${getHealthBgColor(metrics.health_score)} border border-dark-border rounded-lg p-3`}>
        <div className="text-xs text-subtext mb-2">Health Score</div>
        <div className={`text-2xl font-bold ${getHealthColor(metrics.health_score)}`}>
          {metrics.health_score.toFixed(0)}/100
        </div>
      </div>
    </div>
  )
}
