import React, { useState, useEffect } from 'react'

interface SSPPool {
  id: string
  name: string
  tvl: number
  apr: number
  volume24h: number
  shield: number
  status: 'active' | 'paused' | 'deprecated'
}

export const RyPoolList: React.FC = () => {
  const [pools, setPools] = useState<SSPPool[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'tvl' | 'apr' | 'volume'>('tvl')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await fetch('/api/ssp/pools')
        if (response.ok) {
          const data = await response.json()
          setPools(data || [])
        }
      } catch (error) {
        console.error('Failed to fetch SSP pools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPools()
    const interval = setInterval(fetchPools, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const sortedPools = [...pools].sort((a, b) => {
    if (sortBy === 'tvl') return (b.tvl || 0) - (a.tvl || 0)
    if (sortBy === 'apr') return (b.apr || 0) - (a.apr || 0)
    return (b.volume24h || 0) - (a.volume24h || 0)
  })

  if (loading) {
    return (
      <div className="text-center py-8 text-slate-400">
        Loading SSP pools...
      </div>
    )
  }

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="SSP pools list"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Smart Swap Pools</h3>
        <div className="flex gap-2">
          {(['tvl', 'apr', 'volume'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                sortBy === key
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              aria-pressed={sortBy === key}
            >
              {key === 'tvl' ? 'TVL' : key === 'apr' ? 'APR' : 'Volume'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {sortedPools.map((pool) => (
          <div
            key={pool.id}
            className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
          >
            {/* Pool Header */}
            <button
              onClick={() =>
                setExpandedId(expandedId === pool.id ? null : pool.id)
              }
              className="w-full p-4 text-left hover:bg-slate-750 transition-colors flex items-center justify-between"
              aria-expanded={expandedId === pool.id}
            >
              <div className="flex-1">
                <p className="font-semibold text-white">{pool.name}</p>
                <p className="text-xs text-slate-400">
                  Pool ID: {pool.id.slice(0, 8)}...
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-mono text-cyan-400">
                  ${(pool.tvl / 1e6).toFixed(1)}M
                </p>
                <p className={`text-xs font-semibold ${
                  pool.apr >= 50 ? 'text-green-400' : pool.apr >= 20 ? 'text-blue-400' : 'text-slate-400'
                }`}>
                  {pool.apr.toFixed(1)}% APR
                </p>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === pool.id && (
              <div className="border-t border-slate-700 p-4 bg-slate-750 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">24h Volume</p>
                    <p className="font-mono font-semibold">
                      ${(pool.volume24h / 1e6).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Shield Level</p>
                    <p className="font-mono font-semibold text-green-400">
                      {pool.shield}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-2">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pool.status === 'active'
                        ? 'bg-green-900 text-green-200'
                        : pool.status === 'paused'
                          ? 'bg-yellow-900 text-yellow-200'
                          : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
                  </span>
                </div>

                <button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded transition-colors">
                  💱 Trade This Pool
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {pools.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No SSP pools available
        </div>
      )}
    </div>
  )
}
