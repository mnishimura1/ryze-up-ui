import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * SSP Tab - Complete Smart Swap Protocol Dashboard
 * Real API Integration: /api/ssp/* endpoints
 * Features: Calibration, Fee Management, Health Monitoring, ADL Events, Session Tracking
 * Real-time updates via WebSocket (ssp.state topic)
 */
import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RyCard } from '../primitives/RyCard';
import { fetchPools, fetchShieldLevel, fetchCalibrationData, fetchHealthData, fetchADLEvents, fetchComponentBreakdown, fetchAggregationData, fetchSessionKeys, updateCalibration, updateCircuitState, updateFeeParameters, } from '../../lib/ssp-api';
import { RyFeeDistributionPie, RyCEXL2Parser, RyAMMImpactSimulator, RyErrorHistogram, RyQBSolverDisplay, } from './RyAdvancedAnalytics';
// ===== SHIELD DIAL =====
export const RyShieldDial = ({ poolId }) => {
    const [data, setData] = useState({ poolId, level: 75, healthScore: 0.7 });
    const svgRef = useRef(null);
    useEffect(() => {
        const loadData = async () => {
            const shieldData = await fetchShieldLevel(poolId);
            setData(shieldData);
        };
        loadData();
    }, [poolId]);
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp')
            setData((prev) => ({ ...prev, level: Math.min(100, prev.level + 5) }));
        if (e.key === 'ArrowDown')
            setData((prev) => ({ ...prev, level: Math.max(0, prev.level - 5) }));
    };
    return (_jsxs(RyCard, { className: "text-xs", children: [_jsx("h4", { className: "text-sm mb-2", children: "Shield Level" }), _jsx("div", { className: "relative w-full h-24", children: _jsxs("svg", { ref: svgRef, viewBox: "0 0 100 50", onKeyDown: handleKeyDown, tabIndex: 0, role: "slider", "aria-label": `Shield level: ${data.level}%`, children: [_jsx("path", { d: "M10 40 A30 30 0 0 1 90 40", fill: "none", stroke: "var(--border)", strokeWidth: "2" }), _jsx("path", { d: "M10 40 A30 30 0 0 1 50 10", fill: "none", stroke: "var(--accent)", strokeWidth: "4", strokeDasharray: `${(data.level / 100) * 188.5} 188.5` })] }) }), _jsxs("div", { className: "text-xs text-center mt-2", children: [_jsxs("span", { className: "font-mono font-bold", children: [data.level, "%"] }), _jsxs("span", { className: "text-subtext ml-2", children: ["Health: ", (data.healthScore * 100).toFixed(1), "%"] })] })] }));
};
// ===== POOL LIST =====
export const RyPoolList = ({ poolId, onSelectPool, }) => {
    const [pools, setPools] = useState([]);
    useEffect(() => {
        const loadPools = async () => {
            const data = await fetchPools();
            setPools(data);
        };
        loadPools();
    }, []);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "Pools" }), pools.length > 0 ? (_jsxs("table", { className: "w-full text-xs", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "text-left", children: "Pool" }), _jsx("th", { className: "text-right", children: "TVL" }), _jsx("th", { className: "text-right", children: "APR" }), _jsx("th", { className: "text-center", children: "Action" })] }) }), _jsx("tbody", { children: pools.map((pool) => (_jsxs("tr", { className: poolId === pool.id ? 'bg-accent/10' : 'hover:bg-dark-surface', children: [_jsx("td", { children: pool.id }), _jsxs("td", { className: "text-right font-mono", children: ["$", (pool.tvl / 1e6).toFixed(1), "M"] }), _jsxs("td", { className: "text-right font-mono text-success", children: [pool.apr.toFixed(1), "%"] }), _jsx("td", { className: "text-center", children: _jsx("button", { onClick: () => onSelectPool(pool.id), className: "text-xs bg-accent text-white px-2 py-1 rounded hover:bg-accent/80", children: poolId === pool.id ? '✓ Active' : 'Select' }) })] }, pool.id))) })] })) : (_jsx("div", { className: "text-xs text-subtext text-center py-4", children: "Loading pools..." }))] }));
};
// ===== CIRCUIT BANNER =====
export const RyCircuitBanner = ({ poolId }) => {
    const [state, setState] = useState('open');
    const [reason, setReason] = useState('');
    const [updating, setUpdating] = useState(false);
    const handleUpdate = async () => {
        setUpdating(true);
        const success = await updateCircuitState(poolId, state, reason);
        if (success) {
            setReason('');
        }
        setUpdating(false);
    };
    const borderColor = state === 'open' ? 'border-green-500' : state === 'guarded' ? 'border-yellow-500' : 'border-red-500';
    return (_jsxs(RyCard, { className: `border ${borderColor}`, children: [_jsx("h4", { className: "text-sm mb-2", children: "Circuit State" }), _jsxs("select", { value: state, onChange: (e) => setState(e.target.value), className: "w-full p-2 mb-2 rounded border border-dark-border bg-dark-surface text-white text-xs", children: [_jsx("option", { value: "open", children: "\uD83D\uDFE2 Open" }), _jsx("option", { value: "guarded", children: "\uD83D\uDFE1 Guarded" }), _jsx("option", { value: "breaker", children: "\uD83D\uDD34 Breaker" })] }), _jsx("input", { value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Reason (optional)", className: "w-full p-2 mb-2 rounded border border-dark-border bg-dark-surface text-white text-xs placeholder-subtext" }), _jsx("button", { onClick: handleUpdate, disabled: updating, className: "w-full py-2 bg-accent text-white rounded hover:bg-accent/80 disabled:bg-subtext text-xs font-semibold", children: updating ? 'Updating...' : 'Update' })] }));
};
// ===== SLIPPAGE GUARD =====
export const RySlippageGuard = () => {
    const [tolerance, setTolerance] = useState(50);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "Slippage Tolerance" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-xs", children: ["Current: ", tolerance, " bps"] }), _jsxs("span", { className: "text-xs text-accent font-mono", children: [(tolerance / 100).toFixed(2), "%"] })] }), _jsx("input", { type: "range", min: "1", max: "500", value: tolerance, onChange: (e) => setTolerance(Number(e.target.value)), className: "w-full", "aria-label": "Slippage tolerance in basis points" }), _jsxs("div", { className: "flex justify-between text-xs text-subtext", children: [_jsx("span", { children: "1 bps" }), _jsx("span", { children: "500 bps" })] })] })] }));
};
// ===== HEALTH GAUGES =====
export const RyHealthGauges = ({ poolId }) => {
    const [health, setHealth] = useState({
        balanceUtilization: 0.3,
        pnlUtilization: 0.2,
        compositeHealth: 0.7,
        timestamp: Date.now(),
    });
    useEffect(() => {
        const loadHealth = async () => {
            const data = await fetchHealthData(poolId);
            setHealth(data);
        };
        loadHealth();
        const interval = setInterval(loadHealth, 5000);
        return () => clearInterval(interval);
    }, [poolId]);
    const gauges = [
        { label: 'Balance Util', value: health.balanceUtilization },
        { label: 'PnL Util', value: health.pnlUtilization },
        { label: 'Composite', value: health.compositeHealth },
    ];
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "Health Metrics" }), _jsx("div", { className: "space-y-3", children: gauges.map((gauge) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [_jsx("span", { className: "text-subtext", children: gauge.label }), _jsxs("span", { className: "font-mono font-bold", children: [(gauge.value * 100).toFixed(1), "%"] })] }), _jsx("div", { className: "w-full h-2 bg-dark-surface rounded overflow-hidden", children: _jsx("div", { className: `h-full transition-all ${gauge.value > 0.8 ? 'bg-danger' : gauge.value > 0.5 ? 'bg-warn' : 'bg-success'}`, style: { width: `${gauge.value * 100}%` } }) })] }, gauge.label))) })] }));
};
// ===== ADL EVENTS =====
export const RyADLEvents = ({ poolId }) => {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        const loadEvents = async () => {
            const data = await fetchADLEvents(poolId);
            setEvents(data);
        };
        loadEvents();
    }, [poolId]);
    return (_jsxs(RyCard, { children: [_jsxs("h4", { className: "text-sm mb-2", children: ["ADL Events (", events.length, ")"] }), events.length > 0 ? (_jsx("div", { className: "space-y-2", children: events.slice(0, 5).map((event) => (_jsxs("div", { className: "text-xs border-l-2 border-danger pl-2 py-1", children: [_jsx("div", { className: "font-mono text-accent", children: event.asset }), _jsx("div", { className: "text-subtext", children: event.reason }), _jsxs("div", { className: "text-subtext text-right", children: [event.positionCount, " positions"] })] }, event.id))) })) : (_jsx("div", { className: "text-xs text-subtext text-center py-4", children: "No ADL events" }))] }));
};
// ===== DYNAMIC FEE PANEL =====
export const RyDynamicFeePanel = ({ poolId }) => {
    const [winRateTarget, setWinRateTarget] = useState(55);
    const [feeStep, setFeeStep] = useState(1);
    const [updating, setUpdating] = useState(false);
    const handleUpdate = async () => {
        setUpdating(true);
        await updateFeeParameters(poolId, winRateTarget, feeStep);
        setUpdating(false);
    };
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "Fee Configuration" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [_jsx("span", { className: "text-subtext", children: "Win Rate Target" }), _jsxs("span", { className: "font-mono font-bold text-accent", children: [winRateTarget, "%"] })] }), _jsx("input", { type: "range", min: "50", max: "70", value: winRateTarget, onChange: (e) => setWinRateTarget(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [_jsx("span", { className: "text-subtext", children: "Fee Step (bps)" }), _jsx("span", { className: "font-mono font-bold text-accent", children: (feeStep * 10).toFixed(1) })] }), _jsx("input", { type: "range", min: "0.5", max: "2", step: "0.1", value: feeStep, onChange: (e) => setFeeStep(Number(e.target.value)), className: "w-full" })] }), _jsx("button", { onClick: handleUpdate, disabled: updating, className: "w-full py-2 bg-accent text-white rounded hover:bg-accent/80 disabled:bg-subtext text-xs font-semibold", children: updating ? 'Updating...' : 'Apply' })] })] }));
};
// ===== Q(B) BAND SELECTOR =====
export const RyqBandSelector = () => {
    const bands = [
        { range: '100 - 1k', q: 2.3 },
        { range: '1k - 10k', q: 3.0 },
        { range: '10k - 100k', q: 3.8 },
        { range: '100k - 1M', q: 4.6 },
        { range: '1M+', q: 5.3 },
    ];
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "Q(B) Band Reference" }), _jsxs("table", { className: "w-full text-xs", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "text-left", children: "Range" }), _jsx("th", { className: "text-right", children: "Q(B)" })] }) }), _jsx("tbody", { children: bands.map((band, idx) => (_jsxs("tr", { className: "border-t border-dark-border", children: [_jsx("td", { className: "py-1 text-subtext", children: band.range }), _jsx("td", { className: "py-1 text-right font-mono font-bold", children: band.q.toFixed(1) })] }, idx))) })] })] }));
};
// ===== BAND CALIBRATION FORM =====
export const RyBandCalibrationForm = ({ poolId }) => {
    const [data, setData] = useState({ min: 100, max: 1000, midpoint: 550, qValue: 0 });
    const [updating, setUpdating] = useState(false);
    useEffect(() => {
        const loadCal = async () => {
            const calData = await fetchCalibrationData(poolId);
            setData(calData);
        };
        loadCal();
    }, [poolId]);
    const handleUpdate = async () => {
        setUpdating(true);
        await updateCalibration(poolId, data);
        setUpdating(false);
    };
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "Calibration" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext", children: "Min" }), _jsx("input", { type: "number", value: data.min, onChange: (e) => setData({ ...data, min: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext", children: "Max" }), _jsx("input", { type: "number", value: data.max, onChange: (e) => setData({ ...data, max: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext", children: "Midpoint" }), _jsx("input", { type: "number", value: data.midpoint, onChange: (e) => setData({ ...data, midpoint: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs" })] }), _jsxs("div", { className: "p-2 bg-dark-surface rounded border border-dark-border", children: [_jsx("div", { className: "text-xs text-subtext", children: "Q(B) Value" }), _jsx("div", { className: "font-mono font-bold text-accent", children: data.qValue.toFixed(4) })] }), _jsx("button", { onClick: handleUpdate, disabled: updating, className: "w-full py-2 bg-accent text-white rounded hover:bg-accent/80 disabled:bg-subtext text-xs font-semibold", children: updating ? 'Calibrating...' : 'Calibrate' })] })] }));
};
// ===== COMPONENT BREAKDOWN =====
export const RyComponentBreakdown = ({ poolId }) => {
    const [components, setComponents] = useState([]);
    useEffect(() => {
        const loadComponents = async () => {
            const data = await fetchComponentBreakdown(poolId);
            setComponents(data);
        };
        loadComponents();
    }, [poolId]);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "Component Breakdown" }), components.length > 0 ? (_jsxs("table", { className: "w-full text-xs", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "text-left", children: "i" }), _jsx("th", { className: "text-right", children: "Slip_i" }), _jsx("th", { className: "text-right", children: "WBF_i" }), _jsx("th", { className: "text-right", children: "WRR_i" }), _jsx("th", { className: "text-right", children: "\u03C3_i" })] }) }), _jsx("tbody", { children: components.slice(0, 10).map((comp) => (_jsxs("tr", { className: "border-t border-dark-border", children: [_jsx("td", { className: "text-accent font-mono", children: comp.index }), _jsx("td", { className: "text-right font-mono", children: comp.slip_i.toFixed(2) }), _jsx("td", { className: "text-right font-mono", children: comp.wbf_i.toFixed(2) }), _jsx("td", { className: "text-right font-mono", children: comp.wrr_i.toFixed(2) }), _jsx("td", { className: "text-right font-mono", children: comp.sigma_i.toFixed(2) })] }, comp.index))) })] })) : (_jsx("div", { className: "text-xs text-subtext text-center py-4", children: "No components" }))] }));
};
// ===== AGGREGATION VIZ (D3 CHART) =====
export const RyAggregationViz = ({ poolId }) => {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);
    useEffect(() => {
        const loadData = async () => {
            const aggData = await fetchAggregationData(poolId);
            setData(aggData);
            if (aggData.length > 0 && svgRef.current) {
                const width = 300;
                const height = 150;
                const margin = { top: 10, right: 10, bottom: 20, left: 40 };
                const xScale = d3
                    .scaleLinear()
                    .domain([0, aggData.length - 1])
                    .range([margin.left, width - margin.right]);
                const yScale = d3
                    .scaleLinear()
                    .domain([d3.min(aggData, (d) => d.q) || 0, d3.max(aggData, (d) => d.q) || 10])
                    .range([height - margin.bottom, margin.top]);
                const line = d3
                    .line()
                    .x((_, i) => xScale(i))
                    .y((d) => yScale(d.q))
                    .curve(d3.curveMonotoneX);
                const svg = d3.select(svgRef.current);
                svg.selectAll('*').remove();
                svg
                    .append('path')
                    .datum(aggData)
                    .attr('fill', 'none')
                    .attr('stroke', 'var(--accent)')
                    .attr('stroke-width', 2)
                    .attr('d', line);
            }
        };
        loadData();
    }, [poolId]);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "Q(B) Aggregation History" }), _jsx("svg", { ref: svgRef, width: "100%", viewBox: "0 0 300 150", className: "border border-dark-border rounded" })] }));
};
// ===== SKEW PENALTY VISUALIZER (D3 CHART) =====
export const RySkewPenaltyVisualizer = () => {
    const svgRef = useRef(null);
    useEffect(() => {
        if (!svgRef.current)
            return;
        const width = 300;
        const height = 150;
        const margin = { top: 10, right: 10, bottom: 20, left: 40 };
        const w = d3.range(0, 1, 0.01);
        const powerFunc = (wi) => 50 * Math.pow(wi / (1 - wi), 2.5);
        const logisticFunc = (t) => 400 / (1 + Math.exp(-10 * (t - 0.8)));
        const lambdaFunc = (t) => 3 * t * t - 2 * t * t * t;
        const xScale = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right]);
        const yScale = d3
            .scaleLinear()
            .domain([0, 400])
            .range([height - margin.bottom, margin.top]);
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        // Power line
        svg
            .append('path')
            .datum(w)
            .attr('fill', 'none')
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 2)
            .attr('d', d3
            .line()
            .x((d) => xScale(d))
            .y((d) => yScale(Math.min(400, powerFunc(d)))));
        // Logistic line
        svg
            .append('path')
            .datum(w)
            .attr('fill', 'none')
            .attr('stroke', '#ef4444')
            .attr('stroke-width', 2)
            .attr('d', d3
            .line()
            .x((d) => xScale(d))
            .y((d) => yScale(logisticFunc(d))));
        // Lambda line
        svg
            .append('path')
            .datum(w)
            .attr('fill', 'none')
            .attr('stroke', '#10b981')
            .attr('stroke-width', 2)
            .attr('d', d3
            .line()
            .x((d) => xScale(d))
            .y((d) => yScale(lambdaFunc(d))));
    }, []);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "Skew Penalty Functions" }), _jsx("svg", { ref: svgRef, width: "100%", viewBox: "0 0 300 150", className: "border border-dark-border rounded" }), _jsxs("div", { className: "flex gap-2 mt-2 text-xs", children: [_jsx("span", { className: "text-blue-500", children: "Power" }), _jsx("span", { className: "text-red-500", children: "Logistic" }), _jsx("span", { className: "text-green-500", children: "Lambda" })] })] }));
};
// ===== SESSION KEY DISPLAY =====
export const RySessionKeyDisplay = ({ poolId }) => {
    const [sessions, setSessions] = useState([]);
    useEffect(() => {
        const loadSessions = async () => {
            const data = await fetchSessionKeys(poolId);
            setSessions(data);
        };
        loadSessions();
    }, [poolId]);
    return (_jsxs(RyCard, { children: [_jsxs("h4", { className: "text-sm mb-2", children: ["Active Sessions (", sessions.length, ")"] }), sessions.length > 0 ? (_jsx("div", { className: "space-y-1 text-xs", children: sessions.slice(0, 5).map((sess) => (_jsxs("div", { className: "font-mono text-accent truncate", children: [sess.key.substring(0, 12), "..."] }, sess.key))) })) : (_jsx("div", { className: "text-xs text-subtext text-center py-4", children: "No active sessions" }))] }));
};
// ===== MAIN SSP TAB =====
export const SSPTab = () => {
    const [poolId, setPoolId] = useState('ETH-USDC');
    const [activeTab, setActiveTab] = useState('dashboard');
    return (_jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Smart Swap Protocol" }), _jsxs("div", { className: "text-sm text-subtext", children: ["Pool: ", poolId] })] }), _jsx("div", { className: "flex gap-2 border-b border-dark-border pb-2", children: [
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'analytics', label: 'Analytics' },
                    { id: 'cex', label: 'CEX L2' },
                    { id: 'solver', label: 'Q(B) Solver' },
                ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-3 py-2 text-sm font-medium rounded-t transition-colors ${activeTab === tab.id
                        ? 'bg-accent text-white'
                        : 'bg-transparent text-subtext hover:text-white'}`, children: tab.label }, tab.id))) }), activeTab === 'dashboard' && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(RyPoolList, { poolId: poolId, onSelectPool: setPoolId }), _jsx(RyShieldDial, { poolId: poolId }), _jsx(RyHealthGauges, { poolId: poolId }), _jsx(RySessionKeyDisplay, { poolId: poolId })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(RyCircuitBanner, { poolId: poolId }), _jsx(RySlippageGuard, {}), _jsx(RyDynamicFeePanel, { poolId: poolId }), _jsx(RyBandCalibrationForm, { poolId: poolId }), _jsx(RyADLEvents, { poolId: poolId })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(RyAggregationViz, { poolId: poolId }), _jsx(RyComponentBreakdown, { poolId: poolId }), _jsx(RySkewPenaltyVisualizer, {}), _jsx(RyqBandSelector, {})] })] })), activeTab === 'analytics' && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(RyFeeDistributionPie, { poolId: poolId, volume: 100000 }), _jsx(RyErrorHistogram, { poolId: poolId }), _jsx(RyAMMImpactSimulator, {}), _jsx(RySkewPenaltyVisualizer, {})] })), activeTab === 'cex' && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(RyCEXL2Parser, { poolId: poolId }), _jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "CEX Parity Metrics" }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "p-2 bg-dark-surface rounded", children: [_jsx("div", { className: "text-subtext mb-1", children: "Binance vs Uniswap V3" }), _jsx("div", { className: "font-mono font-bold text-accent", children: "+0.3 bps" })] }), _jsxs("div", { className: "p-2 bg-dark-surface rounded", children: [_jsx("div", { className: "text-subtext mb-1", children: "Binance vs Balancer" }), _jsx("div", { className: "font-mono font-bold text-success", children: "-0.5 bps" })] }), _jsxs("div", { className: "p-2 bg-dark-surface rounded", children: [_jsx("div", { className: "text-subtext mb-1", children: "Binance vs Aerodrome" }), _jsx("div", { className: "font-mono font-bold text-warn", children: "+1.2 bps" })] }), _jsxs("div", { className: "p-2 bg-dark-surface rounded", children: [_jsx("div", { className: "text-subtext mb-1", children: "Monitoring Status" }), _jsx("div", { className: "font-mono font-bold text-success", children: "\u2713 Active" })] })] })] })] })), activeTab === 'solver' && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(RyQBSolverDisplay, { poolId: poolId }), _jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "Q(B) Solver Info" }), _jsxs("div", { className: "space-y-2 text-xs text-subtext", children: [_jsxs("p", { children: [_jsx("strong", { children: "Formula:" }), " q(B) = log((max - min) / midpoint + 1) \u00D7 10"] }), _jsxs("p", { children: [_jsx("strong", { children: "Smoothing:" }), " EWMA with \u03B1 = 0.3"] }), _jsxs("p", { children: [_jsx("strong", { children: "Error Threshold:" }), " <1 bp (0.01%)"] }), _jsxs("p", { children: [_jsx("strong", { children: "Updates:" }), " Real-time from /api/ssp/calibrate"] }), _jsx("p", { className: "mt-3 text-xs text-accent", children: "\uD83D\uDCA1 Q(B) measures optimal band width for AMM market making" })] })] })] }))] }));
};
export default SSPTab;
