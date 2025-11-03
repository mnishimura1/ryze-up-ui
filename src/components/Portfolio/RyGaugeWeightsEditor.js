import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useStore } from '../../lib/store';
export const RyGaugeWeightsEditor = () => {
    const units = useStore((s) => s.units);
    const [weights, setWeights] = useState({
        lp: units.gauge_weights?.lp || 33.33,
        trader: units.gauge_weights?.trader || 33.33,
        referral: units.gauge_weights?.referral || 33.34,
    });
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState(null);
    const total = useMemo(() => {
        return weights.lp + weights.trader + weights.referral;
    }, [weights]);
    const isValid = useMemo(() => {
        return Math.abs(total - 100) < 0.01; // Allow for floating point errors
    }, [total]);
    const applyWeights = async () => {
        if (!isValid) {
            setError(`Weights must sum to 100% (currently ${total.toFixed(2)}%)`);
            return;
        }
        setIsApplying(true);
        setError(null);
        try {
            const response = await fetch('/api/units/gauge-weights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lp: weights.lp / 100,
                    trader: weights.trader / 100,
                    referral: weights.referral / 100,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to apply gauge weights');
            }
            console.log('Gauge weights applied successfully');
        }
        catch (err) {
            const errMsg = err instanceof Error ? err.message : 'Failed to apply weights';
            setError(errMsg);
        }
        finally {
            setIsApplying(false);
        }
    };
    const handleWeightChange = (type, value) => {
        setWeights((prev) => ({
            ...prev,
            [type]: Math.max(0, Math.min(100, value)),
        }));
        setError(null);
    };
    const resetToDefaults = () => {
        setWeights({
            lp: 33.33,
            trader: 33.33,
            referral: 33.34,
        });
        setError(null);
    };
    const distributeEqually = () => {
        const equal = 100 / 3;
        setWeights({
            lp: equal,
            trader: equal,
            referral: 100 - equal * 2,
        });
        setError(null);
    };
    return (_jsxs("div", { className: "space-y-6", role: "region", "aria-label": "Gauge weights editor", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Gauge Weights" }), _jsx("div", { className: "text-sm text-slate-400", children: "Sum must equal 100%" })] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "bg-slate-800 rounded-lg p-5 border border-slate-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { htmlFor: "lp-weight", className: "font-medium text-slate-300", children: "LP Rewards Weight" }), _jsxs("div", { className: "flex items-baseline gap-1", children: [_jsx("input", { id: "lp-weight", type: "number", value: weights.lp.toFixed(2), onChange: (e) => handleWeightChange('lp', Number(e.target.value)), className: "w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-right", min: "0", max: "100", step: "0.01", "aria-label": "LP rewards weight percentage" }), _jsx("span", { className: "text-slate-400", children: "%" })] })] }), _jsx("input", { type: "range", min: "0", max: "100", step: "0.01", value: weights.lp, onChange: (e) => handleWeightChange('lp', Number(e.target.value)), className: "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer", style: {
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${weights.lp}%, #475569 ${weights.lp}%, #475569 100%)`,
                                }, "aria-label": "Adjust LP weight" })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-5 border border-slate-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { htmlFor: "trader-weight", className: "font-medium text-slate-300", children: "Trader Rewards Weight" }), _jsxs("div", { className: "flex items-baseline gap-1", children: [_jsx("input", { id: "trader-weight", type: "number", value: weights.trader.toFixed(2), onChange: (e) => handleWeightChange('trader', Number(e.target.value)), className: "w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-right", min: "0", max: "100", step: "0.01", "aria-label": "Trader rewards weight percentage" }), _jsx("span", { className: "text-slate-400", children: "%" })] })] }), _jsx("input", { type: "range", min: "0", max: "100", step: "0.01", value: weights.trader, onChange: (e) => handleWeightChange('trader', Number(e.target.value)), className: "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer", style: {
                                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${weights.trader}%, #475569 ${weights.trader}%, #475569 100%)`,
                                }, "aria-label": "Adjust Trader weight" })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-5 border border-slate-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { htmlFor: "referral-weight", className: "font-medium text-slate-300", children: "Referral Rewards Weight" }), _jsxs("div", { className: "flex items-baseline gap-1", children: [_jsx("input", { id: "referral-weight", type: "number", value: weights.referral.toFixed(2), onChange: (e) => handleWeightChange('referral', Number(e.target.value)), className: "w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-right", min: "0", max: "100", step: "0.01", "aria-label": "Referral rewards weight percentage" }), _jsx("span", { className: "text-slate-400", children: "%" })] })] }), _jsx("input", { type: "range", min: "0", max: "100", step: "0.01", value: weights.referral, onChange: (e) => handleWeightChange('referral', Number(e.target.value)), className: "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer", style: {
                                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${weights.referral}%, #475569 ${weights.referral}%, #475569 100%)`,
                                }, "aria-label": "Adjust Referral weight" })] })] }), _jsxs("div", { className: `rounded-lg p-4 border-2 transition-colors ${isValid
                    ? 'bg-green-900/20 border-green-700/50'
                    : 'bg-red-900/20 border-red-700/50'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-medium", children: [isValid ? '✅' : '❌', " Total Weight"] }), _jsxs("span", { className: `text-lg font-bold font-mono ${isValid ? 'text-green-400' : 'text-red-400'}`, children: [total.toFixed(2), "%"] })] }), !isValid && (_jsx("p", { className: "text-sm text-red-300 mt-2", children: "Weights must sum to exactly 100%" }))] }), error && (_jsx("div", { className: "bg-red-900/20 border border-red-700/50 rounded px-4 py-3 text-sm text-red-300", children: error })), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: applyWeights, disabled: !isValid || isApplying, className: `flex-1 py-3 rounded-lg font-semibold transition-colors ${isValid && !isApplying
                            ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`, "aria-busy": isApplying, children: isApplying ? 'Applying...' : '⚙️ Apply Weights' }), _jsx("button", { onClick: distributeEqually, className: "px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors", "aria-label": "Distribute weights equally", children: "\u2696\uFE0F Equal" }), _jsx("button", { onClick: resetToDefaults, className: "px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors", "aria-label": "Reset to default weights", children: "\uD83D\uDD04 Reset" })] }), _jsxs("div", { className: "text-xs text-slate-400 space-y-1", children: [_jsx("p", { children: "\u2022 Adjusting weights will rebalance future reward distribution" }), _jsx("p", { children: "\u2022 Changes take effect at the next epoch (24h intervals)" }), _jsx("p", { children: "\u2022 All three weights must sum to 100%" })] })] }));
};
