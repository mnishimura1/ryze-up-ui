import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
export const RyBatchRefundMetrics = () => {
    // Mock data - in production, fetch from /api/refunds/metrics
    const metrics = useMemo(() => ({
        totalRefunds: 2847.53,
        numberOfTrades: 156,
        averagePerTrade: 18.25,
        dailyCapsUsage: 0.72, // 72% of daily cap
        venueBreakdown: {
            'Uniswap V3': 0.45,
            'Aerodrome': 0.30,
            'Balancer': 0.25,
        },
    }), []);
    const dailyCapLimit = 10000;
    const dailyCapsUsageAmount = metrics.totalRefunds % dailyCapLimit;
    return (_jsxs("div", { className: "space-y-6", role: "region", "aria-label": "Batch refund metrics", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Refund Metrics" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Total Refunds" }), _jsxs("p", { className: "text-2xl font-bold text-green-400 font-mono", children: ["$", metrics.totalRefunds.toFixed(2)] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Trades Count" }), _jsx("p", { className: "text-2xl font-bold text-white font-mono", children: metrics.numberOfTrades })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Avg Per Trade" }), _jsxs("p", { className: "text-2xl font-bold text-blue-400 font-mono", children: ["$", metrics.averagePerTrade.toFixed(2)] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Daily Cap Usage" }), _jsxs("p", { className: "text-2xl font-bold text-orange-400 font-mono", children: [(metrics.dailyCapsUsage * 100).toFixed(0), "%"] })] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-semibold", children: "Daily Cap Status" }), _jsxs("span", { className: "text-sm text-slate-400", children: ["$", dailyCapsUsageAmount.toFixed(0), " / $", dailyCapLimit.toLocaleString()] })] }), _jsx("div", { className: "w-full bg-slate-700 rounded-full h-4 mb-2", children: _jsx("div", { className: `h-4 rounded-full transition-all ${metrics.dailyCapsUsage >= 0.9
                                ? 'bg-red-500'
                                : metrics.dailyCapsUsage >= 0.7
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'}`, style: { width: `${metrics.dailyCapsUsage * 100}%` } }) }), _jsxs("div", { className: "text-xs text-slate-400", children: [metrics.dailyCapsUsage >= 0.9 && '🔴 Near daily limit', metrics.dailyCapsUsage >= 0.7 &&
                                metrics.dailyCapsUsage < 0.9 &&
                                '🟡 High usage', metrics.dailyCapsUsage < 0.7 && '🟢 Normal usage'] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("h4", { className: "font-semibold mb-4", children: "Venue Breakdown" }), _jsx("div", { className: "space-y-4", children: Object.entries(metrics.venueBreakdown)
                            .sort(([, a], [, b]) => b - a)
                            .map(([venue, percentage]) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-slate-300", children: venue }), _jsxs("span", { className: "font-mono font-semibold", children: [(percentage * 100).toFixed(0), "%"] })] }), _jsx("div", { className: "w-full bg-slate-700 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full ${venue.includes('Uniswap')
                                            ? 'bg-blue-500'
                                            : venue.includes('Aerodrome')
                                                ? 'bg-green-500'
                                                : 'bg-purple-500'}`, style: { width: `${percentage * 100}%` } }) })] }, venue))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-900/30 to-slate-800 rounded-lg p-4 border border-blue-700/30", children: [_jsx("p", { className: "text-xs font-medium text-blue-300 mb-2", children: "Largest Refund" }), _jsx("p", { className: "text-2xl font-bold text-blue-400", children: "$127.50" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Trade #42853" })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-900/30 to-slate-800 rounded-lg p-4 border border-green-700/30", children: [_jsx("p", { className: "text-xs font-medium text-green-300 mb-2", children: "Most Active Venue" }), _jsx("p", { className: "text-2xl font-bold text-green-400", children: "Uniswap V3" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "45% of refunds" })] }), _jsxs("div", { className: "bg-gradient-to-br from-purple-900/30 to-slate-800 rounded-lg p-4 border border-purple-700/30", children: [_jsx("p", { className: "text-xs font-medium text-purple-300 mb-2", children: "Claim Status" }), _jsx("p", { className: "text-2xl font-bold text-purple-400", children: "73 Pending" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Ready to claim" })] })] }), _jsx("button", { className: "w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors", "aria-label": "View detailed refund breakdown", children: "\uD83D\uDCCA View Detailed Breakdown" })] }));
};
