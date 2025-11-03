import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useStore } from '../../lib/store';
export const RyUnitsDashboard = () => {
    const units = useStore((s) => s.units);
    const stats = useMemo(() => {
        const earned = units.revenue_share || 0;
        const tgeRate = units.tge_rate || 0;
        const tgeAmount = (units.balance || 0) * tgeRate;
        return {
            totalUnits: units.balance || 0,
            earned,
            tgeRate,
            tgeAmount,
            emissionBreakdown: {
                lp: (units.emissions?.lp || 0),
                trader: (units.emissions?.trader || 0),
                referral: (units.emissions?.referral || 0),
            },
            gaugeWeights: {
                lp: units.gauge_weights?.lp || 0,
                trader: units.gauge_weights?.trader || 0,
                referral: units.gauge_weights?.referral || 0,
            }
        };
    }, [units]);
    const claimRevenue = async () => {
        try {
            const response = await fetch('/api/units/claim-revenue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: stats.earned }),
            });
            if (response.ok) {
                // Dispatch success toast
                console.log('Revenue claimed successfully');
            }
        }
        catch (error) {
            console.error('Failed to claim revenue:', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", role: "region", "aria-label": "Units economy dashboard", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Units Economy" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4", children: [_jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Total Units" }), _jsx("p", { className: "text-2xl font-bold font-mono text-white", children: stats.totalUnits.toLocaleString('en-US', {
                                    maximumFractionDigits: 0,
                                }) })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Revenue Earned" }), _jsxs("p", { className: "text-2xl font-bold text-green-400", children: ["$", stats.earned.toFixed(0)] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "TGE Rate" }), _jsxs("p", { className: "text-2xl font-bold font-mono text-white", children: [(stats.tgeRate * 100).toFixed(2), "%"] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "TGE Amount" }), _jsx("p", { className: "text-2xl font-bold text-cyan-400", children: stats.tgeAmount.toLocaleString('en-US', {
                                    maximumFractionDigits: 0,
                                }) })] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("h4", { className: "font-semibold mb-4", children: "Emissions Breakdown" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-slate-300", children: "LP Emissions" }), _jsx("span", { className: "font-mono font-semibold", children: stats.emissionBreakdown.lp.toLocaleString() })] }), _jsx("div", { className: "w-full bg-slate-700 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full", style: {
                                                width: `${(stats.emissionBreakdown.lp /
                                                    (stats.emissionBreakdown.lp +
                                                        stats.emissionBreakdown.trader +
                                                        stats.emissionBreakdown.referral)) *
                                                    100}%`,
                                            } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-slate-300", children: "Trader Emissions" }), _jsx("span", { className: "font-mono font-semibold", children: stats.emissionBreakdown.trader.toLocaleString() })] }), _jsx("div", { className: "w-full bg-slate-700 rounded-full h-2", children: _jsx("div", { className: "bg-green-500 h-2 rounded-full", style: {
                                                width: `${(stats.emissionBreakdown.trader /
                                                    (stats.emissionBreakdown.lp +
                                                        stats.emissionBreakdown.trader +
                                                        stats.emissionBreakdown.referral)) *
                                                    100}%`,
                                            } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-slate-300", children: "Referral Emissions" }), _jsx("span", { className: "font-mono font-semibold", children: stats.emissionBreakdown.referral.toLocaleString() })] }), _jsx("div", { className: "w-full bg-slate-700 rounded-full h-2", children: _jsx("div", { className: "bg-orange-500 h-2 rounded-full", style: {
                                                width: `${(stats.emissionBreakdown.referral /
                                                    (stats.emissionBreakdown.lp +
                                                        stats.emissionBreakdown.trader +
                                                        stats.emissionBreakdown.referral)) *
                                                    100}%`,
                                            } }) })] })] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("h4", { className: "font-semibold mb-4", children: "Gauge Weights (Sum: 100%)" }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "LP Weight" }), _jsxs("p", { className: "text-xl font-bold text-blue-400", children: [stats.gaugeWeights.lp.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Trader Weight" }), _jsxs("p", { className: "text-xl font-bold text-green-400", children: [stats.gaugeWeights.trader.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Referral Weight" }), _jsxs("p", { className: "text-xl font-bold text-orange-400", children: [stats.gaugeWeights.referral.toFixed(1), "%"] })] })] })] }), _jsxs("button", { onClick: claimRevenue, disabled: stats.earned <= 0, className: `w-full py-3 rounded-lg font-semibold transition-colors ${stats.earned > 0
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`, "aria-label": `Claim revenue: $${stats.earned.toFixed(0)}`, children: ["\uD83D\uDCB0 Claim Revenue ($", stats.earned.toFixed(0), ")"] })] }));
};
