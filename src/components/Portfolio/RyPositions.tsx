import React, { useState } from 'react'
import { useStore } from '../../lib/store'

export const RyPositions: React.FC = () => {
  const portfolio = useStore((s) => s.portfolio)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const positions = portfolio.positions || []

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="Open positions"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Open Positions</h3>
        <div className="text-sm text-slate-400">
          {positions.length} position{positions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div
        role="list"
        className="space-y-3"
      >
        {positions.map((position: any) => {
          const isExpanded = expandedId === position.id
          const pnlPercent = (position.pnl / position.entryValue) * 100
          const isGain = position.pnl >= 0

          return (
            <div
              key={position.id}
              role="listitem"
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : position.id)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-slate-750 transition-colors text-left"
                aria-expanded={isExpanded}
                aria-controls={`position-${position.id}`}
              >
                <div className="flex-1">
                  <p className="font-mono font-semibold text-white">
                    {position.symbol}
                  </p>
                  <p className="text-sm text-slate-400">
                    {position.type === 'long' ? '📈 Long' : '📉 Short'} ·{' '}
                    {(position.size * position.price).toFixed(0)} size
                  </p>
                </div>

                <div className="text-right">
                  <div
                    className={`text-lg font-semibold ${
                      isGain ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isGain ? '+' : ''}${position.pnl.toFixed(2)}
                  </div>
                  <div
                    className={`text-sm font-mono ${
                      isGain ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isGain ? '+' : ''}
                    {pnlPercent.toFixed(2)}%
                  </div>
                </div>
              </button>

              {/* Details */}
              {isExpanded && (
                <div
                  id={`position-${position.id}`}
                  className="border-t border-slate-700 p-4 bg-slate-750 space-y-3 text-sm"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400">Entry Price</p>
                      <p className="font-mono font-semibold">
                        ${position.entryPrice.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Current Price</p>
                      <p className="font-mono font-semibold">
                        ${position.price.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Entry Value</p>
                      <p className="font-mono font-semibold">
                        ${position.entryValue.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Current Value</p>
                      <p className="font-mono font-semibold">
                        $
                        {(
                          position.size * position.price
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Leverage</p>
                      <p className="font-mono font-semibold">
                        {position.leverage}x
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Opened</p>
                      <p className="font-mono font-semibold">
                        {new Date(
                          position.openedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors">
                    Close Position
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {(!positions || positions.length === 0) && (
        <div className="text-center py-8 text-slate-400">
          No open positions
        </div>
      )}
    </div>
  )
}
