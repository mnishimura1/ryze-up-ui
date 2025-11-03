/**
 * Advanced SSP Analytics Components
 * Features: Fee Pie Chart, Error Histogram, CEX L2 Visualization, AMM Impact Simulator
 */

import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import axios from 'axios'
import { RyCard } from '../primitives/RyCard'
import {
  parseL2Depth,
  calculateAMMImpact,
  generateErrorHistogram,
  calculateFeeDistribution,
  solveQB,
  type BinanceL2Depth,
  type L2ParsedData,
  type AMMImpactResult,
  type FeeDistribution,
  type QBSolverResult,
} from '../../lib/ssp-solvers'

// ===== FEE DISTRIBUTION PIE CHART =====
export const RyFeeDistributionPie: React.FC<{ poolId: string; volume?: number }> = ({
  poolId,
  volume = 100000,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [fees, setFees] = useState<FeeDistribution>({
    protocolFee: 250,
    lpIncentive: 150,
    insurancePool: 100,
    total: 500,
    breakdown: [
      { name: 'Protocol', amount: 250, percentage: 50, color: '#3b82f6' },
      { name: 'LP Incentive', amount: 150, percentage: 30, color: '#10b981' },
      { name: 'Insurance', amount: 100, percentage: 20, color: '#f97316' },
    ],
  })

  useEffect(() => {
    const loadFees = async () => {
      try {
        const res = await axios.get(`/api/ssp/fees/${poolId}`)
        if (res.data?.distributions) {
          setFees(res.data)
        } else {
          setFees(calculateFeeDistribution(volume))
        }
      } catch {
        setFees(calculateFeeDistribution(volume))
      }
    }
    loadFees()
  }, [poolId, volume])

  useEffect(() => {
    if (!svgRef.current || !fees.breakdown) return

    const width = 250
    const height = 200
    const radius = Math.min(width, height) / 2 - 10

    const pie = d3.pie<{ percentage: number }>().value((d) => d.percentage)
    const arc = d3.arc<d3.PieArcDatum<{ percentage: number }>>().innerRadius(0).outerRadius(radius)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`)

    const arcs = pie(
      fees.breakdown.map((d) => ({
        ...d,
        percentage: d.percentage,
      }))
    )

    g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', (d) => arc(d) || '')
      .attr('fill', (d, i) => fees.breakdown[i]?.color || '#666')
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2)

    g.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d, i) => `${fees.breakdown[i]?.percentage.toFixed(0)}%`)
  }, [fees])

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Fee Distribution</h4>
      <svg
        ref={svgRef}
        width="100%"
        viewBox="0 0 250 200"
        className="border border-dark-border rounded"
        style={{ maxHeight: '200px' }}
      />
      <div className="mt-3 space-y-2 text-xs">
        {fees.breakdown.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-subtext">{item.name}</span>
            </div>
            <span className="font-mono font-bold">${item.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-dark-border pt-2 flex justify-between font-semibold">
          <span>Total Fees</span>
          <span className="text-accent">${fees.total.toFixed(2)}</span>
        </div>
      </div>
    </RyCard>
  )
}

// ===== CEX L2 DEPTH PARSER =====
export const RyCEXL2Parser: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [l2Data, setL2Data] = useState<L2ParsedData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchBinanceDepth = async () => {
    setLoading(true)
    try {
      // Try to fetch from backend first, otherwise call Binance directly
      let depth: BinanceL2Depth
      try {
        const res = await axios.get(`/api/ssp/binance-depth/${poolId}`)
        depth = res.data
      } catch {
        // Fallback: Fetch directly from Binance (CORS may block)
        const res = await axios.get('https://api.binance.com/api/v3/depth?symbol=ETHUSDT&limit=20')
        depth = {
          bids: res.data.bids.map((b: any) => [Number(b[0]), Number(b[1])]),
          asks: res.data.asks.map((a: any) => [Number(a[0]), Number(a[1])]),
          timestamp: Date.now(),
        }
      }

      const parsed = parseL2Depth(depth)
      setL2Data(parsed)
    } catch (err) {
      console.error('Failed to fetch L2 depth:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBinanceDepth()
    const interval = setInterval(fetchBinanceDepth, 5000)
    return () => clearInterval(interval)
  }, [poolId])

  if (!l2Data) {
    return (
      <RyCard>
        <h4 className="text-sm mb-2">CEX L2 Depth</h4>
        <div className="text-xs text-subtext text-center py-4">
          {loading ? 'Loading...' : 'No data'}
        </div>
      </RyCard>
    )
  }

  return (
    <RyCard>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold">CEX L2 Depth (Binance)</h4>
        <button
          onClick={fetchBinanceDepth}
          disabled={loading}
          className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="space-y-3 text-xs">
        {/* Price Info */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-dark-surface rounded">
          <div>
            <div className="text-subtext">Mid Price</div>
            <div className="font-mono font-bold text-accent">${l2Data.midPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-subtext">Spread</div>
            <div className="font-mono font-bold text-warn">{l2Data.spreadBps.toFixed(2)} bps</div>
          </div>
        </div>

        {/* Impact */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-dark-surface rounded">
          <div>
            <div className="text-subtext">$10k Impact</div>
            <div className="font-mono font-bold">{l2Data.impact10k.toFixed(2)} bps</div>
          </div>
          <div>
            <div className="text-subtext">$100k Impact</div>
            <div className={`font-mono font-bold ${l2Data.impact100k > 50 ? 'text-danger' : 'text-success'}`}>
              {l2Data.impact100k.toFixed(2)} bps
            </div>
          </div>
        </div>

        {/* VWAP */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-dark-surface rounded">
          <div>
            <div className="text-subtext">Bid VWAP</div>
            <div className="font-mono text-success">${l2Data.bidVWAP.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-subtext">Ask VWAP</div>
            <div className="font-mono text-danger">${l2Data.askVWAP.toFixed(2)}</div>
          </div>
        </div>

        {/* Liquidity */}
        <div className="p-2 bg-dark-surface rounded">
          <div className="text-subtext">Total Liquidity</div>
          <div className="font-mono font-bold text-accent">{l2Data.liquidity.toFixed(0)} units</div>
        </div>
      </div>
    </RyCard>
  )
}

// ===== AMM IMPACT SIMULATOR =====
export const RyAMMImpactSimulator: React.FC = () => {
  const [params, setParams] = useState({ reserveIn: 1000000, reserveOut: 1000000, amountIn: 10000 })
  const [results, setResults] = useState<AMMImpactResult | null>(null)

  useEffect(() => {
    const result = calculateAMMImpact({
      reserveIn: params.reserveIn,
      reserveOut: params.reserveOut,
      amountIn: params.amountIn,
    })
    setResults(result)
  }, [params])

  return (
    <RyCard>
      <h4 className="text-sm mb-3">AMM Impact Simulator</h4>

      <div className="space-y-3">
        {/* Reserve In */}
        <div>
          <label className="text-xs text-subtext mb-1 block">Reserve In (Token A)</label>
          <input
            type="number"
            value={params.reserveIn}
            onChange={(e) => setParams({ ...params, reserveIn: Number(e.target.value) })}
            className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono"
          />
        </div>

        {/* Reserve Out */}
        <div>
          <label className="text-xs text-subtext mb-1 block">Reserve Out (Token B)</label>
          <input
            type="number"
            value={params.reserveOut}
            onChange={(e) => setParams({ ...params, reserveOut: Number(e.target.value) })}
            className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono"
          />
        </div>

        {/* Amount In */}
        <div>
          <label className="text-xs text-subtext mb-1 block">Trade Amount (Token A)</label>
          <input
            type="number"
            value={params.amountIn}
            onChange={(e) => setParams({ ...params, amountIn: Number(e.target.value) })}
            className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono"
          />
        </div>

        {/* Results */}
        {results && (
          <div className="mt-3 p-2 bg-dark-surface rounded border border-dark-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-subtext">Amount Out:</span>
              <span className="font-mono font-bold">{results.amountOut.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-subtext">Execution Price:</span>
              <span className="font-mono font-bold">{results.executionPrice.toFixed(6)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-subtext">Price Impact:</span>
              <span className={`font-mono font-bold ${results.priceImpactBps > 50 ? 'text-danger' : 'text-success'}`}>
                {results.priceImpactBps.toFixed(2)} bps
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-subtext">Fee Amount (0.3%):</span>
              <span className="font-mono font-bold text-warn">{results.feeAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </RyCard>
  )
}

// ===== ERROR HISTOGRAM =====
export const RyErrorHistogram: React.FC<{ poolId: string }> = ({ poolId }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [errors, setErrors] = useState<number[]>([])

  useEffect(() => {
    const loadErrors = async () => {
      try {
        // Fetch historical prediction errors from API
        const res = await axios.get(`/api/ssp/error-history/${poolId}`)
        setErrors(res.data || generateMockErrors())
      } catch {
        // Generate mock data if API unavailable
        setErrors(generateMockErrors())
      }
    }

    loadErrors()
  }, [poolId])

  useEffect(() => {
    if (!svgRef.current || errors.length === 0) return

    const histogram = generateErrorHistogram(errors, 0.5)
    const width = 300
    const height = 150
    const margin = { top: 10, right: 10, bottom: 20, left: 40 }

    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(...histogram.map((h) => h.rangeEnd))])
      .range([margin.left, width - margin.right])

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...histogram.map((h) => h.count))])
      .range([height - margin.bottom, margin.top])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg
      .selectAll('rect')
      .data(histogram)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.rangeStart))
      .attr('y', (d) => yScale(d.count))
      .attr('width', (d) => xScale(d.rangeEnd) - xScale(d.rangeStart) - 1)
      .attr('height', (d) => height - margin.bottom - yScale(d.count))
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.7)
  }, [errors])

  const generateMockErrors = (): number[] => {
    return Array.from({ length: 100 }, () => (Math.random() - 0.5) * 2) // Random errors ±1 bps
  }

  const avgError = errors.length > 0 ? errors.reduce((a, b) => a + b) / errors.length : 0
  const maxError = errors.length > 0 ? Math.max(...errors.map((e) => Math.abs(e))) : 0
  const rmse = errors.length > 0 ? Math.sqrt(errors.reduce((a, b) => a + b * b) / errors.length) : 0

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Prediction Error Distribution</h4>
      <svg
        ref={svgRef}
        width="100%"
        viewBox="0 0 300 150"
        className="border border-dark-border rounded mb-3"
      />
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-subtext">Avg Error:</span>
          <span className="font-mono">{avgError.toFixed(3)} bps</span>
        </div>
        <div className="flex justify-between">
          <span className="text-subtext">Max Error:</span>
          <span className={`font-mono ${maxError > 1 ? 'text-danger' : 'text-success'}`}>{maxError.toFixed(3)} bps</span>
        </div>
        <div className="flex justify-between">
          <span className="text-subtext">RMSE:</span>
          <span className="font-mono">{rmse.toFixed(3)} bps</span>
        </div>
      </div>
    </RyCard>
  )
}

// ===== Q(B) SOLVER DISPLAY =====
export const RyQBSolverDisplay: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [solverParams, setSolverParams] = useState({
    min: 100,
    max: 1000,
    midpoint: 550,
  })
  const [result, setResult] = useState<QBSolverResult | null>(null)

  useEffect(() => {
    const result = solveQB({
      ...solverParams,
      ewmaAlpha: 0.3,
    })
    setResult(result)
  }, [solverParams])

  return (
    <RyCard>
      <h4 className="text-sm mb-3">Q(B) Solver (EWMA α=0.3)</h4>

      <div className="space-y-2">
        {/* Inputs */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-subtext">Min</label>
            <input
              type="number"
              value={solverParams.min}
              onChange={(e) => setSolverParams({ ...solverParams, min: Number(e.target.value) })}
              className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-subtext">Max</label>
            <input
              type="number"
              value={solverParams.max}
              onChange={(e) => setSolverParams({ ...solverParams, max: Number(e.target.value) })}
              className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-subtext">Midpoint</label>
            <input
              type="number"
              value={solverParams.midpoint}
              onChange={(e) => setSolverParams({ ...solverParams, midpoint: Number(e.target.value) })}
              className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono"
            />
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className={`p-2 rounded border ${result.valid ? 'border-success bg-success/10' : 'border-danger bg-danger/10'}`}>
            <div className="text-xs mb-2">{result.valid ? '✓' : '⚠'} {result.message}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-subtext">Raw Q(B):</span>
                <span className="font-mono font-bold">{result.qValue.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-subtext">Smoothed Q(B):</span>
                <span className="font-mono font-bold text-accent">{result.qValueSmoothed.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-subtext">Error:</span>
                <span className={`font-mono font-bold ${result.error < 0.0001 ? 'text-success' : 'text-warn'}`}>
                  {result.error.toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </RyCard>
  )
}

export default {
  RyFeeDistributionPie,
  RyCEXL2Parser,
  RyAMMImpactSimulator,
  RyErrorHistogram,
  RyQBSolverDisplay,
}
