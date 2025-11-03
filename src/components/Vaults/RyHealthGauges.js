import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
export const RyHealthGauges = ({ metrics }) => {
    const getHealthColor = (score) => {
        if (score >= 80)
            return 'text-success';
        if (score >= 50)
            return 'text-warn';
        return 'text-danger';
    };
    const getHealthBgColor = (score) => {
        if (score >= 80)
            return 'bg-success/10';
        if (score >= 50)
            return 'bg-warn/10';
        return 'bg-danger/10';
    };
    return (_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-3", children: [_jsx("div", { className: "text-xs text-subtext mb-2", children: "Collateral Ratio" }), _jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("div", { className: "text-lg font-bold text-accent", children: [metrics.collateral_ratio.toFixed(1), "%"] }), metrics.collateral_ratio > 150 ? (_jsx(TrendingUp, { className: "w-4 h-4 text-success" })) : (_jsx(AlertCircle, { className: "w-4 h-4 text-warn" }))] }), _jsx("div", { className: "w-full bg-dark-border rounded-full h-2 overflow-hidden", children: _jsx("div", { className: "h-full bg-accent transition-all", style: { width: `${Math.min(100, (metrics.collateral_ratio / 200) * 100)}%` } }) })] }), _jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-3", children: [_jsx("div", { className: "text-xs text-subtext mb-2", children: "Liquidation Threshold" }), _jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("div", { className: "text-lg font-bold text-accent", children: [metrics.liquidation_threshold.toFixed(1), "%"] }), metrics.collateral_ratio > metrics.liquidation_threshold + 10 ? (_jsx(TrendingUp, { className: "w-4 h-4 text-success" })) : (_jsx(AlertCircle, { className: "w-4 h-4 text-danger" }))] }), _jsx("div", { className: "w-full bg-dark-border rounded-full h-2 overflow-hidden", children: _jsx("div", { className: "h-full bg-danger transition-all", style: { width: `${Math.min(100, metrics.liquidation_threshold)}%` } }) })] }), _jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-3", children: [_jsx("div", { className: "text-xs text-subtext mb-2", children: "Utilization" }), _jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsxs("div", { className: "text-lg font-bold text-accent", children: [metrics.utilization.toFixed(1), "%"] }), metrics.utilization < 80 ? (_jsx(TrendingDown, { className: "w-4 h-4 text-success" })) : (_jsx(AlertCircle, { className: "w-4 h-4 text-warn" }))] }), _jsx("div", { className: "w-full bg-dark-border rounded-full h-2 overflow-hidden", children: _jsx("div", { className: "h-full bg-warn transition-all", style: { width: `${Math.min(100, metrics.utilization)}%` } }) })] }), _jsxs("div", { className: `${getHealthBgColor(metrics.health_score)} border border-dark-border rounded-lg p-3`, children: [_jsx("div", { className: "text-xs text-subtext mb-2", children: "Health Score" }), _jsxs("div", { className: `text-2xl font-bold ${getHealthColor(metrics.health_score)}`, children: [metrics.health_score.toFixed(0), "/100"] })] })] }));
};
