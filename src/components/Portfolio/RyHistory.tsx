import React, { useState } from 'react'
import { useStore } from '../../lib/store'

export const RyHistory: React.FC = () => {
  const portfolio = useStore((s) => s.portfolio)
  const [filterType, setFilterType] = useState<'all' | 'trade' | 'deposit' | 'withdraw'>('all')

  const history = portfolio.history || []
  const filtered = history.filter((tx) =>
    filterType === 'all' ? true : tx.type === filterType
  )

  const exportHistory = async () => {
    const csv = [
      'Date,Type,Symbol,Amount,Price,Total USD,Status',
      ...filtered.map((tx) =>
        [
          new Date(tx.timestamp).toISOString(),
          tx.type,
          tx.symbol,
          tx.amount.toFixed(6),
          tx.price?.toFixed(4) || '-',
          tx.usdValue?.toFixed(2) || '-',
          tx.status,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-history-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="Transaction history"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">History</h3>
        <button
          onClick={exportHistory}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm font-medium transition-colors"
          aria-label="Export transaction history"
        >
          📥 Export CSV
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'trade', 'deposit', 'withdraw'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
              filterType === type
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            aria-pressed={filterType === type}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          role="table"
        >
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">
                Date
              </th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">
                Type
              </th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">
                Asset
              </th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">
                Amount
              </th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">
                Price
              </th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">
                USD Value
              </th>
              <th className="text-center py-3 px-4 text-slate-400 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-700 hover:bg-slate-750 transition-colors"
              >
                <td className="py-3 px-4 text-slate-300 font-mono text-xs">
                  {new Date(tx.timestamp).toLocaleDateString()} at{' '}
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                      tx.type === 'trade'
                        ? 'bg-blue-900 text-blue-200'
                        : tx.type === 'deposit'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-orange-900 text-orange-200'
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-semibold">
                  {tx.symbol}
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  {tx.amount.toFixed(6)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-400">
                  ${tx.price?.toFixed(4) || '-'}
                </td>
                <td className="py-3 px-4 text-right font-semibold">
                  ${tx.usdValue?.toFixed(2) || '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      tx.status === 'completed'
                        ? 'bg-green-900 text-green-200'
                        : tx.status === 'pending'
                          ? 'bg-yellow-900 text-yellow-200'
                          : 'bg-red-900 text-red-200'
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No transactions found
        </div>
      )}
    </div>
  )
}
