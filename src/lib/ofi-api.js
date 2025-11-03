/**
 * Order Flow Intelligence (OFI) API Client
 * MEV detection, slicing analysis, execution metrics, flow tracking
 */
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
// ===== API METHODS =====
/**
 * Fetch real-time order flow events
 */
export const fetchOrderFlowEvents = async (limit = 50) => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/events`, { params: { limit } });
        return response.data || [];
    }
    catch (error) {
        console.error('Failed to fetch order flow events:', error);
        return [];
    }
};
/**
 * Detect MEV opportunities
 */
export const detectMEV = async () => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/mev-opportunities`);
        return response.data || [];
    }
    catch (error) {
        console.error('Failed to detect MEV:', error);
        return [];
    }
};
/**
 * Get execution metrics for an order
 */
export const getExecutionMetrics = async (orderId) => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/execution/${orderId}`);
        return response.data;
    }
    catch (error) {
        console.error(`Failed to fetch execution metrics for ${orderId}:`, error);
        return null;
    }
};
/**
 * Get overall flow metrics
 */
export const getFlowMetrics = async () => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/flow-metrics`);
        return response.data;
    }
    catch (error) {
        console.error('Failed to fetch flow metrics:', error);
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
        };
    }
};
/**
 * Get slicing strategy recommendation
 */
export const getSlicingStrategy = async (amount, token) => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/slicing-strategy`, {
            params: { amount, token },
        });
        return response.data;
    }
    catch (error) {
        console.error('Failed to get slicing strategy:', error);
        return {
            orderId: '',
            originalAmount: amount,
            slices: [],
            totalExecutedAmount: 0,
            averageSlippage: 0,
            recommendation: 'balanced',
        };
    }
};
/**
 * Get token-specific flow analysis
 */
export const getTokenFlow = async (token) => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/token-flow/${token}`);
        return response.data;
    }
    catch (error) {
        console.error(`Failed to fetch token flow for ${token}:`, error);
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
        };
    }
};
/**
 * Track liquidation events
 */
export const getLiquidationEvents = async (limit = 20) => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/liquidations`, { params: { limit } });
        return response.data || [];
    }
    catch (error) {
        console.error('Failed to fetch liquidation events:', error);
        return [];
    }
};
/**
 * Estimate slippage for a trade
 */
export const estimateSlippage = async (amount, token, venue = 'uniswap') => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/slippage-estimate`, {
            params: { amount, token, venue },
        });
        return response.data;
    }
    catch (error) {
        console.error('Failed to estimate slippage:', error);
        return { slippage: 0, slippageBps: 0, estimatedOutAmount: 0 };
    }
};
/**
 * Check for sandwich attack risk
 */
export const checkSandwichRisk = async (amount, token) => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/sandwich-risk`, {
            params: { amount, token },
        });
        return response.data.riskScore || 0; // 0-100
    }
    catch (error) {
        console.error('Failed to check sandwich risk:', error);
        return 0;
    }
};
/**
 * Get MEV protection strategies
 */
export const getMEVProtectionStrategy = async (amount, token) => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/mev-protection`, {
            params: { amount, token },
        });
        return response.data;
    }
    catch (error) {
        console.error('Failed to get MEV protection strategy:', error);
        return {
            strategy: 'slicing',
            expectedMevExtraction: 0,
            gasEstimate: 0,
            recommendation: 'Use slicing strategy for medium trades',
        };
    }
};
/**
 * Analyze large order execution risk
 */
export const analyzeLargeOrderRisk = async (amount, token) => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/large-order-analysis`, {
            params: { amount, token },
        });
        return response.data;
    }
    catch (error) {
        console.error('Failed to analyze large order risk:', error);
        return {
            impactBps: 0,
            slippageRisk: 'low',
            mevRisk: 'low',
            recommendedSlicing: 1,
            estimatedTime: 0,
        };
    }
};
/**
 * Get historical flow comparison
 */
export const getHistoricalFlowComparison = async (timeframe = '24h') => {
    try {
        const response = await axios.get(`${API_BASE}/api/ofi/flow-history`, { params: { timeframe } });
        return response.data || [];
    }
    catch (error) {
        console.error('Failed to fetch flow history:', error);
        return [];
    }
};
/**
 * Subscribe to real-time MEV alerts via WebSocket
 */
export const subscribeMEVAlerts = (callback, onError) => {
    const wsUrl = (process.env.REACT_APP_WS_URL || 'ws://localhost:8080').replace('http', 'ws');
    const ws = new WebSocket(`${wsUrl}/ws/ofi/mev-alerts`);
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            callback(data);
        }
        catch (error) {
            onError?.(error);
        }
    };
    ws.onerror = (error) => {
        onError?.(new Error('WebSocket error'));
    };
    return () => ws.close();
};
/**
 * Subscribe to order flow updates via WebSocket
 */
export const subscribeOrderFlow = (callback, onError) => {
    const wsUrl = (process.env.REACT_APP_WS_URL || 'ws://localhost:8080').replace('http', 'ws');
    const ws = new WebSocket(`${wsUrl}/ws/ofi/order-flow`);
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            callback(data);
        }
        catch (error) {
            onError?.(error);
        }
    };
    ws.onerror = (error) => {
        onError?.(new Error('WebSocket error'));
    };
    return () => ws.close();
};
