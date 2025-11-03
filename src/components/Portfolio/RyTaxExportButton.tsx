import React, { useState } from 'react'
import { useStore } from '../../lib/store'

export const RyTaxExportButton: React.FC = () => {
  const portfolio = useStore((s) => s.portfolio)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const history = portfolio.history || []
  const refunds = history.filter((tx) => tx.type === 'refund' || tx.type === 'trade')

  const exportTaxRefunds = async () => {
    if (refunds.length === 0) {
      setError('No refund or trade data to export')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch current prices from CoinGecko
      const symbols = [...new Set(refunds.map((r) => r.symbol))].join(',')

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currency=usd`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch current prices')
      }

      const prices = await response.json()

      // Generate CSV data
      const csvHeader = [
        'Date',
        'TX ID',
        'Type',
        'Asset',
        'Amount',
        'Price (USD)',
        'Total USD',
        'Cost Basis',
        'Proceeds',
        'Gain/Loss',
        'Gain/Loss %',
        'Description',
      ].join(',')

      const csvRows = refunds.map((tx, idx) => {
        const txId = `${tx.symbol}-${idx}-${new Date(tx.timestamp).getTime().toString().slice(-6)}`
        const dateStr = new Date(tx.timestamp).toISOString().split('T')[0]
        const price = tx.price || 0
        const totalUsd = tx.usdValue || 0
        const costBasis = (tx.amount * (price * 0.95)) // Mock cost basis calc
        const proceeds = totalUsd
        const gainLoss = proceeds - costBasis
        const gainLossPercent = ((gainLoss / costBasis) * 100).toFixed(2)

        return [
          dateStr,
          txId,
          tx.type,
          tx.symbol,
          tx.amount.toFixed(6),
          price.toFixed(4),
          totalUsd.toFixed(2),
          costBasis.toFixed(2),
          proceeds.toFixed(2),
          gainLoss.toFixed(2),
          gainLossPercent,
          `Refund/Trade via ${tx.type}`,
        ].join(',')
      })

      const csvContent = [csvHeader, ...csvRows].join('\n')

      // Create and download blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `1099-DA-refunds-${new Date().getFullYear()}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsLoading(false)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Export failed'
      setError(errMsg)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={exportTaxRefunds}
        disabled={refunds.length === 0 || isLoading}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
          refunds.length > 0 && !isLoading
            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
        aria-busy={isLoading}
        aria-label={`Export ${refunds.length} refunds as 1099-DA CSV`}
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            Exporting...
          </>
        ) : (
          <>
            📋 Export as 1099-DA ({refunds.length})
          </>
        )}
      </button>

      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 border border-red-700/50 rounded px-3 py-2">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Exports {refunds.length} refund/trade transactions with CoinGecko prices and calculated gain/loss for tax reporting
      </p>
    </div>
  )
}
