import React, { useState, useMemo } from 'react'

interface UnclaimedRefund {
  id: string
  tradeId: string
  amount: number
  venue: string
  timestamp: number
  merkleProof: string[]
  status: 'unclaimed' | 'claiming' | 'claimed'
}

export const RyRefundClaimer: React.FC = () => {
  // Mock data - in production, fetch from WS or /api/refunds/unclaimed
  const unclaimedRefunds: UnclaimedRefund[] = useMemo(
    () => [
      {
        id: '1',
        tradeId: '5a9c1e',
        amount: 42.5,
        venue: 'Uniswap V3',
        timestamp: Date.now() - 86400000,
        merkleProof: [
          '0x1234...5678',
          '0xabcd...ef01',
          '0x9876...5432',
        ],
        status: 'unclaimed',
      },
      {
        id: '2',
        tradeId: '3b7f8d',
        amount: 28.75,
        venue: 'Aerodrome',
        timestamp: Date.now() - 172800000,
        merkleProof: [
          '0x2345...6789',
          '0xbcde...f012',
        ],
        status: 'unclaimed',
      },
      {
        id: '3',
        tradeId: '2c6e4a',
        amount: 15.3,
        venue: 'Balancer',
        timestamp: Date.now() - 259200000,
        merkleProof: ['0x3456...789a'],
        status: 'unclaimed',
      },
    ],
    []
  )

  const [claimingIds, setClaimingIds] = useState<Set<string>>(new Set())
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set())

  const totalClaimable = useMemo(() => {
    return unclaimedRefunds
      .filter((r) => !claimedIds.has(r.id))
      .reduce((sum, r) => sum + r.amount, 0)
  }, [unclaimedRefunds, claimedIds])

  const claimRefund = async (refund: UnclaimedRefund) => {
    setClaimingIds((prev) => new Set(prev).add(refund.id))

    try {
      // In production, this would:
      // 1. Verify Merkle proof
      // 2. Call smart contract with proof
      // 3. Wait for tx confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setClaimedIds((prev) => new Set(prev).add(refund.id))
      console.log(`Claimed refund: ${refund.id}`)
    } catch (error) {
      console.error('Failed to claim refund:', error)
    } finally {
      setClaimingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(refund.id)
        return newSet
      })
    }
  }

  const unclaimedToDisplay = unclaimedRefunds.filter(
    (r) => !claimedIds.has(r.id)
  )

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="Unclaimed refunds"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Unclaimed Refunds</h3>
        <div className="text-sm text-slate-400">
          {unclaimedToDisplay.length} pending
        </div>
      </div>

      {/* Total Claimable Card */}
      {unclaimedToDisplay.length > 0 && (
        <div className="bg-gradient-to-br from-green-900/30 to-slate-800 rounded-lg p-4 border border-green-700/30">
          <p className="text-sm text-green-300 mb-1">Total Claimable</p>
          <p className="text-3xl font-bold text-green-400 font-mono">
            ${totalClaimable.toFixed(2)}
          </p>
        </div>
      )}

      {/* Refund List */}
      <div
        role="list"
        className="space-y-3"
      >
        {unclaimedToDisplay.map((refund) => {
          const isClaiming = claimingIds.has(refund.id)
          const daysAgo = Math.floor(
            (Date.now() - refund.timestamp) / (1000 * 60 * 60 * 24)
          )

          return (
            <div
              key={refund.id}
              role="listitem"
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-green-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-semibold text-white">
                      Trade #{refund.tradeId}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                      {refund.venue}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    {daysAgo} day{daysAgo !== 1 ? 's' : ''} ago
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-green-400 font-mono">
                    +${refund.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Merkle Proof Details */}
              <div className="mt-3 pt-3 border-t border-slate-700">
                <details className="group">
                  <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-300 transition-colors">
                    📋 Merkle Proof ({refund.merkleProof.length} hashes)
                  </summary>
                  <div className="mt-2 space-y-1 pl-3">
                    {refund.merkleProof.map((hash, idx) => (
                      <p
                        key={idx}
                        className="text-xs font-mono text-slate-500 break-all"
                      >
                        {hash}
                      </p>
                    ))}
                  </div>
                </details>
              </div>

              {/* Claim Button */}
              <button
                onClick={() => claimRefund(refund)}
                disabled={isClaiming}
                className={`w-full mt-4 py-2 px-3 rounded font-semibold transition-colors text-sm ${
                  isClaiming
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                aria-busy={isClaiming}
                aria-label={`Claim $${refund.amount} refund from ${refund.venue}`}
              >
                {isClaiming ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span> Claiming...
                  </>
                ) : (
                  `✅ Claim $${refund.amount.toFixed(2)}`
                )}
              </button>
            </div>
          )
        })}
      </div>

      {unclaimedToDisplay.length === 0 && !claimedIds.size && (
        <div className="text-center py-8 text-slate-400">
          No unclaimed refunds
        </div>
      )}

      {claimedIds.size > 0 && (
        <div className="bg-green-900/20 border border-green-700/50 rounded px-4 py-3 text-sm text-green-300">
          ✅ Successfully claimed {claimedIds.size} refund{claimedIds.size !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
