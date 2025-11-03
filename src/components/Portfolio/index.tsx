import React, { useState } from 'react'
import { RyBalances } from './RyBalances'
import { RyPositions } from './RyPositions'
import { RyHistory } from './RyHistory'
import { RyUnitsDashboard } from './RyUnitsDashboard'
import { RyEpochConfigurator } from './RyEpochConfigurator'
import { RyDecaySimulator } from './RyDecaySimulator'
import { RyBatchRefundMetrics } from './RyBatchRefundMetrics'
import { RyTaxExportButton } from './RyTaxExportButton'
import { RyRefundClaimer } from './RyRefundClaimer'
import { RyGaugeWeightsEditor } from './RyGaugeWeightsEditor'

type TabType = 'overview' | 'balances' | 'positions' | 'history' | 'units' | 'epoch' | 'decay' | 'refunds' | 'tax' | 'gauges'

export const PortfolioTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'balances', label: 'Balances', icon: '💰' },
    { id: 'positions', label: 'Positions', icon: '📈' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'units', label: 'Units', icon: '⭐' },
    { id: 'epoch', label: 'Epoch', icon: '⏱️' },
    { id: 'decay', label: 'Decay', icon: '📉' },
    { id: 'refunds', label: 'Refunds', icon: '💸' },
    { id: 'tax', label: 'Tax', icon: '📋' },
    { id: 'gauges', label: 'Gauges', icon: '⚙️' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio</h2>
        <p className="text-slate-400">
          Manage your holdings, view earnings, configure rewards, and export tax data
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 pb-4 border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'bg-slate-800 border-cyan-500 text-white'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-300'
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-800 rounded-lg p-6 border border-blue-700/30">
                <p className="text-sm text-blue-300 mb-2">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-blue-400">$12,847.50</p>
                <p className="text-xs text-slate-400 mt-2">+12.5% this month</p>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-slate-800 rounded-lg p-6 border border-green-700/30">
                <p className="text-sm text-green-300 mb-2">Unrealized P&L</p>
                <p className="text-3xl font-bold text-green-400">+$2,145.32</p>
                <p className="text-xs text-slate-400 mt-2">16.7% gain</p>
              </div>

              <div className="bg-gradient-to-br from-orange-900/30 to-slate-800 rounded-lg p-6 border border-orange-700/30">
                <p className="text-sm text-orange-300 mb-2">Revenue Earned</p>
                <p className="text-3xl font-bold text-orange-400">$487.25</p>
                <p className="text-xs text-slate-400 mt-2">Claimable</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('balances')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition-colors"
              >
                <p className="font-semibold text-white mb-1">Balances</p>
                <p className="text-xs text-slate-400">View holdings</p>
              </button>
              <button
                onClick={() => setActiveTab('positions')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition-colors"
              >
                <p className="font-semibold text-white mb-1">Positions</p>
                <p className="text-xs text-slate-400">Open trades</p>
              </button>
              <button
                onClick={() => setActiveTab('units')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition-colors"
              >
                <p className="font-semibold text-white mb-1">Units</p>
                <p className="text-xs text-slate-400">Earnings</p>
              </button>
              <button
                onClick={() => setActiveTab('refunds')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition-colors"
              >
                <p className="font-semibold text-white mb-1">Refunds</p>
                <p className="text-xs text-slate-400">Claim rewards</p>
              </button>
            </div>
          </div>
        )}

        {/* Balances Tab */}
        {activeTab === 'balances' && <RyBalances />}

        {/* Positions Tab */}
        {activeTab === 'positions' && <RyPositions />}

        {/* History Tab */}
        {activeTab === 'history' && <RyHistory />}

        {/* Units Tab */}
        {activeTab === 'units' && <RyUnitsDashboard />}

        {/* Epoch Tab */}
        {activeTab === 'epoch' && <RyEpochConfigurator />}

        {/* Decay Tab */}
        {activeTab === 'decay' && <RyDecaySimulator />}

        {/* Refunds Tab */}
        {activeTab === 'refunds' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RyRefundClaimer />
              <RyBatchRefundMetrics />
            </div>
          </div>
        )}

        {/* Tax Tab */}
        {activeTab === 'tax' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tax Reporting</h3>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
              <p className="text-slate-300">
                Export your transaction history for tax compliance (1099-DA format)
              </p>
              <RyTaxExportButton />
              <div className="pt-4 border-t border-slate-700 text-xs text-slate-400 space-y-1">
                <p>• Exports all trades and refunds with cost basis calculations</p>
                <p>• Includes real-time pricing from CoinGecko</p>
                <p>• Ready for 1099-DA or similar tax forms</p>
                <p>• Calculated gain/loss per transaction</p>
              </div>
            </div>
          </div>
        )}

        {/* Gauges Tab */}
        {activeTab === 'gauges' && <RyGaugeWeightsEditor />}
      </div>
    </div>
  )
}

export default PortfolioTab
