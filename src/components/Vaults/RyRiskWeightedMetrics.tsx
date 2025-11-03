import React from 'react'
import { BarChart3, TrendingDown } from 'lucide-react'

interface RiskMetrics {
  var_95: number
  cvar_95: number
  sharpe_ratio: number
  max_drawdown: number
  correlation_btc: number
  beta: number
}

export const RyRiskWeightedMetrics: React.FC<{ metrics: RiskMetrics }> = ({ metrics }) => {
  const getMetricColor = (value: number, threshold: number, inverse?: boolean) => {
    if (inverse) {
      return value > threshold ? 'text-success' : 'text-warn'
    }
    return value < threshold ? 'text-success' : 'text-danger'
  }

  const metricsList = [
    {
      label: 'Value at Risk (95%)',
      value: metrics.var_95,
      unit: '%',
      description: 'Max expected loss at 95% confidence',
      good: metrics.var_95 < 5
    },
    {
      label: 'CVaR (95%)',
      value: metrics.cvar_95,
      unit: '%',
      description: 'Expected loss beyond VaR',
      good: metrics.cvar_95 < 7
    },
    {
      label: 'Sharpe Ratio',
      value: metrics.sharpe_ratio,
      unit: '',
      description: 'Risk-adjusted return metric',
      good: metrics.sharpe_ratio > 1
    },
    {
      label: 'Max Drawdown',
      value: metrics.max_drawdown,
      unit: '%',
      description: 'Largest peak-to-trough decline',
      good: metrics.max_drawdown < 20
    },
    {
      label: 'BTC Correlation',
      value: metrics.correlation_btc,
      unit: '',
      description: 'Correlation with Bitcoin',
      good: Math.abs(metrics.correlation_btc) < 0.5
    },
    {
      label: 'Beta',
      value: metrics.beta,
      unit: '',
      description: 'Systematic risk relative to market',
      good: metrics.beta < 1.5
    }
  ]

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Risk Metrics
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {metricsList.map((metric, idx) => (
          <div key={idx} className="bg-dark-bg border border-dark-border rounded-lg p-2.5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold">{metric.label}</div>
              <div className={`font-mono font-bold text-sm ${metric.good ? 'text-success' : 'text-warn'}`}>
                {metric.value.toFixed(2)}
                {metric.unit}
              </div>
            </div>
            <div className="text-xs text-subtext mb-1">{metric.description}</div>
            <div className="flex items-center gap-1">
              <div className="w-full bg-dark-border rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full ${metric.good ? 'bg-success' : 'bg-warn'}`}
                  style={{ width: `${Math.min(100, Math.abs(metric.value) * 20)}%` }}
                />
              </div>
              {metric.good && <div className="text-success text-xs">✓</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
