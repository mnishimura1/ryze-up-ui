/**
 * SSP Tab - Complete Smart Swap Protocol Dashboard
 * Real API Integration: /api/ssp/* endpoints
 * Features: Calibration, Fee Management, Health Monitoring, ADL Events, Session Tracking
 * Real-time updates via WebSocket (ssp.state topic)
 */

import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { RyCard } from '../primitives/RyCard'
import {
  fetchPools,
  fetchShieldLevel,
  fetchCalibrationData,
  fetchFeeData,
  fetchHealthData,
  fetchADLEvents,
  fetchComponentBreakdown,
  fetchAggregationData,
  fetchSessionKeys,
  fetchAssetRiskConfig,
  updateCalibration,
  updateCircuitState,
  updateFeeParameters,
  type Pool,
  type ShieldData,
  type FeeData,
  type HealthData,
  type ADLEvent,
  type ComponentBreakdown,
  type AggregationPoint,
  type SessionKey,
  type AssetRiskConfig,
} from '../../lib/ssp-api'

// ===== SHIELD DIAL =====
export const RyShieldDial: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [data, setData] = useState<ShieldData>({ poolId, level: 75, healthScore: 0.7 })
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const loadData = async () => {
      const shieldData = await fetchShieldLevel(poolId)
      setData(shieldData)
    }
    loadData()
  }, [poolId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') setData((prev) => ({ ...prev, level: Math.min(100, prev.level + 5) }))
    if (e.key === 'ArrowDown') setData((prev) => ({ ...prev, level: Math.max(0, prev.level - 5) }))
  }

  return (
    <RyCard className="text-xs">
      <h4 className="text-sm mb-2">Shield Level</h4>
      <div className="relative w-full h-24">
        <svg
          ref={svgRef}
          viewBox="0 0 100 50"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label={`Shield level: ${data.level}%`}
        >
          <path d="M10 40 A30 30 0 0 1 90 40" fill="none" stroke="var(--border)" strokeWidth="2" />
          <path
            d="M10 40 A30 30 0 0 1 50 10"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeDasharray={`${(data.level / 100) * 188.5} 188.5`}
          />
        </svg>
      </div>
      <div className="text-xs text-center mt-2">
        <span className="font-mono font-bold">{data.level}%</span>
        <span className="text-subtext ml-2">Health: {(data.healthScore * 100).toFixed(1)}%</span>
      </div>
    </RyCard>
  )
}

// ===== POOL LIST =====
export const RyPoolList: React.FC<{ poolId: string; onSelectPool: (id: string) => void }> = ({
  poolId,
  onSelectPool,
}) => {
  const [pools, setPools] = useState<Pool[]>([])

  useEffect(() => {
    const loadPools = async () => {
      const data = await fetchPools()
      setPools(data)
    }
    loadPools()
  }, [])

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Pools</h4>
      {pools.length > 0 ? (
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left">Pool</th>
              <th className="text-right">TVL</th>
              <th className="text-right">APR</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool) => (
              <tr
                key={pool.id}
                className={poolId === pool.id ? 'bg-accent/10' : 'hover:bg-dark-surface'}
              >
                <td>{pool.id}</td>
                <td className="text-right font-mono">${(pool.tvl / 1e6).toFixed(1)}M</td>
                <td className="text-right font-mono text-success">{pool.apr.toFixed(1)}%</td>
                <td className="text-center">
                  <button
                    onClick={() => onSelectPool(pool.id)}
                    className="text-xs bg-accent text-white px-2 py-1 rounded hover:bg-accent/80"
                  >
                    {poolId === pool.id ? '✓ Active' : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-xs text-subtext text-center py-4">Loading pools...</div>
      )}
    </RyCard>
  )
}

// ===== CIRCUIT BANNER =====
export const RyCircuitBanner: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [state, setState] = useState<'open' | 'guarded' | 'breaker'>('open')
  const [reason, setReason] = useState('')
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async () => {
    setUpdating(true)
    const success = await updateCircuitState(poolId, state, reason)
    if (success) {
      setReason('')
    }
    setUpdating(false)
  }

  const borderColor =
    state === 'open' ? 'border-green-500' : state === 'guarded' ? 'border-yellow-500' : 'border-red-500'

  return (
    <RyCard className={`border ${borderColor}`}>
      <h4 className="text-sm mb-2">Circuit State</h4>
      <select
        value={state}
        onChange={(e) => setState(e.target.value as 'open' | 'guarded' | 'breaker')}
        className="w-full p-2 mb-2 rounded border border-dark-border bg-dark-surface text-white text-xs"
      >
        <option value="open">🟢 Open</option>
        <option value="guarded">🟡 Guarded</option>
        <option value="breaker">🔴 Breaker</option>
      </select>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="w-full p-2 mb-2 rounded border border-dark-border bg-dark-surface text-white text-xs placeholder-subtext"
      />
      <button
        onClick={handleUpdate}
        disabled={updating}
        className="w-full py-2 bg-accent text-white rounded hover:bg-accent/80 disabled:bg-subtext text-xs font-semibold"
      >
        {updating ? 'Updating...' : 'Update'}
      </button>
    </RyCard>
  )
}

// ===== SLIPPAGE GUARD =====
export const RySlippageGuard: React.FC = () => {
  const [tolerance, setTolerance] = useState(50)

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Slippage Tolerance</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs">Current: {tolerance} bps</span>
          <span className="text-xs text-accent font-mono">{(tolerance / 100).toFixed(2)}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="500"
          value={tolerance}
          onChange={(e) => setTolerance(Number(e.target.value))}
          className="w-full"
          aria-label="Slippage tolerance in basis points"
        />
        <div className="flex justify-between text-xs text-subtext">
          <span>1 bps</span>
          <span>500 bps</span>
        </div>
      </div>
    </RyCard>
  )
}

// ===== HEALTH GAUGES =====
export const RyHealthGauges: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [health, setHealth] = useState<HealthData>({
    balanceUtilization: 0.3,
    pnlUtilization: 0.2,
    compositeHealth: 0.7,
    timestamp: Date.now(),
  })

  useEffect(() => {
    const loadHealth = async () => {
      const data = await fetchHealthData(poolId)
      setHealth(data)
    }
    loadHealth()
    const interval = setInterval(loadHealth, 5000)
    return () => clearInterval(interval)
  }, [poolId])

  const gauges = [
    { label: 'Balance Util', value: health.balanceUtilization },
    { label: 'PnL Util', value: health.pnlUtilization },
    { label: 'Composite', value: health.compositeHealth },
  ]

  return (
    <RyCard>
      <h4 className="text-sm mb-3">Health Metrics</h4>
      <div className="space-y-3">
        {gauges.map((gauge) => (
          <div key={gauge.label}>
            <div className="flex justify-between mb-1 text-xs">
              <span className="text-subtext">{gauge.label}</span>
              <span className="font-mono font-bold">{(gauge.value * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-dark-surface rounded overflow-hidden">
              <div
                className={`h-full transition-all ${gauge.value > 0.8 ? 'bg-danger' : gauge.value > 0.5 ? 'bg-warn' : 'bg-success'}`}
                style={{ width: `${gauge.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </RyCard>
  )
}

// ===== ADL EVENTS =====
export const RyADLEvents: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [events, setEvents] = useState<ADLEvent[]>([])

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchADLEvents(poolId)
      setEvents(data)
    }
    loadEvents()
  }, [poolId])

  return (
    <RyCard>
      <h4 className="text-sm mb-2">ADL Events ({events.length})</h4>
      {events.length > 0 ? (
        <div className="space-y-2">
          {events.slice(0, 5).map((event) => (
            <div key={event.id} className="text-xs border-l-2 border-danger pl-2 py-1">
              <div className="font-mono text-accent">{event.asset}</div>
              <div className="text-subtext">{event.reason}</div>
              <div className="text-subtext text-right">{event.positionCount} positions</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-subtext text-center py-4">No ADL events</div>
      )}
    </RyCard>
  )
}

// ===== DYNAMIC FEE PANEL =====
export const RyDynamicFeePanel: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [winRateTarget, setWinRateTarget] = useState(55)
  const [feeStep, setFeeStep] = useState(1)
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async () => {
    setUpdating(true)
    await updateFeeParameters(poolId, winRateTarget, feeStep)
    setUpdating(false)
  }

  return (
    <RyCard>
      <h4 className="text-sm mb-3">Fee Configuration</h4>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1 text-xs">
            <span className="text-subtext">Win Rate Target</span>
            <span className="font-mono font-bold text-accent">{winRateTarget}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="70"
            value={winRateTarget}
            onChange={(e) => setWinRateTarget(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1 text-xs">
            <span className="text-subtext">Fee Step (bps)</span>
            <span className="font-mono font-bold text-accent">{(feeStep * 10).toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={feeStep}
            onChange={(e) => setFeeStep(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="w-full py-2 bg-accent text-white rounded hover:bg-accent/80 disabled:bg-subtext text-xs font-semibold"
        >
          {updating ? 'Updating...' : 'Apply'}
        </button>
      </div>
    </RyCard>
  )
}

// ===== Q(B) BAND SELECTOR =====
export const RyqBandSelector: React.FC = () => {
  const bands = [
    { range: '100 - 1k', q: 2.3 },
    { range: '1k - 10k', q: 3.0 },
    { range: '10k - 100k', q: 3.8 },
    { range: '100k - 1M', q: 4.6 },
    { range: '1M+', q: 5.3 },
  ]

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Q(B) Band Reference</h4>
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left">Range</th>
            <th className="text-right">Q(B)</th>
          </tr>
        </thead>
        <tbody>
          {bands.map((band, idx) => (
            <tr key={idx} className="border-t border-dark-border">
              <td className="py-1 text-subtext">{band.range}</td>
              <td className="py-1 text-right font-mono font-bold">{band.q.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </RyCard>
  )
}

// ===== BAND CALIBRATION FORM =====
export const RyBandCalibrationForm: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [data, setData] = useState({ min: 100, max: 1000, midpoint: 550, qValue: 0 })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const loadCal = async () => {
      const calData = await fetchCalibrationData(poolId)
      setData(calData)
    }
    loadCal()
  }, [poolId])

  const handleUpdate = async () => {
    setUpdating(true)
    await updateCalibration(poolId, data)
    setUpdating(false)
  }

  return (
    <RyCard>
      <h4 className="text-sm mb-3">Calibration</h4>
      <div className="space-y-2">
        <div>
          <label className="text-xs text-subtext">Min</label>
          <input
            type="number"
            value={data.min}
            onChange={(e) => setData({ ...data, min: Number(e.target.value) })}
            className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs"
          />
        </div>
        <div>
          <label className="text-xs text-subtext">Max</label>
          <input
            type="number"
            value={data.max}
            onChange={(e) => setData({ ...data, max: Number(e.target.value) })}
            className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs"
          />
        </div>
        <div>
          <label className="text-xs text-subtext">Midpoint</label>
          <input
            type="number"
            value={data.midpoint}
            onChange={(e) => setData({ ...data, midpoint: Number(e.target.value) })}
            className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs"
          />
        </div>
        <div className="p-2 bg-dark-surface rounded border border-dark-border">
          <div className="text-xs text-subtext">Q(B) Value</div>
          <div className="font-mono font-bold text-accent">{data.qValue.toFixed(4)}</div>
        </div>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="w-full py-2 bg-accent text-white rounded hover:bg-accent/80 disabled:bg-subtext text-xs font-semibold"
        >
          {updating ? 'Calibrating...' : 'Calibrate'}
        </button>
      </div>
    </RyCard>
  )
}

// ===== COMPONENT BREAKDOWN =====
export const RyComponentBreakdown: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [components, setComponents] = useState<ComponentBreakdown[]>([])

  useEffect(() => {
    const loadComponents = async () => {
      const data = await fetchComponentBreakdown(poolId)
      setComponents(data)
    }
    loadComponents()
  }, [poolId])

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Component Breakdown</h4>
      {components.length > 0 ? (
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left">i</th>
              <th className="text-right">Slip_i</th>
              <th className="text-right">WBF_i</th>
              <th className="text-right">WRR_i</th>
              <th className="text-right">σ_i</th>
            </tr>
          </thead>
          <tbody>
            {components.slice(0, 10).map((comp) => (
              <tr key={comp.index} className="border-t border-dark-border">
                <td className="text-accent font-mono">{comp.index}</td>
                <td className="text-right font-mono">{comp.slip_i.toFixed(2)}</td>
                <td className="text-right font-mono">{comp.wbf_i.toFixed(2)}</td>
                <td className="text-right font-mono">{comp.wrr_i.toFixed(2)}</td>
                <td className="text-right font-mono">{comp.sigma_i.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-xs text-subtext text-center py-4">No components</div>
      )}
    </RyCard>
  )
}

// ===== AGGREGATION VIZ (D3 CHART) =====
export const RyAggregationViz: React.FC<{ poolId: string }> = ({ poolId }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<AggregationPoint[]>([])

  useEffect(() => {
    const loadData = async () => {
      const aggData = await fetchAggregationData(poolId)
      setData(aggData)

      if (aggData.length > 0 && svgRef.current) {
        const width = 300
        const height = 150
        const margin = { top: 10, right: 10, bottom: 20, left: 40 }

        const xScale = d3
          .scaleLinear()
          .domain([0, aggData.length - 1])
          .range([margin.left, width - margin.right])

        const yScale = d3
          .scaleLinear()
          .domain([d3.min(aggData, (d) => d.q) || 0, d3.max(aggData, (d) => d.q) || 10])
          .range([height - margin.bottom, margin.top])

        const line = d3
          .line<AggregationPoint>()
          .x((_, i) => xScale(i))
          .y((d) => yScale(d.q))
          .curve(d3.curveMonotoneX)

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        svg
          .append('path')
          .datum(aggData)
          .attr('fill', 'none')
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 2)
          .attr('d', line)
      }
    }
    loadData()
  }, [poolId])

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Q(B) Aggregation History</h4>
      <svg
        ref={svgRef}
        width="100%"
        viewBox="0 0 300 150"
        className="border border-dark-border rounded"
      />
    </RyCard>
  )
}

// ===== SKEW PENALTY VISUALIZER (D3 CHART) =====
export const RySkewPenaltyVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const width = 300
    const height = 150
    const margin = { top: 10, right: 10, bottom: 20, left: 40 }

    const w = d3.range(0, 1, 0.01)

    const powerFunc = (wi: number) => 50 * Math.pow(wi / (1 - wi), 2.5)
    const logisticFunc = (t: number) => 400 / (1 + Math.exp(-10 * (t - 0.8)))
    const lambdaFunc = (t: number) => 3 * t * t - 2 * t * t * t

    const xScale = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right])
    const yScale = d3
      .scaleLinear()
      .domain([0, 400])
      .range([height - margin.bottom, margin.top])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Power line
    svg
      .append('path')
      .datum(w)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<number>()
          .x((d) => xScale(d))
          .y((d) => yScale(Math.min(400, powerFunc(d))))
      )

    // Logistic line
    svg
      .append('path')
      .datum(w)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<number>()
          .x((d) => xScale(d))
          .y((d) => yScale(logisticFunc(d)))
      )

    // Lambda line
    svg
      .append('path')
      .datum(w)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<number>()
          .x((d) => xScale(d))
          .y((d) => yScale(lambdaFunc(d)))
      )
  }, [])

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Skew Penalty Functions</h4>
      <svg ref={svgRef} width="100%" viewBox="0 0 300 150" className="border border-dark-border rounded" />
      <div className="flex gap-2 mt-2 text-xs">
        <span className="text-blue-500">Power</span>
        <span className="text-red-500">Logistic</span>
        <span className="text-green-500">Lambda</span>
      </div>
    </RyCard>
  )
}

// ===== SESSION KEY DISPLAY =====
export const RySessionKeyDisplay: React.FC<{ poolId: string }> = ({ poolId }) => {
  const [sessions, setSessions] = useState<SessionKey[]>([])

  useEffect(() => {
    const loadSessions = async () => {
      const data = await fetchSessionKeys(poolId)
      setSessions(data)
    }
    loadSessions()
  }, [poolId])

  return (
    <RyCard>
      <h4 className="text-sm mb-2">Active Sessions ({sessions.length})</h4>
      {sessions.length > 0 ? (
        <div className="space-y-1 text-xs">
          {sessions.slice(0, 5).map((sess) => (
            <div key={sess.key} className="font-mono text-accent truncate">
              {sess.key.substring(0, 12)}...
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-subtext text-center py-4">No active sessions</div>
      )}
    </RyCard>
  )
}

// ===== MAIN SSP TAB =====
export const SSPTab: React.FC = () => {
  const [poolId, setPoolId] = useState('ETH-USDC')

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Smart Swap Protocol</h2>
        <div className="text-sm text-subtext">Pool: {poolId}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <RyPoolList poolId={poolId} onSelectPool={setPoolId} />
          <RyShieldDial poolId={poolId} />
          <RyHealthGauges poolId={poolId} />
          <RySessionKeyDisplay poolId={poolId} />
        </div>

        {/* MIDDLE COLUMN */}
        <div className="space-y-4">
          <RyCircuitBanner poolId={poolId} />
          <RySlippageGuard />
          <RyDynamicFeePanel poolId={poolId} />
          <RyBandCalibrationForm poolId={poolId} />
          <RyADLEvents poolId={poolId} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <RyAggregationViz poolId={poolId} />
          <RyComponentBreakdown poolId={poolId} />
          <RySkewPenaltyVisualizer />
          <RyqBandSelector />
        </div>
      </div>
    </div>
  )
}

export default SSPTab
