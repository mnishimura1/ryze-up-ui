/**
 * SSP Q(B) Solver & CEX L2 Parsing Engine
 * Implements q(B) calculation with EWMA smoothing, Binance L2 parsing, AMM invariant math
 */
export const solveQB = (params) => {
    const { min, max, midpoint, prevQValue = 0, ewmaAlpha = 0.3 } = params;
    // Validation
    if (min >= max) {
        return {
            qValue: 0,
            qValueSmoothed: 0,
            error: Infinity,
            valid: false,
            message: 'Min must be less than max',
        };
    }
    if (midpoint <= 0 || midpoint > max) {
        return {
            qValue: 0,
            qValueSmoothed: 0,
            error: Infinity,
            valid: false,
            message: 'Midpoint must be positive and <= max',
        };
    }
    // Core q(B) calculation
    const rawQValue = Math.log((max - min) / midpoint + 1) * 10;
    // EWMA smoothing (α = 0.3)
    const qValueSmoothed = prevQValue === 0 ? rawQValue : ewmaAlpha * rawQValue + (1 - ewmaAlpha) * prevQValue;
    // Error validation: should be < 1 bp (0.01%)
    const error = Math.abs(rawQValue - qValueSmoothed);
    const errorBps = error * 10000; // Convert to basis points
    const valid = errorBps < 1;
    return {
        qValue: rawQValue,
        qValueSmoothed,
        error,
        valid,
        message: valid ? `✓ Q(B) = ${qValueSmoothed.toFixed(4)} (error: ${errorBps.toFixed(3)} bps)` : `⚠ Error exceeds 1 bp: ${errorBps.toFixed(3)} bps`,
    };
};
export const aggregateQBHistory = (history, ewmaAlpha = 0.3) => {
    if (history.length === 0)
        return [];
    const aggregated = [];
    let prevSmoothed = history[0].qValue;
    for (const point of history) {
        const smoothed = ewmaAlpha * point.qValue + (1 - ewmaAlpha) * prevSmoothed;
        aggregated.push({
            ...point,
            qValueSmoothed: smoothed,
        });
        prevSmoothed = smoothed;
    }
    return aggregated;
};
export const parseL2Depth = (depth) => {
    const { bids, asks } = depth;
    // Sort and limit to top 50 levels
    const bidsSorted = bids.slice(0, 50);
    const asksSorted = asks.slice(0, 50);
    // Build walls with cumulative quantities
    let bidCumQty = 0;
    const bidWalls = bidsSorted.map(([price, qty]) => {
        bidCumQty += qty;
        return { price: Number(price), quantity: Number(qty), cumQty: bidCumQty };
    });
    let askCumQty = 0;
    const askWalls = asksSorted.map(([price, qty]) => {
        askCumQty += qty;
        return { price: Number(price), quantity: Number(qty), cumQty: askCumQty };
    });
    // Mid-price and spread
    const bestBid = bidWalls[0]?.price || 0;
    const bestAsk = askWalls[0]?.price || 0;
    const midPrice = (bestBid + bestAsk) / 2;
    const spread = bestAsk - bestBid;
    const spreadBps = (spread / midPrice) * 10000;
    // VWAP calculations
    const bidVWAP = bidWalls.reduce((sum, wall) => sum + wall.price * wall.quantity, 0) / bidCumQty;
    const askVWAP = askWalls.reduce((sum, wall) => sum + wall.price * wall.quantity, 0) / askCumQty;
    // Impact simulation: How much price moves for $10k and $100k trades
    const impact10k = calculateTradeImpact(bidWalls, 10000, midPrice);
    const impact100k = calculateTradeImpact(bidWalls, 100000, midPrice);
    // Total liquidity
    const liquidity = bidCumQty + askCumQty;
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
    };
};
/**
 * Calculate trade impact by traversing order book
 * Returns price slippage in basis points
 */
const calculateTradeImpact = (walls, tradeSize, midPrice) => {
    let remaining = tradeSize;
    let cumPrice = 0;
    let cumQty = 0;
    for (const wall of walls) {
        if (remaining <= 0)
            break;
        const qty = Math.min(remaining, wall.quantity);
        cumPrice += wall.price * qty;
        cumQty += qty;
        remaining -= qty;
    }
    if (cumQty === 0)
        return 0;
    const avgPrice = cumPrice / cumQty;
    const impactBps = ((avgPrice - midPrice) / midPrice) * 10000;
    return impactBps;
};
export const calculateAMMImpact = (params) => {
    const { reserveIn, reserveOut, amountIn, feePercent = 0.3 } = params;
    // Deduct fee
    const feeAmount = (amountIn * feePercent) / 100;
    const amountInAfterFee = amountIn - feeAmount;
    // x * y = k formula
    const k = reserveIn * reserveOut;
    const newReserveIn = reserveIn + amountInAfterFee;
    const newReserveOut = k / newReserveIn;
    const amountOut = reserveOut - newReserveOut;
    // Execution price
    const executionPrice = amountIn / amountOut;
    // Spot price (before trade)
    const spotPrice = reserveOut / reserveIn;
    // Price impact in bps
    const priceImpact = (executionPrice / spotPrice - 1) * 100;
    const priceImpactBps = priceImpact * 100;
    // Slippage (difference between execution and spot)
    const slippage = ((executionPrice - spotPrice) / spotPrice) * 100;
    return {
        amountOut,
        executionPrice,
        priceImpact,
        priceImpactBps,
        feeAmount,
        slippage,
    };
};
/**
 * Invariant Check: Ensure x * y = k (with tolerance)
 * Used to validate AMM state
 */
export const checkAMMInvariant = (reserveIn, reserveOut, k, toleranceBps = 10) => {
    const currentK = reserveIn * reserveOut;
    const kRatio = Math.abs(currentK - k) / k;
    const toleranceRatio = toleranceBps / 10000;
    return kRatio <= toleranceRatio;
};
export const aggregateAMMPrices = (ammResults) => {
    if (ammResults.length === 0)
        throw new Error('No AMM options provided');
    // Sort by impact (best = lowest impact)
    const sorted = [...ammResults].sort((a, b) => a.priceImpactBps - b.priceImpactBps);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    return {
        ...best,
        bestPrice: true,
        worstPrice: false,
    };
};
export const generateErrorHistogram = (errors, bucketSizeBps = 0.5) => {
    if (errors.length === 0)
        return [];
    const maxError = Math.max(...errors.map(e => Math.abs(e)));
    const numBuckets = Math.ceil(maxError / bucketSizeBps) + 1;
    const buckets = [];
    for (let i = 0; i < numBuckets; i++) {
        const rangeStart = i * bucketSizeBps;
        const rangeEnd = (i + 1) * bucketSizeBps;
        const count = errors.filter(e => Math.abs(e) >= rangeStart && Math.abs(e) < rangeEnd).length;
        const percentage = (count / errors.length) * 100;
        buckets.push({
            rangeStart,
            rangeEnd,
            count,
            percentage,
        });
    }
    return buckets;
};
export const calculateFeeDistribution = (totalVolume, protocolFeeBps = 25, lpIncentiveBps = 15, insurancePoolBps = 10) => {
    const protocolFee = (totalVolume * protocolFeeBps) / 10000;
    const lpIncentive = (totalVolume * lpIncentiveBps) / 10000;
    const insurancePool = (totalVolume * insurancePoolBps) / 10000;
    const total = protocolFee + lpIncentive + insurancePool;
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
    };
};
