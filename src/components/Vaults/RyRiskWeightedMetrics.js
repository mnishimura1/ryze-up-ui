import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart3 } from 'lucide-react';
export const RyRiskWeightedMetrics = ({ metrics }) => {
    const getMetricColor = (value, threshold, inverse) => {
        if (inverse) {
            return value > threshold ? 'text-success' : 'text-warn';
        }
        return value < threshold ? 'text-success' : 'text-danger';
    };
    const metricsList = [
        {
            label: 'Value at Risk (95%)',
            value: metrics.var_95,
            unit: '%',
            description: 'Max expected loss at 95% confidence',
            good: metrics.var_95 < 5
        },
        {
            label: 'CVaR (95%)',
            value: metrics.cvar_95,
            unit: '%',
            description: 'Expected loss beyond VaR',
            good: metrics.cvar_95 < 7
        },
        {
            label: 'Sharpe Ratio',
            value: metrics.sharpe_ratio,
            unit: '',
            description: 'Risk-adjusted return metric',
            good: metrics.sharpe_ratio > 1
        },
        {
            label: 'Max Drawdown',
            value: metrics.max_drawdown,
            unit: '%',
            description: 'Largest peak-to-trough decline',
            good: metrics.max_drawdown < 20
        },
        {
            label: 'BTC Correlation',
            value: metrics.correlation_btc,
            unit: '',
            description: 'Correlation with Bitcoin',
            good: Math.abs(metrics.correlation_btc) < 0.5
        },
        {
            label: 'Beta',
            value: metrics.beta,
            unit: '',
            description: 'Systematic risk relative to market',
            good: metrics.beta < 1.5
        }
    ];
    return (_jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-4 space-y-3", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsxs("h4", { className: "font-semibold text-sm flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-4 h-4" }), "Risk Metrics"] }) }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: metricsList.map((metric, idx) => (_jsxs("div", { className: "bg-dark-bg border border-dark-border rounded-lg p-2.5", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("div", { className: "text-xs font-semibold", children: metric.label }), _jsxs("div", { className: `font-mono font-bold text-sm ${metric.good ? 'text-success' : 'text-warn'}`, children: [metric.value.toFixed(2), metric.unit] })] }), _jsx("div", { className: "text-xs text-subtext mb-1", children: metric.description }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-full bg-dark-border rounded-full h-1 overflow-hidden", children: _jsx("div", { className: `h-full ${metric.good ? 'bg-success' : 'bg-warn'}`, style: { width: `${Math.min(100, Math.abs(metric.value) * 20)}%` } }) }), metric.good && _jsx("div", { className: "text-success text-xs", children: "\u2713" })] })] }, idx))) })] }));
};
