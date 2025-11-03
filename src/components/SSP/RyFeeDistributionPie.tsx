import React, { useState, useEffect } from 'react'

interface FeeDistribution {
  source: string
  amount: number
  percentage: number
  color: string
}

export const RyFeeDistributionPie: React.FC = () => {
  const [fees, setFees] = useState<FeeDistribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await fetch('/api/ssp/fees')
        if (response.ok) {
          const data = await response.json()
          setFees(data || [])
        }
      } catch (error) {
        console.error('Failed to fetch fees:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFees()
  }, [])

  const total = fees.reduce((sum, f) => sum + f.amount, 0)

  if (loading || fees.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h4 className="text-sm font-semibold mb-4">Fee Distribution</h4>
        <div className="h-32 flex items-center justify-center text-slate-400">
          {loading ? 'Loading fees...' : 'No fee data'}
        </div>
      </div>
    )
  }

  let cumulativePercent = 0
  const slices = fees.map((f) => {
    const startPercent = cumulativePercent
    cumulativePercent += f.percentage
    const startAngle = (startPercent / 100) * 360 - 90
    const endAngle = (cumulativePercent / 100) * 360 - 90
    return { ...f, startAngle, endAngle }
  })

  const size = 120
  const radius = 50

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h4 className="text-sm font-semibold mb-4">Fee Distribution</h4>

      <div className="flex items-center justify-center mb-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, idx) => {
            const startRad = (slice.startAngle * Math.PI) / 180
            const endRad = (slice.endAngle * Math.PI) / 180
            const x1 = size / 2 + radius * Math.cos(startRad)
            const y1 = size / 2 + radius * Math.sin(startRad)
            const x2 = size / 2 + radius * Math.cos(endRad)
            const y2 = size / 2 + radius * Math.sin(endRad)
            const largeArc = slice.percentage > 50 ? 1 : 0

            return (
              <path
                key={idx}
                d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={slice.color}
                opacity="0.8"
                stroke="#1e293b"
                strokeWidth="1"
              />
            )
          })}
        </svg>
      </div>

      <div className="space-y-2">
        {fees.map((f, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: f.color }}
              />
              <span className="text-sm text-slate-300">{f.source}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-semibold">
                {f.percentage.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400 ml-2">
                ${f.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 mt-4 pt-4">
        <p className="text-sm text-slate-400">
          Total collected: <span className="font-semibold text-white">${total.toFixed(2)}</span>
        </p>
      </div>
    </div>
  )
}
