import React, { useMemo } from 'react'
import { useStore } from '../../lib/store'

export const RyUnitsDashboard: React.FC = () => {
  const units = useStore((s) => s.units)

  const stats = useMemo(() => {
    const earned = units.revenue_share || 0
    const tgeRate = units.tge_rate || 0
    const tgeAmount = (units.balance || 0) * tgeRate

    return {
      totalUnits: units.balance || 0,
      earned,
      tgeRate,
      tgeAmount,
      emissionBreakdown: {
        lp: (units.emissions?.lp || 0),
        trader: (units.emissions?.trader || 0),
        referral: (units.emissions?.referral || 0),
      },
      gaugeWeights: {
        lp: units.gauge_weights?.lp || 0,
        trader: units.gauge_weights?.trader || 0,
        referral: units.gauge_weights?.referral || 0,
      }
    }
  }, [units])

  const claimRevenue = async () => {
    try {
      const response = await fetch('/api/units/claim-revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: stats.earned }),
      })
      if (response.ok) {
        // Dispatch success toast
        console.log('Revenue claimed successfully')
      }
    } catch (error) {
      console.error('Failed to claim revenue:', error)
    }
  }

  return (
    <div
      className="space-y-6"
      role="region"
      aria-label="Units economy dashboard"
    >
      <h3 className="text-lg font-semibold">Units Economy</h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Total Units</p>
          <p className="text-2xl font-bold font-mono text-white">
            {stats.totalUnits.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Revenue Earned</p>
          <p className="text-2xl font-bold text-green-400">
            ${stats.earned.toFixed(0)}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">TGE Rate</p>
          <p className="text-2xl font-bold font-mono text-white">
            {(stats.tgeRate * 100).toFixed(2)}%
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">TGE Amount</p>
          <p className="text-2xl font-bold text-cyan-400">
            {stats.tgeAmount.toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      {/* Emissions Breakdown */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h4 className="font-semibold mb-4">Emissions Breakdown</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">LP Emissions</span>
              <span className="font-mono font-semibold">
                {stats.emissionBreakdown.lp.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${
                    (stats.emissionBreakdown.lp /
                      (stats.emissionBreakdown.lp +
                        stats.emissionBreakdown.trader +
                        stats.emissionBreakdown.referral)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Trader Emissions</span>
              <span className="font-mono font-semibold">
                {stats.emissionBreakdown.trader.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    (stats.emissionBreakdown.trader /
                      (stats.emissionBreakdown.lp +
                        stats.emissionBreakdown.trader +
                        stats.emissionBreakdown.referral)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Referral Emissions</span>
              <span className="font-mono font-semibold">
                {stats.emissionBreakdown.referral.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{
                  width: `${
                    (stats.emissionBreakdown.referral /
                      (stats.emissionBreakdown.lp +
                        stats.emissionBreakdown.trader +
                        stats.emissionBreakdown.referral)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gauge Weights */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h4 className="font-semibold mb-4">Gauge Weights (Sum: 100%)</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">LP Weight</p>
            <p className="text-xl font-bold text-blue-400">
              {stats.gaugeWeights.lp.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-2">Trader Weight</p>
            <p className="text-xl font-bold text-green-400">
              {stats.gaugeWeights.trader.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-2">Referral Weight</p>
            <p className="text-xl font-bold text-orange-400">
              {stats.gaugeWeights.referral.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Claim Revenue */}
      <button
        onClick={claimRevenue}
        disabled={stats.earned <= 0}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          stats.earned > 0
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
        aria-label={`Claim revenue: $${stats.earned.toFixed(0)}`}
      >
        💰 Claim Revenue (${stats.earned.toFixed(0)})
      </button>
    </div>
  )
}
