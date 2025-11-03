/**
 * Order Flow Intelligence (OFI) Tab - Complete Dashboard
 * MEV Detection, Slicing Intelligence, Execution Analysis, Flow Tracking
 */

import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { RyCard } from '../primitives/RyCard'
import {
  fetchOrderFlowEvents,
  detectMEV,
  getFlowMetrics,
  getSlicingStrategy,
  getLiquidationEvents,
  estimateSlippage,
  checkSandwichRisk,
  getHistoricalFlowComparison,
  subscribeOrderFlow,
  subscribeMEVAlerts,
  type OrderFlowEvent,
  type MEVOpportunity,
  type FlowMetrics,
  type LiquidationEvent,
} from '../../lib/ofi-api'

// ===== REAL-TIME ORDER FLOW STREAM =====
export const RyOrderFlowStream: React.FC = () => {
  const [events, setEvents] = useState<OrderFlowEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const data = await fetchOrderFlowEvents(20)
      setEvents(data)
      setLoading(false)
    }

    loadEvents()
    const unsubscribe = subscribeOrderFlow((event) => {
      setEvents((prev) => [event, ...prev.slice(0, 19)])
    })

    const interval = setInterval(loadEvents, 3000)
    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  return (
    <RyCard>
      <h4 className="text-sm mb-3">🔄 Real-Time Order Flow</h4>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-2 bg-dark-surface rounded border border-dark-border text-xs">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${event.side === 'buy' ? 'text-success' : 'text-danger'}`}>
                    {event.side.toUpperCase()}
                  </span>
                  <span className="font-mono">{event.amount.toFixed(2)} {event.token}</span>
                  <span className={`px-1 rounded text-xs ${
                    event.mevRisk === 'low'
                      ? 'bg-success/20 text-success'
                      : event.mevRisk === 'medium'
                        ? 'bg-warn/20 text-warn'
                        : event.mevRisk === 'high'
                          ? 'bg-danger/20 text-danger'
                          : 'bg-critical/20 text-critical'
                  }`}>
                    {event.mevRisk.toUpperCase()}
                  </span>
                </div>
                <span className="text-subtext">{event.venue}</span>
              </div>
              <div className="flex justify-between text-subtext text-xs">
                <span>${event.price.toFixed(2)}</span>
                <span>{((Date.now() - event.timestamp) / 1000).toFixed(1)}s ago</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-subtext text-center py-4">{loading ? 'Loading...' : 'No events'}</div>
        )}
      </div>
    </RyCard>
  )
}

// ===== MEV OPPORTUNITY DETECTOR =====
export const RyMEVDetector: React.FC = () => {
  const [opportunities, setOpportunities] = useState<MEVOpportunity[]>([])
  const [totalMEV, setTotalMEV] = useState(0)

  useEffect(() => {
    const loadMEV = async () => {
      const data = await detectMEV()
      setOpportunities(data.slice(0, 10))
      setTotalMEV(data.reduce((sum, opp) => sum + opp.profit, 0))
    }

    loadMEV()
    const unsubscribe = subscribeMEVAlerts((event) => {
      setOpportunities((prev) => [event, ...prev.slice(0, 9)])
      setTotalMEV((prev) => prev + event.profit)
    })

    const interval = setInterval(loadMEV, 5000)
    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  return (
    <RyCard>
      <h4 className="text-sm mb-3">🎯 MEV Opportunities Detected</h4>
      <div className="mb-3 p-2 bg-dark-surface rounded border border-danger/30">
        <div className="text-subtext text-xs mb-1">Total MEV Value</div>
        <div className="text-2xl font-bold text-danger">${totalMEV.toFixed(2)}</div>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {opportunities.map((opp) => (
          <div key={opp.id} className="p-2 bg-dark-surface rounded border border-dark-border text-xs">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-accent">{opp.type.toUpperCase()}</span>
              <span className={`font-mono font-bold ${opp.profit > 1000 ? 'text-danger' : 'text-warn'}`}>
                ${opp.profit.toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-subtext">
              <span>Execution: ${opp.executionPrice.toFixed(2)}</span>
              <span>Impact: {opp.impactBps.toFixed(2)} bps</span>
            </div>
          </div>
        ))}
      </div>
    </RyCard>
  )
}

// ===== FLOW METRICS PANEL =====
export const RyFlowMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<FlowMetrics | null>(null)

  useEffect(() => {
    const loadMetrics = async () => {
      const data = await getFlowMetrics()
      setMetrics(data)
    }

    loadMetrics()
    const interval = setInterval(loadMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!metrics) return <RyCard><div className="text-xs text-subtext">Loading...</div></RyCard>

  return (
    <RyCard>
      <h4 className="text-sm mb-3">📊 Flow Metrics (24h)</h4>
      <div className="space-y-3">
        {/* Volume */}
        <div>
          <div className="flex justify-between mb-1 text-xs">
            <span className="text-subtext">Total Volume</span>
            <span className="font-mono font-bold">${(metrics.totalVolume24h / 1e6).toFixed(2)}M</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="flex-1 h-2 bg-dark-surface rounded overflow-hidden flex">
              <div
                className="h-full bg-success"
                style={{ width: `${(metrics.buyVolume / metrics.totalVolume24h) * 100}%` }}
              />
              <div
                className="h-full bg-danger"
                style={{ width: `${(metrics.sellVolume / metrics.totalVolume24h) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-subtext mt-1">
            <span>Buy: ${(metrics.buyVolume / 1e6).toFixed(2)}M</span>
            <span>Sell: ${(metrics.sellVolume / 1e6).toFixed(2)}M</span>
          </div>
        </div>

        {/* Buy Pressure */}
        <div>
          <div className="flex justify-between mb-1 text-xs">
            <span className="text-subtext">Buy Pressure</span>
            <span className="font-mono font-bold text-accent">{(metrics.buyPressure * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-dark-surface rounded overflow-hidden">
            <div
              className={`h-full ${metrics.buyPressure > 0.6 ? 'bg-success' : metrics.buyPressure > 0.4 ? 'bg-warn' : 'bg-danger'}`}
              style={{ width: `${metrics.buyPressure * 100}%` }}
            />
          </div>
        </div>

        {/* Events */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dark-border">
          <div className="text-center">
            <div className="text-xs text-subtext">MEV Detected</div>
            <div className="font-bold text-danger text-lg">{metrics.mevDetected}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-subtext">Liquidations</div>
            <div className="font-bold text-warn text-lg">{metrics.liquidationCount}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-subtext">Flash Loans</div>
            <div className="font-bold text-accent text-lg">{metrics.flashLoanCount}</div>
          </div>
        </div>

        {/* Average Slippage */}
        <div className="p-2 bg-dark-surface rounded border border-dark-border">
          <div className="text-xs text-subtext mb-1">Avg Slippage</div>
          <div className="font-mono font-bold text-accent">{metrics.averageSlippage.toFixed(2)} bps</div>
        </div>
      </div>
    </RyCard>
  )
}

// ===== SANDWICH RISK ANALYZER =====
export const RySandwichRiskAnalyzer: React.FC = () => {
  const [amount, setAmount] = useState(10000)
  const [token, setToken] = useState('ETH')
  const [riskScore, setRiskScore] = useState(0)
  const [slippageEst, setSlippageEst] = useState(0)

  useEffect(() => {
    const analyze = async () => {
      const risk = await checkSandwichRisk(amount, token)
      const slippage = await estimateSlippage(amount, token)
      setRiskScore(risk)
      setSlippageEst(slippage.slippageBps)
    }

    const timer = setTimeout(analyze, 300)
    return () => clearTimeout(timer)
  }, [amount, token])

  return (
    <RyCard>
      <h4 className="text-sm mb-3">⚠️ Sandwich Risk Analyzer</h4>
      <div className="space-y-3">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-subtext mb-1 block">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-subtext mb-1 block">Token</label>
            <select
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs"
            >
              <option>ETH</option>
              <option>BTC</option>
              <option>USDC</option>
              <option>DAI</option>
            </select>
          </div>
        </div>

        {/* Risk Score */}
        <div>
          <div className="flex justify-between mb-1 text-xs">
            <span className="text-subtext">Sandwich Risk</span>
            <span
              className={`font-bold ${
                riskScore < 30 ? 'text-success' : riskScore < 60 ? 'text-warn' : 'text-danger'
              }`}
            >
              {riskScore}/100
            </span>
          </div>
          <div className="w-full h-2 bg-dark-surface rounded overflow-hidden">
            <div
              className={`h-full ${
                riskScore < 30 ? 'bg-success' : riskScore < 60 ? 'bg-warn' : 'bg-danger'
              }`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-subtext">
            {riskScore < 30
              ? '✓ Low risk - Safe to execute'
              : riskScore < 60
                ? '⚠ Medium risk - Consider slicing'
                : '✗ High risk - Use MEV protection'}
          </div>
        </div>

        {/* Slippage */}
        <div className="p-2 bg-dark-surface rounded border border-dark-border">
          <div className="text-xs text-subtext mb-1">Estimated Slippage</div>
          <div className="font-mono font-bold text-accent">{slippageEst.toFixed(2)} bps</div>
        </div>
      </div>
    </RyCard>
  )
}

// ===== SLICING INTELLIGENCE =====
export const RySlicingIntelligence: React.FC = () => {
  const [strategy, setStrategy] = useState<any>(null)
  const [amount, setAmount] = useState(100000)
  const [token, setToken] = useState('ETH')

  useEffect(() => {
    const loadStrategy = async () => {
      const data = await getSlicingStrategy(amount, token)
      setStrategy(data)
    }

    const timer = setTimeout(loadStrategy, 300)
    return () => clearTimeout(timer)
  }, [amount, token])

  if (!strategy)
    return (
      <RyCard>
        <h4 className="text-sm mb-3">⚡ Smart Slicing Strategy</h4>
        <div className="text-xs text-subtext text-center py-4">Loading...</div>
      </RyCard>
    )

  return (
    <RyCard>
      <h4 className="text-sm mb-3">⚡ Smart Slicing Strategy</h4>
      <div className="space-y-3">
        {/* Input */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount"
            className="p-1 rounded border border-dark-border bg-dark-surface text-white text-xs"
          />
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="p-1 rounded border border-dark-border bg-dark-surface text-white text-xs"
          >
            <option>ETH</option>
            <option>BTC</option>
            <option>USDC</option>
          </select>
        </div>

        {/* Recommendation */}
        <div className={`p-2 rounded border ${
          strategy.recommendation === 'aggressive'
            ? 'border-danger bg-danger/10'
            : strategy.recommendation === 'conservative'
              ? 'border-success bg-success/10'
              : 'border-warn bg-warn/10'
        }`}>
          <div className="text-xs text-subtext mb-1">Recommended Strategy</div>
          <div className="font-bold text-sm uppercase">{strategy.recommendation}</div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-dark-surface rounded">
            <div className="text-subtext mb-1">Slices</div>
            <div className="font-mono font-bold">{strategy.slices?.length || 0}</div>
          </div>
          <div className="p-2 bg-dark-surface rounded">
            <div className="text-subtext mb-1">Avg Slippage</div>
            <div className="font-mono font-bold text-accent">{strategy.averageSlippage?.toFixed(2) || 0} bps</div>
          </div>
        </div>

        {/* Slices */}
        {strategy.slices && strategy.slices.length > 0 && (
          <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
            {strategy.slices.map((slice: any, idx: number) => (
              <div key={idx} className="p-1 bg-dark-surface rounded text-xs">
                <div className="flex justify-between">
                  <span className="text-subtext">Slice {slice.sliceNumber}</span>
                  <span className="font-mono">{(slice.amount / amount * 100).toFixed(1)}%</span>
                </div>
                <div className="text-subtext text-xs">Delay: {slice.timing}ms</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RyCard>
  )
}

// ===== LIQUIDATION MONITOR =====
export const RyLiquidationMonitor: React.FC = () => {
  const [liquidations, setLiquidations] = useState<LiquidationEvent[]>([])
  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    const loadLiquidations = async () => {
      const data = await getLiquidationEvents(15)
      setLiquidations(data)
      setTotalProfit(data.reduce((sum, liq) => sum + liq.profitUSD, 0))
    }

    loadLiquidations()
    const interval = setInterval(loadLiquidations, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <RyCard>
      <h4 className="text-sm mb-3">💥 Liquidation Events</h4>
      <div className="mb-3 p-2 bg-dark-surface rounded">
        <div className="text-xs text-subtext mb-1">Total Liquidation Profit (24h)</div>
        <div className="text-xl font-bold text-danger">${totalProfit.toFixed(2)}</div>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {liquidations.length > 0 ? (
          liquidations.map((liq) => (
            <div key={liq.id} className="p-2 bg-dark-surface rounded border border-dark-border text-xs">
              <div className="flex justify-between mb-1">
                <span className="font-mono text-accent">{liq.collateral}</span>
                <span className="font-bold text-danger">${liq.profitUSD.toFixed(2)}</span>
              </div>
              <div className="text-subtext text-xs">
                {liq.collateralAmount.toFixed(2)} {liq.collateral} liquidated
              </div>
              <div className="text-subtext text-xs mt-1">{((Date.now() - liq.timestamp) / 1000).toFixed(0)}s ago</div>
            </div>
          ))
        ) : (
          <div className="text-xs text-subtext text-center py-4">No recent liquidations</div>
        )}
      </div>
    </RyCard>
  )
}

// ===== FLOW CHART (D3) =====
export const RyFlowChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [flowHistory, setFlowHistory] = useState<any[]>([])

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getHistoricalFlowComparison('24h')
      setFlowHistory(data)

      if (data.length > 0 && svgRef.current) {
        const width = 300
        const height = 150
        const margin = { top: 10, right: 10, bottom: 20, left: 40 }

        const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([margin.left, width - margin.right])
        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.volume) || 100])
          .range([height - margin.bottom, margin.top])

        const line = d3
          .line<any>()
          .x((_, i) => xScale(i))
          .y((d) => yScale(d.volume))
          .curve(d3.curveMonotoneX)

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        svg
          .append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 2)
          .attr('d', line)
      }
    }

    loadHistory()
  }, [])

  return (
    <RyCard>
      <h4 className="text-sm mb-2">📈 Order Flow Volume (24h)</h4>
      <svg ref={svgRef} width="100%" viewBox="0 0 300 150" className="border border-dark-border rounded" />
    </RyCard>
  )
}

// ===== MAIN OFI TAB =====
export const OFITab: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Flow Intelligence</h2>
        <div className="text-sm text-subtext">MEV · Slicing · Execution · Flow</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Row 1 */}
        <RyOrderFlowStream />
        <RyMEVDetector />

        {/* Row 2 */}
        <RyFlowMetrics />
        <RySandwichRiskAnalyzer />

        {/* Row 3 */}
        <RySlicingIntelligence />
        <RyLiquidationMonitor />

        {/* Row 4 - Full Width */}
        <div className="lg:col-span-2">
          <RyFlowChart />
        </div>
      </div>
    </div>
  )
}

export default OFITab
