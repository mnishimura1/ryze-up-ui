/**
 * Order Flow Intelligence (OFI) API Client
 * MEV detection, slicing analysis, execution metrics, flow tracking
 */

import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080'

// ===== TYPES =====
export interface OrderFlowEvent {
  id: string
  timestamp: number
  type: 'market_order' | 'limit_order' | 'sandwich' | 'flash_loan' | 'liquidation'
  token: string
  amount: number
  price: number
  side: 'buy' | 'sell'
  venue: string
  gasPrice: number
  mevRisk: 'low' | 'medium' | 'high' | 'critical'
  slippageEstimate: number
}

export interface MEVOpportunity {
  id: string
  type: 'frontrun' | 'backrun' | 'sandwich' | 'liquidation' | 'arbitrage'
  profit: number
  gasPrice: number
  riskLevel: 'low' | 'medium' | 'high'
  detectedAt: number
  executionPrice: number
  currentPrice: number
  impactBps: number
}

export interface OrderExecutionMetrics {
  orderId: string
  submittedAt: number
  executedAt: number
  executionTime: number // ms
  submittedPrice: number
  executedPrice: number
  slippage: number
  slippageBps: number
  gasUsed: number
  gasCost: number
  mevExtracted: number
  efficiency: number // 0-100
}

export interface FlowMetrics {
  totalVolume24h: number
  buyVolume: number
  sellVolume: number
  buyPressure: number // 0-1
  mevDetected: number
  averageSlippage: number
  largeOrderCount: number
  flashLoanCount: number
  liquidationCount: number
}

export interface SlicingStrategy {
  orderId: string
  originalAmount: number
  slices: Array<{
    sliceNumber: number
    amount: number
    timing: number // ms delay
    targetPrice: number
    executedPrice: number
    slippage: number
  }>
  totalExecutedAmount: number
  averageSlippage: number
  recommendation: 'aggressive' | 'balanced' | 'conservative'
}

export interface TokenFlow {
  token: string
  symbol: string
  price: number
  volume24h: number
  netFlow: number // positive = net inflow
  largeOrderCount: number
  avgOrderSize: number
  volatility: number // Standard deviation
  mevPressure: number // 0-100
  liquidationRisk: number // 0-100
}

export interface LiquidationEvent {
  id: string
  liquidatedAddress: string
  collateral: string
  collateralAmount: number
  debtToken: string
  debtAmount: number
  liquidator: string
  timestamp: number
  gasPrice: number
  profitUSD: number
  mevExtracted: number
}

// ===== API METHODS =====

/**
 * Fetch real-time order flow events
 */
export const fetchOrderFlowEvents = async (limit: number = 50): Promise<OrderFlowEvent[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/events`, { params: { limit } })
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch order flow events:', error)
    return []
  }
}

/**
 * Detect MEV opportunities
 */
export const detectMEV = async (): Promise<MEVOpportunity[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/mev-opportunities`)
    return response.data || []
  } catch (error) {
    console.error('Failed to detect MEV:', error)
    return []
  }
}

/**
 * Get execution metrics for an order
 */
export const getExecutionMetrics = async (orderId: string): Promise<OrderExecutionMetrics | null> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/execution/${orderId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch execution metrics for ${orderId}:`, error)
    return null
  }
}

/**
 * Get overall flow metrics
 */
export const getFlowMetrics = async (): Promise<FlowMetrics> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/flow-metrics`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch flow metrics:', error)
    return {
      totalVolume24h: 0,
      buyVolume: 0,
      sellVolume: 0,
      buyPressure: 0.5,
      mevDetected: 0,
      averageSlippage: 0,
      largeOrderCount: 0,
      flashLoanCount: 0,
      liquidationCount: 0,
    }
  }
}

/**
 * Get slicing strategy recommendation
 */
export const getSlicingStrategy = async (amount: number, token: string): Promise<SlicingStrategy> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/slicing-strategy`, {
      params: { amount, token },
    })
    return response.data
  } catch (error) {
    console.error('Failed to get slicing strategy:', error)
    return {
      orderId: '',
      originalAmount: amount,
      slices: [],
      totalExecutedAmount: 0,
      averageSlippage: 0,
      recommendation: 'balanced',
    }
  }
}

/**
 * Get token-specific flow analysis
 */
export const getTokenFlow = async (token: string): Promise<TokenFlow> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/token-flow/${token}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch token flow for ${token}:`, error)
    return {
      token,
      symbol: token.toUpperCase(),
      price: 0,
      volume24h: 0,
      netFlow: 0,
      largeOrderCount: 0,
      avgOrderSize: 0,
      volatility: 0,
      mevPressure: 0,
      liquidationRisk: 0,
    }
  }
}

/**
 * Track liquidation events
 */
export const getLiquidationEvents = async (limit: number = 20): Promise<LiquidationEvent[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/liquidations`, { params: { limit } })
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch liquidation events:', error)
    return []
  }
}

/**
 * Estimate slippage for a trade
 */
export const estimateSlippage = async (
  amount: number,
  token: string,
  venue: string = 'uniswap'
): Promise<{ slippage: number; slippageBps: number; estimatedOutAmount: number }> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/slippage-estimate`, {
      params: { amount, token, venue },
    })
    return response.data
  } catch (error) {
    console.error('Failed to estimate slippage:', error)
    return { slippage: 0, slippageBps: 0, estimatedOutAmount: 0 }
  }
}

/**
 * Check for sandwich attack risk
 */
export const checkSandwichRisk = async (amount: number, token: string): Promise<number> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/sandwich-risk`, {
      params: { amount, token },
    })
    return response.data.riskScore || 0 // 0-100
  } catch (error) {
    console.error('Failed to check sandwich risk:', error)
    return 0
  }
}

/**
 * Get MEV protection strategies
 */
export const getMEVProtectionStrategy = async (amount: number, token: string): Promise<{
  strategy: 'private_pool' | 'batch_auction' | 'slicing' | 'mixed'
  expectedMevExtraction: number
  gasEstimate: number
  recommendation: string
}> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/mev-protection`, {
      params: { amount, token },
    })
    return response.data
  } catch (error) {
    console.error('Failed to get MEV protection strategy:', error)
    return {
      strategy: 'slicing',
      expectedMevExtraction: 0,
      gasEstimate: 0,
      recommendation: 'Use slicing strategy for medium trades',
    }
  }
}

/**
 * Analyze large order execution risk
 */
export const analyzeLargeOrderRisk = async (amount: number, token: string): Promise<{
  impactBps: number
  slippageRisk: 'low' | 'medium' | 'high'
  mevRisk: 'low' | 'medium' | 'high' | 'critical'
  recommendedSlicing: number // Number of slices
  estimatedTime: number // ms
}> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/large-order-analysis`, {
      params: { amount, token },
    })
    return response.data
  } catch (error) {
    console.error('Failed to analyze large order risk:', error)
    return {
      impactBps: 0,
      slippageRisk: 'low',
      mevRisk: 'low',
      recommendedSlicing: 1,
      estimatedTime: 0,
    }
  }
}

/**
 * Get historical flow comparison
 */
export const getHistoricalFlowComparison = async (
  timeframe: '1h' | '4h' | '24h' = '24h'
): Promise<Array<{ timestamp: number; volume: number; buyPressure: number; mevDetected: number }>> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ofi/flow-history`, { params: { timeframe } })
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch flow history:', error)
    return []
  }
}

/**
 * Subscribe to real-time MEV alerts via WebSocket
 */
export const subscribeMEVAlerts = (
  callback: (event: MEVOpportunity) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const wsUrl = (process.env.REACT_APP_WS_URL || 'ws://localhost:8080').replace('http', 'ws')
  const ws = new WebSocket(`${wsUrl}/ws/ofi/mev-alerts`)

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      callback(data)
    } catch (error) {
      onError?.(error as Error)
    }
  }

  ws.onerror = (error) => {
    onError?.(new Error('WebSocket error'))
  }

  return () => ws.close()
}

/**
 * Subscribe to order flow updates via WebSocket
 */
export const subscribeOrderFlow = (
  callback: (event: OrderFlowEvent) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const wsUrl = (process.env.REACT_APP_WS_URL || 'ws://localhost:8080').replace('http', 'ws')
  const ws = new WebSocket(`${wsUrl}/ws/ofi/order-flow`)

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      callback(data)
    } catch (error) {
      onError?.(error as Error)
    }
  }

  ws.onerror = (error) => {
    onError?.(new Error('WebSocket error'))
  }

  return () => ws.close()
}
