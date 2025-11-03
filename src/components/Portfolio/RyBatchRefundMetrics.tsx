import React, { useMemo } from 'react'

interface RefundMetrics {
  totalRefunds: number
  numberOfTrades: number
  averagePerTrade: number
  dailyCapsUsage: number
  venueBreakdown: Record<string, number>
}

export const RyBatchRefundMetrics: React.FC = () => {
  // Mock data - in production, fetch from /api/refunds/metrics
  const metrics: RefundMetrics = useMemo(() => ({
    totalRefunds: 2847.53,
    numberOfTrades: 156,
    averagePerTrade: 18.25,
    dailyCapsUsage: 0.72, // 72% of daily cap
    venueBreakdown: {
      'Uniswap V3': 0.45,
      'Aerodrome': 0.30,
      'Balancer': 0.25,
    },
  }), [])

  const dailyCapLimit = 10000
  const dailyCapsUsageAmount = metrics.totalRefunds % dailyCapLimit

  return (
    <div
      className="space-y-6"
      role="region"
      aria-label="Batch refund metrics"
    >
      <h3 className="text-lg font-semibold">Refund Metrics</h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Total Refunds</p>
          <p className="text-2xl font-bold text-green-400 font-mono">
            ${metrics.totalRefunds.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Trades Count</p>
          <p className="text-2xl font-bold text-white font-mono">
            {metrics.numberOfTrades}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Avg Per Trade</p>
          <p className="text-2xl font-bold text-blue-400 font-mono">
            ${metrics.averagePerTrade.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Daily Cap Usage</p>
          <p className="text-2xl font-bold text-orange-400 font-mono">
            {(metrics.dailyCapsUsage * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Daily Cap Visualization */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Daily Cap Status</h4>
          <span className="text-sm text-slate-400">
            ${dailyCapsUsageAmount.toFixed(0)} / ${dailyCapLimit.toLocaleString()}
          </span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full transition-all ${
              metrics.dailyCapsUsage >= 0.9
                ? 'bg-red-500'
                : metrics.dailyCapsUsage >= 0.7
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${metrics.dailyCapsUsage * 100}%` }}
          />
        </div>

        <div className="text-xs text-slate-400">
          {metrics.dailyCapsUsage >= 0.9 && '🔴 Near daily limit'}
          {metrics.dailyCapsUsage >= 0.7 &&
            metrics.dailyCapsUsage < 0.9 &&
            '🟡 High usage'}
          {metrics.dailyCapsUsage < 0.7 && '🟢 Normal usage'}
        </div>
      </div>

      {/* Venue Breakdown */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h4 className="font-semibold mb-4">Venue Breakdown</h4>

        <div className="space-y-4">
          {Object.entries(metrics.venueBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([venue, percentage]) => (
              <div key={venue}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">{venue}</span>
                  <span className="font-mono font-semibold">
                    {(percentage * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      venue.includes('Uniswap')
                        ? 'bg-blue-500'
                        : venue.includes('Aerodrome')
                          ? 'bg-green-500'
                          : 'bg-purple-500'
                    }`}
                    style={{ width: `${percentage * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-slate-800 rounded-lg p-4 border border-blue-700/30">
          <p className="text-xs font-medium text-blue-300 mb-2">Largest Refund</p>
          <p className="text-2xl font-bold text-blue-400">$127.50</p>
          <p className="text-xs text-slate-400 mt-1">Trade #42853</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-slate-800 rounded-lg p-4 border border-green-700/30">
          <p className="text-xs font-medium text-green-300 mb-2">Most Active Venue</p>
          <p className="text-2xl font-bold text-green-400">Uniswap V3</p>
          <p className="text-xs text-slate-400 mt-1">45% of refunds</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-slate-800 rounded-lg p-4 border border-purple-700/30">
          <p className="text-xs font-medium text-purple-300 mb-2">Claim Status</p>
          <p className="text-2xl font-bold text-purple-400">73 Pending</p>
          <p className="text-xs text-slate-400 mt-1">Ready to claim</p>
        </div>
      </div>

      {/* Action */}
      <button
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        aria-label="View detailed refund breakdown"
      >
        📊 View Detailed Breakdown
      </button>
    </div>
  )
}
