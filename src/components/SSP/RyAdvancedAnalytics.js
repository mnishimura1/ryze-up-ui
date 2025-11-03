import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Advanced SSP Analytics Components
 * Features: Fee Pie Chart, Error Histogram, CEX L2 Visualization, AMM Impact Simulator
 */
import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { RyCard } from '../primitives/RyCard';
import { parseL2Depth, calculateAMMImpact, generateErrorHistogram, calculateFeeDistribution, solveQB, } from '../../lib/ssp-solvers';
// ===== FEE DISTRIBUTION PIE CHART =====
export const RyFeeDistributionPie = ({ poolId, volume = 100000, }) => {
    const svgRef = useRef(null);
    const [fees, setFees] = useState({
        protocolFee: 250,
        lpIncentive: 150,
        insurancePool: 100,
        total: 500,
        breakdown: [
            { name: 'Protocol', amount: 250, percentage: 50, color: '#3b82f6' },
            { name: 'LP Incentive', amount: 150, percentage: 30, color: '#10b981' },
            { name: 'Insurance', amount: 100, percentage: 20, color: '#f97316' },
        ],
    });
    useEffect(() => {
        const loadFees = async () => {
            try {
                const res = await axios.get(`/api/ssp/fees/${poolId}`);
                if (res.data?.distributions) {
                    setFees(res.data);
                }
                else {
                    setFees(calculateFeeDistribution(volume));
                }
            }
            catch {
                setFees(calculateFeeDistribution(volume));
            }
        };
        loadFees();
    }, [poolId, volume]);
    useEffect(() => {
        if (!svgRef.current || !fees.breakdown)
            return;
        const width = 250;
        const height = 200;
        const radius = Math.min(width, height) / 2 - 10;
        const pie = d3.pie().value((d) => d.percentage);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);
        const arcs = pie(fees.breakdown.map((d) => ({
            ...d,
            percentage: d.percentage,
        })));
        g.selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('d', (d) => arc(d) || '')
            .attr('fill', (d, i) => fees.breakdown[i]?.color || '#666')
            .attr('stroke', '#1f2937')
            .attr('stroke-width', 2);
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
            .text((d, i) => `${fees.breakdown[i]?.percentage.toFixed(0)}%`);
    }, [fees]);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "Fee Distribution" }), _jsx("svg", { ref: svgRef, width: "100%", viewBox: "0 0 250 200", className: "border border-dark-border rounded", style: { maxHeight: '200px' } }), _jsxs("div", { className: "mt-3 space-y-2 text-xs", children: [fees.breakdown.map((item) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded", style: { backgroundColor: item.color } }), _jsx("span", { className: "text-subtext", children: item.name })] }), _jsxs("span", { className: "font-mono font-bold", children: ["$", item.amount.toFixed(2)] })] }, item.name))), _jsxs("div", { className: "border-t border-dark-border pt-2 flex justify-between font-semibold", children: [_jsx("span", { children: "Total Fees" }), _jsxs("span", { className: "text-accent", children: ["$", fees.total.toFixed(2)] })] })] })] }));
};
// ===== CEX L2 DEPTH PARSER =====
export const RyCEXL2Parser = ({ poolId }) => {
    const [l2Data, setL2Data] = useState(null);
    const [loading, setLoading] = useState(false);
    const fetchBinanceDepth = async () => {
        setLoading(true);
        try {
            // Try to fetch from backend first, otherwise call Binance directly
            let depth;
            try {
                const res = await axios.get(`/api/ssp/binance-depth/${poolId}`);
                depth = res.data;
            }
            catch {
                // Fallback: Fetch directly from Binance (CORS may block)
                const res = await axios.get('https://api.binance.com/api/v3/depth?symbol=ETHUSDT&limit=20');
                depth = {
                    bids: res.data.bids.map((b) => [Number(b[0]), Number(b[1])]),
                    asks: res.data.asks.map((a) => [Number(a[0]), Number(a[1])]),
                    timestamp: Date.now(),
                };
            }
            const parsed = parseL2Depth(depth);
            setL2Data(parsed);
        }
        catch (err) {
            console.error('Failed to fetch L2 depth:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBinanceDepth();
        const interval = setInterval(fetchBinanceDepth, 5000);
        return () => clearInterval(interval);
    }, [poolId]);
    if (!l2Data) {
        return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "CEX L2 Depth" }), _jsx("div", { className: "text-xs text-subtext text-center py-4", children: loading ? 'Loading...' : 'No data' })] }));
    }
    return (_jsxs(RyCard, { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h4", { className: "text-sm font-semibold", children: "CEX L2 Depth (Binance)" }), _jsx("button", { onClick: fetchBinanceDepth, disabled: loading, className: "text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30", children: loading ? 'Refreshing...' : 'Refresh' })] }), _jsxs("div", { className: "space-y-3 text-xs", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2 p-2 bg-dark-surface rounded", children: [_jsxs("div", { children: [_jsx("div", { className: "text-subtext", children: "Mid Price" }), _jsxs("div", { className: "font-mono font-bold text-accent", children: ["$", l2Data.midPrice.toFixed(2)] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-subtext", children: "Spread" }), _jsxs("div", { className: "font-mono font-bold text-warn", children: [l2Data.spreadBps.toFixed(2), " bps"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 p-2 bg-dark-surface rounded", children: [_jsxs("div", { children: [_jsx("div", { className: "text-subtext", children: "$10k Impact" }), _jsxs("div", { className: "font-mono font-bold", children: [l2Data.impact10k.toFixed(2), " bps"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-subtext", children: "$100k Impact" }), _jsxs("div", { className: `font-mono font-bold ${l2Data.impact100k > 50 ? 'text-danger' : 'text-success'}`, children: [l2Data.impact100k.toFixed(2), " bps"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 p-2 bg-dark-surface rounded", children: [_jsxs("div", { children: [_jsx("div", { className: "text-subtext", children: "Bid VWAP" }), _jsxs("div", { className: "font-mono text-success", children: ["$", l2Data.bidVWAP.toFixed(2)] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-subtext", children: "Ask VWAP" }), _jsxs("div", { className: "font-mono text-danger", children: ["$", l2Data.askVWAP.toFixed(2)] })] })] }), _jsxs("div", { className: "p-2 bg-dark-surface rounded", children: [_jsx("div", { className: "text-subtext", children: "Total Liquidity" }), _jsxs("div", { className: "font-mono font-bold text-accent", children: [l2Data.liquidity.toFixed(0), " units"] })] })] })] }));
};
// ===== AMM IMPACT SIMULATOR =====
export const RyAMMImpactSimulator = () => {
    const [params, setParams] = useState({ reserveIn: 1000000, reserveOut: 1000000, amountIn: 10000 });
    const [results, setResults] = useState(null);
    useEffect(() => {
        const result = calculateAMMImpact({
            reserveIn: params.reserveIn,
            reserveOut: params.reserveOut,
            amountIn: params.amountIn,
        });
        setResults(result);
    }, [params]);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "AMM Impact Simulator" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext mb-1 block", children: "Reserve In (Token A)" }), _jsx("input", { type: "number", value: params.reserveIn, onChange: (e) => setParams({ ...params, reserveIn: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext mb-1 block", children: "Reserve Out (Token B)" }), _jsx("input", { type: "number", value: params.reserveOut, onChange: (e) => setParams({ ...params, reserveOut: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext mb-1 block", children: "Trade Amount (Token A)" }), _jsx("input", { type: "number", value: params.amountIn, onChange: (e) => setParams({ ...params, amountIn: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono" })] }), results && (_jsxs("div", { className: "mt-3 p-2 bg-dark-surface rounded border border-dark-border space-y-2", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-subtext", children: "Amount Out:" }), _jsx("span", { className: "font-mono font-bold", children: results.amountOut.toFixed(2) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-subtext", children: "Execution Price:" }), _jsx("span", { className: "font-mono font-bold", children: results.executionPrice.toFixed(6) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-subtext", children: "Price Impact:" }), _jsxs("span", { className: `font-mono font-bold ${results.priceImpactBps > 50 ? 'text-danger' : 'text-success'}`, children: [results.priceImpactBps.toFixed(2), " bps"] })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-subtext", children: "Fee Amount (0.3%):" }), _jsx("span", { className: "font-mono font-bold text-warn", children: results.feeAmount.toFixed(2) })] })] }))] })] }));
};
// ===== ERROR HISTOGRAM =====
export const RyErrorHistogram = ({ poolId }) => {
    const svgRef = useRef(null);
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        const loadErrors = async () => {
            try {
                // Fetch historical prediction errors from API
                const res = await axios.get(`/api/ssp/error-history/${poolId}`);
                setErrors(res.data || generateMockErrors());
            }
            catch {
                // Generate mock data if API unavailable
                setErrors(generateMockErrors());
            }
        };
        loadErrors();
    }, [poolId]);
    useEffect(() => {
        if (!svgRef.current || errors.length === 0)
            return;
        const histogram = generateErrorHistogram(errors, 0.5);
        const width = 300;
        const height = 150;
        const margin = { top: 10, right: 10, bottom: 20, left: 40 };
        const xScale = d3
            .scaleLinear()
            .domain([0, Math.max(...histogram.map((h) => h.rangeEnd))])
            .range([margin.left, width - margin.right]);
        const yScale = d3
            .scaleLinear()
            .domain([0, Math.max(...histogram.map((h) => h.count))])
            .range([height - margin.bottom, margin.top]);
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
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
            .attr('opacity', 0.7);
    }, [errors]);
    const generateMockErrors = () => {
        return Array.from({ length: 100 }, () => (Math.random() - 0.5) * 2); // Random errors ±1 bps
    };
    const avgError = errors.length > 0 ? errors.reduce((a, b) => a + b) / errors.length : 0;
    const maxError = errors.length > 0 ? Math.max(...errors.map((e) => Math.abs(e))) : 0;
    const rmse = errors.length > 0 ? Math.sqrt(errors.reduce((a, b) => a + b * b) / errors.length) : 0;
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-2", children: "Prediction Error Distribution" }), _jsx("svg", { ref: svgRef, width: "100%", viewBox: "0 0 300 150", className: "border border-dark-border rounded mb-3" }), _jsxs("div", { className: "space-y-1 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-subtext", children: "Avg Error:" }), _jsxs("span", { className: "font-mono", children: [avgError.toFixed(3), " bps"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-subtext", children: "Max Error:" }), _jsxs("span", { className: `font-mono ${maxError > 1 ? 'text-danger' : 'text-success'}`, children: [maxError.toFixed(3), " bps"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-subtext", children: "RMSE:" }), _jsxs("span", { className: "font-mono", children: [rmse.toFixed(3), " bps"] })] })] })] }));
};
// ===== Q(B) SOLVER DISPLAY =====
export const RyQBSolverDisplay = ({ poolId }) => {
    const [solverParams, setSolverParams] = useState({
        min: 100,
        max: 1000,
        midpoint: 550,
    });
    const [result, setResult] = useState(null);
    useEffect(() => {
        const result = solveQB({
            ...solverParams,
            ewmaAlpha: 0.3,
        });
        setResult(result);
    }, [solverParams]);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "text-sm mb-3", children: "Q(B) Solver (EWMA \u03B1=0.3)" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext", children: "Min" }), _jsx("input", { type: "number", value: solverParams.min, onChange: (e) => setSolverParams({ ...solverParams, min: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext", children: "Max" }), _jsx("input", { type: "number", value: solverParams.max, onChange: (e) => setSolverParams({ ...solverParams, max: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-subtext", children: "Midpoint" }), _jsx("input", { type: "number", value: solverParams.midpoint, onChange: (e) => setSolverParams({ ...solverParams, midpoint: Number(e.target.value) }), className: "w-full p-1 rounded border border-dark-border bg-dark-surface text-white text-xs font-mono" })] })] }), result && (_jsxs("div", { className: `p-2 rounded border ${result.valid ? 'border-success bg-success/10' : 'border-danger bg-danger/10'}`, children: [_jsxs("div", { className: "text-xs mb-2", children: [result.valid ? '✓' : '⚠', " ", result.message] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-subtext", children: "Raw Q(B):" }), _jsx("span", { className: "font-mono font-bold", children: result.qValue.toFixed(4) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-subtext", children: "Smoothed Q(B):" }), _jsx("span", { className: "font-mono font-bold text-accent", children: result.qValueSmoothed.toFixed(4) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-subtext", children: "Error:" }), _jsx("span", { className: `font-mono font-bold ${result.error < 0.0001 ? 'text-success' : 'text-warn'}`, children: result.error.toFixed(6) })] })] })] }))] })] }));
};
export default {
    RyFeeDistributionPie,
    RyCEXL2Parser,
    RyAMMImpactSimulator,
    RyErrorHistogram,
    RyQBSolverDisplay,
};
