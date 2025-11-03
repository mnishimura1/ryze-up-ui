/**
 * SSP Q(B) Solver & CEX L2 Parsing Engine
 * Implements q(B) calculation with EWMA smoothing, Binance L2 parsing, AMM invariant math
 */

/**
 * Q(B) Solver: Computes optimal band value
 * Formula: q(B) = log((max - min) / midpoint + 1) * 10
 * With EWMA smoothing: α = 0.3
 */
export interface QBSolverParams {
  min: number
  max: number
  midpoint: number
  prevQValue?: number
  ewmaAlpha?: number // Default: 0.3
}

export interface QBSolverResult {
  qValue: number
  qValueSmoothed: number
  error: number
  valid: boolean
  message: string
}

export const solveQB = (params: QBSolverParams): QBSolverResult => {
  const { min, max, midpoint, prevQValue = 0, ewmaAlpha = 0.3 } = params

  // Validation
  if (min >= max) {
    return {
      qValue: 0,
      qValueSmoothed: 0,
      error: Infinity,
      valid: false,
      message: 'Min must be less than max',
    }
  }

  if (midpoint <= 0 || midpoint > max) {
    return {
      qValue: 0,
      qValueSmoothed: 0,
      error: Infinity,
      valid: false,
      message: 'Midpoint must be positive and <= max',
    }
  }

  // Core q(B) calculation
  const rawQValue = Math.log((max - min) / midpoint + 1) * 10

  // EWMA smoothing (α = 0.3)
  const qValueSmoothed = prevQValue === 0 ? rawQValue : ewmaAlpha * rawQValue + (1 - ewmaAlpha) * prevQValue

  // Error validation: should be < 1 bp (0.01%)
  const error = Math.abs(rawQValue - qValueSmoothed)
  const errorBps = error * 10000 // Convert to basis points
  const valid = errorBps < 1

  return {
    qValue: rawQValue,
    qValueSmoothed,
    error,
    valid,
    message: valid ? `✓ Q(B) = ${qValueSmoothed.toFixed(4)} (error: ${errorBps.toFixed(3)} bps)` : `⚠ Error exceeds 1 bp: ${errorBps.toFixed(3)} bps`,
  }
}

/**
 * Aggregation with EWMA: Track q(B) over time
 * Smooth out market volatility with exponential weighting
 */
export interface AggregationPoint {
  timestamp: number
  qValue: number
  qValueSmoothed: number
  source: 'market' | 'calibration'
}

export const aggregateQBHistory = (
  history: AggregationPoint[],
  ewmaAlpha: number = 0.3
): AggregationPoint[] => {
  if (history.length === 0) return []

  const aggregated: AggregationPoint[] = []
  let prevSmoothed = history[0].qValue

  for (const point of history) {
    const smoothed = ewmaAlpha * point.qValue + (1 - ewmaAlpha) * prevSmoothed
    aggregated.push({
      ...point,
      qValueSmoothed: smoothed,
    })
    prevSmoothed = smoothed
  }

  return aggregated
}

/**
 * CEX L2 Parsing: Binance Depth Order Book
 * Extracts bid/ask walls, computes VWAP, calculates impact
 */
export interface BinanceL2Depth {
  bids: Array<[price: number, quantity: number]>
  asks: Array<[price: number, quantity: number]>
  timestamp: number
}

export interface L2ParsedData {
  bidWalls: Array<{ price: number; quantity: number; cumQty: number }>
  askWalls: Array<{ price: number; quantity: number; cumQty: number }>
  midPrice: number
  spread: number
  spreadBps: number
  bidVWAP: number
  askVWAP: number
  impact10k: number // Impact for $10k trade
  impact100k: number // Impact for $100k trade
  liquidity: number // Total available liquidity
}

export const parseL2Depth = (depth: BinanceL2Depth): L2ParsedData => {
  const { bids, asks } = depth

  // Sort and limit to top 50 levels
  const bidsSorted = bids.slice(0, 50)
  const asksSorted = asks.slice(0, 50)

  // Build walls with cumulative quantities
  let bidCumQty = 0
  const bidWalls = bidsSorted.map(([price, qty]) => {
    bidCumQty += qty
    return { price: Number(price), quantity: Number(qty), cumQty: bidCumQty }
  })

  let askCumQty = 0
  const askWalls = asksSorted.map(([price, qty]) => {
    askCumQty += qty
    return { price: Number(price), quantity: Number(qty), cumQty: askCumQty }
  })

  // Mid-price and spread
  const bestBid = bidWalls[0]?.price || 0
  const bestAsk = askWalls[0]?.price || 0
  const midPrice = (bestBid + bestAsk) / 2
  const spread = bestAsk - bestBid
  const spreadBps = (spread / midPrice) * 10000

  // VWAP calculations
  const bidVWAP = bidWalls.reduce((sum, wall) => sum + wall.price * wall.quantity, 0) / bidCumQty
  const askVWAP = askWalls.reduce((sum, wall) => sum + wall.price * wall.quantity, 0) / askCumQty

  // Impact simulation: How much price moves for $10k and $100k trades
  const impact10k = calculateTradeImpact(bidWalls, 10000, midPrice)
  const impact100k = calculateTradeImpact(bidWalls, 100000, midPrice)

  // Total liquidity
  const liquidity = bidCumQty + askCumQty

  return {
    bidWalls,
    askWalls,
    midPrice,
    spread,
    spreadBps,
    bidVWAP,
    askVWAP,
    impact10k,
    impact100k,
    liquidity,
  }
}

/**
 * Calculate trade impact by traversing order book
 * Returns price slippage in basis points
 */
const calculateTradeImpact = (walls: Array<{ price: number; quantity: number; cumQty: number }>, tradeSize: number, midPrice: number): number => {
  let remaining = tradeSize
  let cumPrice = 0
  let cumQty = 0

  for (const wall of walls) {
    if (remaining <= 0) break
    const qty = Math.min(remaining, wall.quantity)
    cumPrice += wall.price * qty
    cumQty += qty
    remaining -= qty
  }

  if (cumQty === 0) return 0

  const avgPrice = cumPrice / cumQty
  const impactBps = ((avgPrice - midPrice) / midPrice) * 10000

  return impactBps
}

/**
 * AMM Impact Calculation
 * Constant product formula: x * y = k
 * Solves for output given input
 */
export interface AMMImpactParams {
  reserveIn: number // Token A reserves
  reserveOut: number // Token B reserves
  amountIn: number // Amount of token A to swap
  feePercent?: number // Swap fee (e.g., 0.3 for Uniswap)
}

export interface AMMImpactResult {
  amountOut: number
  executionPrice: number
  priceImpact: number
  priceImpactBps: number
  feeAmount: number
  slippage: number
}

export const calculateAMMImpact = (params: AMMImpactParams): AMMImpactResult => {
  const { reserveIn, reserveOut, amountIn, feePercent = 0.3 } = params

  // Deduct fee
  const feeAmount = (amountIn * feePercent) / 100
  const amountInAfterFee = amountIn - feeAmount

  // x * y = k formula
  const k = reserveIn * reserveOut
  const newReserveIn = reserveIn + amountInAfterFee
  const newReserveOut = k / newReserveIn
  const amountOut = reserveOut - newReserveOut

  // Execution price
  const executionPrice = amountIn / amountOut

  // Spot price (before trade)
  const spotPrice = reserveOut / reserveIn

  // Price impact in bps
  const priceImpact = (executionPrice / spotPrice - 1) * 100
  const priceImpactBps = priceImpact * 100

  // Slippage (difference between execution and spot)
  const slippage = ((executionPrice - spotPrice) / spotPrice) * 100

  return {
    amountOut,
    executionPrice,
    priceImpact,
    priceImpactBps,
    feeAmount,
    slippage,
  }
}

/**
 * Invariant Check: Ensure x * y = k (with tolerance)
 * Used to validate AMM state
 */
export const checkAMMInvariant = (reserveIn: number, reserveOut: number, k: number, toleranceBps: number = 10): boolean => {
  const currentK = reserveIn * reserveOut
  const kRatio = Math.abs(currentK - k) / k
  const toleranceRatio = toleranceBps / 10000

  return kRatio <= toleranceRatio
}

/**
 * Multi-AMM Aggregation
 * Compare prices across Uniswap V3, Balancer, Aerodrome, CoW Swap
 */
export interface AMMOption {
  name: string // 'Uniswap V3', 'Balancer', 'Aerodrome', 'CoW Swap'
  amountOut: number
  priceImpactBps: number
  feeBps: number
  liquidity: number
  recommendedSize: number // Max recommended trade size without excessive slippage
}

export const aggregateAMMPrices = (ammResults: AMMOption[]): AMMOption & { bestPrice: boolean; worstPrice: boolean } => {
  if (ammResults.length === 0) throw new Error('No AMM options provided')

  // Sort by impact (best = lowest impact)
  const sorted = [...ammResults].sort((a, b) => a.priceImpactBps - b.priceImpactBps)
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  return {
    ...best,
    bestPrice: true,
    worstPrice: false,
  }
}

/**
 * Error Histogram Calculation
 * Tracks prediction errors vs actual market prices
 */
export interface ErrorHistogramBucket {
  rangeStart: number // e.g., 0 bps
  rangeEnd: number // e.g., 1 bps
  count: number
  percentage: number
}

export const generateErrorHistogram = (errors: number[], bucketSizeBps: number = 0.5): ErrorHistogramBucket[] => {
  if (errors.length === 0) return []

  const maxError = Math.max(...errors.map(e => Math.abs(e)))
  const numBuckets = Math.ceil(maxError / bucketSizeBps) + 1

  const buckets: ErrorHistogramBucket[] = []

  for (let i = 0; i < numBuckets; i++) {
    const rangeStart = i * bucketSizeBps
    const rangeEnd = (i + 1) * bucketSizeBps

    const count = errors.filter(e => Math.abs(e) >= rangeStart && Math.abs(e) < rangeEnd).length
    const percentage = (count / errors.length) * 100

    buckets.push({
      rangeStart,
      rangeEnd,
      count,
      percentage,
    })
  }

  return buckets
}

/**
 * Fee Distribution Calculation
 * Breakdown of fees across protocol/LP/insurance
 */
export interface FeeDistribution {
  protocolFee: number
  lpIncentive: number
  insurancePool: number
  total: number
  breakdown: Array<{
    name: string
    amount: number
    percentage: number
    color: string
  }>
}

export const calculateFeeDistribution = (
  totalVolume: number,
  protocolFeeBps: number = 25,
  lpIncentiveBps: number = 15,
  insurancePoolBps: number = 10
): FeeDistribution => {
  const protocolFee = (totalVolume * protocolFeeBps) / 10000
  const lpIncentive = (totalVolume * lpIncentiveBps) / 10000
  const insurancePool = (totalVolume * insurancePoolBps) / 10000
  const total = protocolFee + lpIncentive + insurancePool

  return {
    protocolFee,
    lpIncentive,
    insurancePool,
    total,
    breakdown: [
      { name: 'Protocol', amount: protocolFee, percentage: (protocolFee / total) * 100, color: '#3b82f6' },
      { name: 'LP Incentive', amount: lpIncentive, percentage: (lpIncentive / total) * 100, color: '#10b981' },
      { name: 'Insurance', amount: insurancePool, percentage: (insurancePool / total) * 100, color: '#f97316' },
    ],
  }
}
