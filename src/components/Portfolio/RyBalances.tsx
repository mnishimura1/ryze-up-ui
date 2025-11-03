import React, { useEffect, useState } from 'react'
import { useStore } from '../../lib/store'

export const RyBalances: React.FC = () => {
  const portfolio = useStore((s) => s.portfolio)
  const [sortBy, setSortBy] = useState<'value' | 'name'>('value')

  const sortedBalances = [...(portfolio.balances || [])].sort((a, b) => {
    if (sortBy === 'value') {
      return (b.usdValue || 0) - (a.usdValue || 0)
    }
    return a.symbol.localeCompare(b.symbol)
  })

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="Token balances"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Balances</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('value')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              sortBy === 'value'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            aria-pressed={sortBy === 'value'}
          >
            By Value
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              sortBy === 'name'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            aria-pressed={sortBy === 'name'}
          >
            By Name
          </button>
        </div>
      </div>

      <div
        role="list"
        className="space-y-3"
      >
        {sortedBalances.map((balance) => (
          <div
            key={balance.symbol}
            role="listitem"
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 transition-colors"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.click?.()
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono font-semibold text-white">
                  {balance.symbol}
                </p>
                <p className="text-sm text-slate-400">
                  {balance.amount.toFixed(6)} tokens
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">
                  ${(balance.usdValue || 0).toFixed(2)}
                </p>
                <p className="text-sm text-slate-400">
                  ${(balance.price || 0).toFixed(4)} each
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!sortedBalances || sortedBalances.length === 0) && (
        <div className="text-center py-8 text-slate-400">
          No balances yet
        </div>
      )}
    </div>
  )
}
