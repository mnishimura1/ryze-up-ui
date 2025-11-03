import React, { useState } from 'react'
import { RyStrategyList } from './RyStrategyList'
import { RyAprChart } from './RyAprChart'
import { RyTxPanel } from './RyTxPanel'
import { RyHealthGauges } from './RyHealthGauges'
import { RyADLEvents } from './RyADLEvents'
import { RySolvencyInvariantsDashboard } from './RySolvencyInvariantsDashboard'
import { RyAssetRiskConfig } from './RyAssetRiskConfig'
import { RyRiskWeightedMetrics } from './RyRiskWeightedMetrics'
import { useFetchVaults } from '../../hooks/useFetch'
import { useStore } from '../../lib/store'
import { RyCard } from '../primitives/RyCard'
import { TrendingUp, TrendingDown } from 'lucide-react'

export const VaultsTab: React.FC = () => {
  const { loading } = useFetchVaults()
  const [selectedStrat] = useState('strat-1')
  const { safety, vaults } = useStore()

  if (loading) return <div className="text-center py-4">Loading vaults...</div>

  // Mock health metrics
  const healthMetrics = {
    collateral_ratio: 185,
    liquidation_threshold: 75,
    utilization: 65,
    health_score: 92
  }

  // Mock invariants
  const invariants = [
    {
      name: 'Collateral Coverage',
      status: 'passed' as const,
      value: 1.85,
      threshold: 1.5,
      description: 'Total collateral / borrowed amount'
    },
    {
      name: 'Liquidation Buffer',
      status: 'passed' as const,
      value: 110,
      threshold: 20,
      description: 'Distance to liquidation threshold'
    },
    {
      name: 'Reserve Ratio',
      status: 'passed' as const,
      value: 0.42,
      threshold: 0.1,
      description: 'Reserves / total liabilities'
    },
    {
      name: 'Debt Level',
      status: 'warning' as const,
      value: 65,
      threshold: 50,
      description: 'Current debt utilization'
    }
  ]

  // Mock asset risks
  const assetRisks = [
    {
      symbol: 'ETH',
      risk_weight: 0.08,
      max_exposure: 10000000,
      current_exposure: 5200000,
      volatility: 45.2
    },
    {
      symbol: 'USDC',
      risk_weight: 0.01,
      max_exposure: 20000000,
      current_exposure: 8500000,
      volatility: 2.1
    },
    {
      symbol: 'BTC',
      risk_weight: 0.1,
      max_exposure: 5000000,
      current_exposure: 2100000,
      volatility: 52.3
    }
  ]

  // Mock risk metrics
  const riskMetrics = {
    var_95: 3.2,
    cvar_95: 5.1,
    sharpe_ratio: 1.43,
    max_drawdown: 18.5,
    correlation_btc: 0.62,
    beta: 0.95
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Top Row: Strategy List & APR Chart & Tx Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Strategy List */}
        <div className="space-y-4">
          <RyStrategyList />
        </div>

        {/* Center: APR Chart */}
        <div className="space-y-4">
          <RyAprChart strategyId={selectedStrat} />
          <RyCard className="p-4 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span>TVL</span>
              <span className="font-mono font-bold text-accent">
                ${(vaults.metrics?.[selectedStrat]?.tvl || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>APR (7d)</span>
              <span className="font-mono font-bold text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {(vaults.metrics?.[selectedStrat]?.apr_7d || 0).toFixed(2)}%
              </span>
            </div>
            {!safety.deploy && (
              <div className="text-danger text-center py-1 bg-danger/10 rounded mt-2 text-xs">
                Sandbox: Claims Disabled
              </div>
            )}
          </RyCard>
        </div>

        {/* Right: Tx Panel */}
        <div>
          <RyTxPanel strategyId={selectedStrat} />
        </div>
      </div>

      {/* Middle Row: Health & Risk Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RyHealthGauges metrics={healthMetrics} />
        <RyRiskWeightedMetrics metrics={riskMetrics} />
      </div>

      {/* Bottom Row: Solvency, ADL, Asset Risk, Risk Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <RySolvencyInvariantsDashboard invariants={invariants} />
          <RyADLEvents />
        </div>
        <div className="space-y-4">
          <RyAssetRiskConfig assets={assetRisks} />
        </div>
      </div>
    </div>
  )
}
