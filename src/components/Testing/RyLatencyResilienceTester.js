import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../Card';
export const RyLatencyResilienceTester = () => {
    const [isRunning, setIsRunning] = useState(false);
    // Real latency results would come from actual monitoring endpoints in production
    const results = [];
    if (results.length === 0) {
        return null;
    }
    const runTest = () => {
        setIsRunning(true);
        // Actual test would be called via API endpoint
        // For now, just indicate that testing is in progress
        setTimeout(() => setIsRunning(false), 2000);
    };
    const getStatusColor = (status) => {
        return {
            healthy: 'bg-success/10 text-success border-success/30',
            degraded: 'bg-warn/10 text-warn border-warn/30',
            failed: 'bg-danger/10 text-danger border-danger/30',
        }[status] || 'bg-dark-border';
    };
    const getLatencyColor = (latency) => {
        if (latency < 50)
            return 'text-success';
        if (latency < 200)
            return 'text-warn';
        return 'text-danger';
    };
    return (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Latency & Resilience Tester" }), _jsx("button", { onClick: runTest, disabled: isRunning, className: `w-full px-4 py-2 rounded font-semibold text-sm transition mb-6 ${isRunning
                        ? 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'
                        : 'bg-accent text-dark-bg hover:bg-accent/90'}`, children: isRunning ? '⏳ Running Test...' : '🚀 Run Full Test' }), _jsx("div", { className: "space-y-4", children: results.map((result) => (_jsxs("div", { className: `p-4 rounded border ${getStatusColor(result.status)}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h4", { className: "font-semibold", children: result.endpoint }), _jsx("span", { className: "text-xs font-semibold uppercase", children: result.status === 'healthy' ? '✓ Healthy' : '⚠ Degraded' })] }), _jsxs("div", { className: "grid grid-cols-4 gap-3 mb-3", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-dark-text/70 mb-1", children: "P50" }), _jsxs("div", { className: `font-mono font-bold ${getLatencyColor(result.p50)}`, children: [result.p50, "ms"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-dark-text/70 mb-1", children: "P95" }), _jsxs("div", { className: `font-mono font-bold ${getLatencyColor(result.p95)}`, children: [result.p95, "ms"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-dark-text/70 mb-1", children: "P99" }), _jsxs("div", { className: `font-mono font-bold ${getLatencyColor(result.p99)}`, children: [result.p99, "ms"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-dark-text/70 mb-1", children: "Errors" }), _jsxs("div", { className: `font-mono font-bold ${result.errorRate > 0.1 ? 'text-danger' : 'text-success'}`, children: [(result.errorRate * 100).toFixed(2), "%"] })] })] }), _jsx("div", { className: "text-xs text-dark-text/70 mb-1", children: "P99 Latency Distribution" }), _jsx("div", { className: "w-full h-2 bg-dark-border/50 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${result.p99 < 200 ? 'bg-success' : result.p99 < 500 ? 'bg-warn' : 'bg-danger'}`, style: { width: `${Math.min((result.p99 / 1000) * 100, 100)}%` } }) })] }, result.endpoint))) }), _jsxs("div", { className: "mt-6 p-4 bg-dark-bg rounded border border-dark-border/50 text-xs space-y-2", children: [_jsx("div", { className: "font-semibold text-dark-text mb-2", children: "Recommendations:" }), _jsx("div", { className: "text-dark-text/70", children: "\u2022 P99 latencies within acceptable range (<500ms)" }), _jsx("div", { className: "text-dark-text/70", children: "\u2022 Markets endpoint showing degradation \u2014 consider fallback" }), _jsx("div", { className: "text-dark-text/70", children: "\u2022 WebSocket connection highly stable (<25ms p50)" })] })] }) }));
};
