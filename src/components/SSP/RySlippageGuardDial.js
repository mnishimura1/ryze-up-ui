import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from '../../lib/store';
import Card from '../Card';
export const RySlippageGuardDial = () => {
    const { safety } = useStore();
    // Get real tolerance from store or return null if not available
    const tolerance = safety?.ssp?.slippage_tolerance || null;
    if (tolerance === null) {
        return null;
    }
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (tolerance / 100) * circumference;
    const getColor = (bps) => {
        if (bps <= 25)
            return '#10b981'; // success - tight
        if (bps <= 50)
            return '#f59e0b'; // warn - moderate
        if (bps <= 100)
            return '#ef4444'; // danger - loose
        return '#6b7280'; // gray - too loose
    };
    const getLabel = (bps) => {
        if (bps <= 25)
            return 'Tight';
        if (bps <= 50)
            return 'Moderate';
        if (bps <= 100)
            return 'Loose';
        return 'Extreme';
    };
    return (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-6", children: "Slippage Guard" }), _jsx("div", { className: "flex justify-center mb-6", children: _jsxs("svg", { width: "140", height: "140", viewBox: "0 0 140 140", className: "drop-shadow-lg", children: [_jsx("circle", { cx: "70", cy: "70", r: "50", fill: "none", stroke: "var(--dark-border)", strokeWidth: "8", opacity: "0.3" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "dialGradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#10b981" }), _jsx("stop", { offset: "33%", stopColor: "#f59e0b" }), _jsx("stop", { offset: "66%", stopColor: "#ef4444" }), _jsx("stop", { offset: "100%", stopColor: "#6b7280" })] }) }), _jsx("circle", { cx: "70", cy: "70", r: "45", fill: "none", stroke: "url(#dialGradient)", strokeWidth: "8", strokeDasharray: circumference, strokeDashoffset: offset, strokeLinecap: "round", transform: "rotate(-90 70 70)" }), _jsx("circle", { cx: "70", cy: "70", r: "28", fill: "var(--dark-bg)", stroke: "var(--dark-border)", strokeWidth: "1" }), _jsxs("g", { transform: `rotate(${(tolerance / 100) * 360} 70 70)`, children: [_jsx("line", { x1: "70", y1: "70", x2: "70", y2: "28", stroke: getColor(tolerance), strokeWidth: "3", strokeLinecap: "round" }), _jsx("circle", { cx: "70", cy: "70", r: "4", fill: getColor(tolerance) })] }), _jsx("text", { x: "70", y: "125", textAnchor: "middle", fontSize: "10", fill: "var(--subtext)", opacity: "0.6", children: "0 bps" }), _jsx("text", { x: "122", y: "75", textAnchor: "start", fontSize: "10", fill: "var(--subtext)", opacity: "0.6", children: "100 bps" })] }) }), _jsxs("div", { className: "text-center mb-4", children: [_jsx("div", { className: "text-3xl font-bold", style: { color: getColor(tolerance) }, children: tolerance }), _jsxs("div", { className: "text-sm text-dark-text/70 mt-1", children: [(tolerance / 100).toFixed(2), "% slippage"] }), _jsxs("div", { className: "text-xs font-semibold text-dark-text/70 mt-2", children: [getLabel(tolerance), " Protection"] })] }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-dark-text/70", children: "Guard Status:" }), _jsx("span", { className: safety.quoting ? 'text-success font-semibold' : 'text-danger font-semibold', children: safety.quoting ? '✓ Active' : '✗ Disabled' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-dark-text/70", children: "Circuit State:" }), _jsx("span", { className: safety.matching ? 'text-success' : 'text-warn', children: safety.matching ? 'Normal' : 'Degraded' })] })] })] }) }));
};
