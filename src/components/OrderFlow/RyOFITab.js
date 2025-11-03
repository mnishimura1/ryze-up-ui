import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Order Flow Intelligence (OFI) Tab - Complete Dashboard
 * MEV Detection, Slicing Intelligence, Execution Analysis, Flow Tracking
 */
import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RyCard } from '../primitives/RyCard';
import { fetchOrderFlowEvents, detectMEV, getFlowMetrics, getSlicingStrategy, getLiquidationEvents, estimateSlippage, checkSandwichRisk, getHistoricalFlowComparison, subscribeOrderFlow, subscribeMEVAlerts, } from '../../lib/ofi-api';
// ===== REAL-TIME ORDER FLOW STREAM =====
export const RyOrderFlowStream = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            const data = await fetchOrderFlowEvents(20);
            setEvents(data);
            setLoading(false);
        };
        loadEvents();
        const unsubscribe = subscribeOrderFlow((event) => {
            setEvents((prev) => [event, ...prev.slice(0, 19)]);
        });
        const interval = setInterval(loadEvents, 3000);
        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "\uD83D\uDD04 Real-Time Order Flow" }), _jsx("div", { className: "space-y-2 max-h-80 overflow-y-auto", children: events.length > 0 ? (events.map((event) => (_jsxs("div", { className: "p-2 bg-dark-surface rounded border border-dark-border text-xs", children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `font-bold ${event.side === 'buy' ? 'text-success' : 'text-danger'}`, children: event.side.toUpperCase() }), _jsxs("span", { className: "font-mono", children: [event.amount.toFixed(2), " ", event.token] }), _jsx("span", { className: `px-1 rounded text-xs ${event.mevRisk === 'low'
                                                ? 'bg-success/20 text-success'
                                                : event.mevRisk === 'medium'
                                                    ? 'bg-warn/20 text-warn'
                                                    : event.mevRisk === 'high'
                                                        ? 'bg-danger/20 text-danger'
                                                        : 'bg-critical/20 text-critical'}`, children: event.mevRisk.toUpperCase() })] }), _jsx("span", { className: "text-subtext", children: event.venue })] }), _jsxs("div", { className: "flex justify-between text-subtext text-xs", children: [_jsxs("span", { children: ["$", event.price.toFixed(2)] }), _jsxs("span", { children: [((Date.now() - event.timestamp) / 1000).toFixed(1), "s ago"] })] })] }, event.id)))) : (_jsx("div", { className: "text-xs text-subtext text-center py-4", children: loading ? 'Loading...' : 'No events' })) })] }));
};
// ===== MEV OPPORTUNITY DETECTOR =====
export const RyMEVDetector = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [totalMEV, setTotalMEV] = useState(0);
    useEffect(() => {
        const loadMEV = async () => {
            const data = await detectMEV();
            setOpportunities(data.slice(0, 10));
            setTotalMEV(data.reduce((sum, opp) => sum + opp.profit, 0));
        };
        loadMEV();
        const unsubscribe = subscribeMEVAlerts((event) => {
            setOpportunities((prev) => [event, ...prev.slice(0, 9)]);
            setTotalMEV((prev) => prev + event.profit);
        });
        const interval = setInterval(loadMEV, 5000);
        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "\uD83C\uDFAF MEV Opportunities Detected" }), _jsxs("div", { className: "mb-3 p-2 bg-dark-surface rounded border border-danger/30", children: [_jsx("div", { className: "text-subtext text-xs mb-1", children: "Total MEV Value" }), _jsxs("div", { className: "text-2xl font-bold text-danger", children: ["$", totalMEV.toFixed(2)] })] }), _jsx("div", { className: "space-y-2 max-h-60 overflow-y-auto", children: opportunities.map((opp) => (_jsxs("div", { className: "p-2 bg-dark-surface rounded border border-dark-border text-xs", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-semibold text-accent", children: opp.type.toUpperCase() }), _jsxs("span", { className: `font-mono font-bold ${opp.profit > 1000 ? 'text-danger' : 'text-warn'}`, children: ["$", opp.profit.toFixed(2)] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-1 text-subtext", children: [_jsxs("span", { children: ["Execution: $", opp.executionPrice.toFixed(2)] }), _jsxs("span", { children: ["Impact: ", opp.impactBps.toFixed(2), " bps"] })] })] }, opp.id))) })] }));
};
// ===== FLOW METRICS PANEL =====
export const RyFlowMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    useEffect(() => {
        const loadMetrics = async () => {
            const data = await getFlowMetrics();
            setMetrics(data);
        };
        loadMetrics();
        const interval = setInterval(loadMetrics, 5000);
        return () => clearInterval(interval);
    }, []);
    if (!metrics)
        return _jsx(RyCard, { children: _jsx("div", { className: "text-xs text-subtext", children: "Loading..." }) });
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "\uD83D\uDCCA Flow Metrics (24h)" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [_jsx("span", { className: "text-subtext", children: "Total Volume" }), _jsxs("span", { className: "font-mono font-bold", children: ["$", (metrics.totalVolume24h / 1e6).toFixed(2), "M"] })] }), _jsx("div", { className: "flex items-center gap-1 text-xs", children: _jsxs("div", { className: "flex-1 h-2 bg-dark-surface rounded overflow-hidden flex", children: [_jsx("div", { className: "h-full bg-success", style: { width: `${(metrics.buyVolume / metrics.totalVolume24h) * 100}%` } }), _jsx("div", { className: "h-full bg-danger", style: { width: `${(metrics.sellVolume / metrics.totalVolume24h) * 100}%` } })] }) }), _jsxs("div", { className: "flex justify-between text-xs text-subtext mt-1", children: [_jsxs("span", { children: ["Buy: $", (metrics.buyVolume / 1e6).toFixed(2), "M"] }), _jsxs("span", { children: ["Sell: $", (metrics.sellVolume / 1e6).toFixed(2), "M"] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [_jsx("span", { className: "text-subtext", children: "Buy Pressure" }), _jsxs("span", { className: "font-mono font-bold text-accent", children: [(metrics.buyPressure * 100).toFixed(1), "%"] })] }), _jsx("div", { className: "w-full h-2 bg-dark-surface rounded overflow-hidden", children: _jsx("div", { className: `h-full ${metrics.buyPressure > 0.6 ? 'bg-success' : metrics.buyPressure > 0.4 ? 'bg-warn' : 'bg-danger'}`, style: { width: `${metrics.buyPressure * 100}%` } }) })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 pt-2 border-t border-dark-border", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-subtext", children: "MEV Detected" }), _jsx("div", { className: "font-bold text-danger text-lg", children: metrics.mevDetected })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-subtext", children: "Liquidations" }), _jsx("div", { className: "font-bold text-warn text-lg", children: metrics.liquidationCount })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs text-subtext", children: "Flash Loans" }), _jsx("div", { className: "font-bold text-accent text-lg", children: metrics.flashLoanCount })] })] }), _jsxs("div", { className: "p-2 bg-dark-surface rounded border border-dark-border", children: [_jsx("div", { className: "text-xs text-subtext mb-1", children: "Avg Slippage" }), _jsxs("div", { className: "font-mono font-bold text-accent", children: [metrics.averageSlippage.toFixed(2), " bps"] })] })] })] }));
};
// ===== SANDWICH RISK ANALYZER =====
export const RySandwichRiskAnalyzer = () => {
    const [amount, setAmount] = useState(10000);
    const [token, setToken] = useState('ETH');
    const [riskScore, setRiskScore] = useState(0);
    const [slippageEst, setSlippageEst] = useState(0);
    useEffect(() => {
        const analyze = async () => {
            const risk = await checkSandwichRisk(amount, token);
            const slippage = await estimateSlippage(amount, token);
            setRiskScore(risk);
            setSlippageEst(slippage.slippageBps);
        };
        const timer = setTimeout(analyze, 300);
        return () => clearTimeout(timer);
    }, [amount, token]);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "\u26A0\uFE0F Sandwich Risk Analyzer" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext mb-1 block", children: "Amount" }), _jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(Number(e.target.value)), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext mb-1 block", children: "Token" }), _jsxs("select", { value: token, onChange: (e) => setToken(e.target.value), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs", children: [_jsx("option", { children: "ETH" }), _jsx("option", { children: "BTC" }), _jsx("option", { children: "USDC" }), _jsx("option", { children: "DAI" })] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [_jsx("span", { className: "text-subtext", children: "Sandwich Risk" }), _jsxs("span", { className: `font-bold ${riskScore < 30 ? 'text-success' : riskScore < 60 ? 'text-warn' : 'text-danger'}`, children: [riskScore, "/100"] })] }), _jsx("div", { className: "w-full h-2 bg-dark-surface rounded overflow-hidden", children: _jsx("div", { className: `h-full ${riskScore < 30 ? 'bg-success' : riskScore < 60 ? 'bg-warn' : 'bg-danger'}`, style: { width: `${riskScore}%` } }) }), _jsx("div", { className: "mt-2 text-xs text-subtext", children: riskScore < 30
                                    ? '✓ Low risk - Safe to execute'
                                    : riskScore < 60
                                        ? '⚠ Medium risk - Consider slicing'
                                        : '✗ High risk - Use MEV protection' })] }), _jsxs("div", { className: "p-2 bg-dark-surface rounded border border-dark-border", children: [_jsx("div", { className: "text-xs text-subtext mb-1", children: "Estimated Slippage" }), _jsxs("div", { className: "font-mono font-bold text-accent", children: [slippageEst.toFixed(2), " bps"] })] })] })] }));
};
// ===== SLICING INTELLIGENCE =====
export const RySlicingIntelligence = () => {
    const [strategy, setStrategy] = useState(null);
    const [amount, setAmount] = useState(100000);
    const [token, setToken] = useState('ETH');
    useEffect(() => {
        const loadStrategy = async () => {
            const data = await getSlicingStrategy(amount, token);
            setStrategy(data);
        };
        const timer = setTimeout(loadStrategy, 300);
        return () => clearTimeout(timer);
    }, [amount, token]);
    if (!strategy)
        return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "\u26A1 Smart Slicing Strategy" }), _jsx("div", { className: "text-xs text-subtext text-center py-4", children: "Loading..." })] }));
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "\u26A1 Smart Slicing Strategy" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(Number(e.target.value)), placeholder: "Amount", className: "p-1 rounded border border-dark-border bg-dark-surface text-white text-xs" }), _jsxs("select", { value: token, onChange: (e) => setToken(e.target.value), className: "p-1 rounded border border-dark-border bg-dark-surface text-white text-xs", children: [_jsx("option", { children: "ETH" }), _jsx("option", { children: "BTC" }), _jsx("option", { children: "USDC" })] })] }), _jsxs("div", { className: `p-2 rounded border ${strategy.recommendation === 'aggressive'
                            ? 'border-danger bg-danger/10'
                            : strategy.recommendation === 'conservative'
                                ? 'border-success bg-success/10'
                                : 'border-warn bg-warn/10'}`, children: [_jsx("div", { className: "text-xs text-subtext mb-1", children: "Recommended Strategy" }), _jsx("div", { className: "font-bold text-sm uppercase", children: strategy.recommendation })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [_jsxs("div", { className: "p-2 bg-dark-surface rounded", children: [_jsx("div", { className: "text-subtext mb-1", children: "Slices" }), _jsx("div", { className: "font-mono font-bold", children: strategy.slices?.length || 0 })] }), _jsxs("div", { className: "p-2 bg-dark-surface rounded", children: [_jsx("div", { className: "text-subtext mb-1", children: "Avg Slippage" }), _jsxs("div", { className: "font-mono font-bold text-accent", children: [strategy.averageSlippage?.toFixed(2) || 0, " bps"] })] })] }), strategy.slices && strategy.slices.length > 0 && (_jsx("div", { className: "mt-2 space-y-1 max-h-40 overflow-y-auto", children: strategy.slices.map((slice, idx) => (_jsxs("div", { className: "p-1 bg-dark-surface rounded text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { className: "text-subtext", children: ["Slice ", slice.sliceNumber] }), _jsxs("span", { className: "font-mono", children: [(slice.amount / amount * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "text-subtext text-xs", children: ["Delay: ", slice.timing, "ms"] })] }, idx))) }))] })] }));
};
// ===== LIQUIDATION MONITOR =====
export const RyLiquidationMonitor = () => {
    const [liquidations, setLiquidations] = useState([]);
    const [totalProfit, setTotalProfit] = useState(0);
    useEffect(() => {
        const loadLiquidations = async () => {
            const data = await getLiquidationEvents(15);
            setLiquidations(data);
            setTotalProfit(data.reduce((sum, liq) => sum + liq.profitUSD, 0));
        };
        loadLiquidations();
        const interval = setInterval(loadLiquidations, 10000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "\uD83D\uDCA5 Liquidation Events" }), _jsxs("div", { className: "mb-3 p-2 bg-dark-surface rounded", children: [_jsx("div", { className: "text-xs text-subtext mb-1", children: "Total Liquidation Profit (24h)" }), _jsxs("div", { className: "text-xl font-bold text-danger", children: ["$", totalProfit.toFixed(2)] })] }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: liquidations.length > 0 ? (liquidations.map((liq) => (_jsxs("div", { className: "p-2 bg-dark-surface rounded border border-dark-border text-xs", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-mono text-accent", children: liq.collateral }), _jsxs("span", { className: "font-bold text-danger", children: ["$", liq.profitUSD.toFixed(2)] })] }), _jsxs("div", { className: "text-subtext text-xs", children: [liq.collateralAmount.toFixed(2), " ", liq.collateral, " liquidated"] }), _jsxs("div", { className: "text-subtext text-xs mt-1", children: [((Date.now() - liq.timestamp) / 1000).toFixed(0), "s ago"] })] }, liq.id)))) : (_jsx("div", { className: "text-xs text-subtext text-center py-4", children: "No recent liquidations" })) })] }));
};
// ===== FLOW CHART (D3) =====
export const RyFlowChart = () => {
    const svgRef = useRef(null);
    const [flowHistory, setFlowHistory] = useState([]);
    useEffect(() => {
        const loadHistory = async () => {
            const data = await getHistoricalFlowComparison('24h');
            setFlowHistory(data);
            if (data.length > 0 && svgRef.current) {
                const width = 300;
                const height = 150;
                const margin = { top: 10, right: 10, bottom: 20, left: 40 };
                const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([margin.left, width - margin.right]);
                const yScale = d3
                    .scaleLinear()
                    .domain([0, d3.max(data, (d) => d.volume) || 100])
                    .range([height - margin.bottom, margin.top]);
                const line = d3
                    .line()
                    .x((_, i) => xScale(i))
                    .y((d) => yScale(d.volume))
                    .curve(d3.curveMonotoneX);
                const svg = d3.select(svgRef.current);
                svg.selectAll('*').remove();
                svg
                    .append('path')
                    .datum(data)
                    .attr('fill', 'none')
                    .attr('stroke', '#3b82f6')
                    .attr('stroke-width', 2)
                    .attr('d', line);
            }
        };
        loadHistory();
    }, []);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "\uD83D\uDCC8 Order Flow Volume (24h)" }), _jsx("svg", { ref: svgRef, width: "100%", viewBox: "0 0 300 150", className: "border border-dark-border rounded" })] }));
};
// ===== MAIN OFI TAB =====
export const OFITab = () => {
    return (_jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Order Flow Intelligence" }), _jsx("div", { className: "text-sm text-subtext", children: "MEV \u00B7 Slicing \u00B7 Execution \u00B7 Flow" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(RyOrderFlowStream, {}), _jsx(RyMEVDetector, {}), _jsx(RyFlowMetrics, {}), _jsx(RySandwichRiskAnalyzer, {}), _jsx(RySlicingIntelligence, {}), _jsx(RyLiquidationMonitor, {}), _jsx("div", { className: "lg:col-span-2", children: _jsx(RyFlowChart, {}) })] })] }));
};
export default OFITab;
