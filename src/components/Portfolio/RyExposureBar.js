import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from '../../lib/store';
import Card from '../Card';
export const RyExposureBar = () => {
    const { portfolio } = useStore();
    // Calculate exposure percentages from real data
    const balances = portfolio.balances || [];
    if (balances.length === 0) {
        return null;
    }
    const totalValue = balances.reduce((sum, bal) => sum + (bal.usdValue || 0), 0);
    if (totalValue <= 0) {
        return null;
    }
    const exposures = balances.map((balance) => ({
        symbol: balance.symbol,
        usdValue: balance.usdValue || 0,
        percentage: ((balance.usdValue || 0) / totalValue) * 100,
    })).filter(e => e.percentage > 0.1);
    const getColor = (symbol, idx) => {
        const colors = [
            '#ff1493', // hot pink
            '#00d4ff', // cyan
            '#00ff88', // lime
            '#ffa500', // orange
            '#ff6b9d', // light pink
            '#a78bfa', // purple
            '#60a5fa', // blue
            '#34d399', // teal
        ];
        return colors[idx % colors.length];
    };
    return (_jsx("div", { className: "space-y-4", children: _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Portfolio Exposure" }), _jsx("div", { className: "mb-6", children: _jsx("div", { className: "flex h-8 rounded-lg overflow-hidden border border-dark-border shadow-sm", children: exposures.map((exp, idx) => (_jsx("div", { style: {
                                    width: `${exp.percentage}%`,
                                    backgroundColor: getColor(exp.symbol, idx),
                                    opacity: 0.8,
                                }, className: "transition-all hover:opacity-100", title: `${exp.symbol}: ${exp.percentage.toFixed(1)}%` }, exp.symbol))) }) }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: exposures.map((exp, idx) => (_jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [_jsx("div", { className: "w-3 h-3 rounded", style: { backgroundColor: getColor(exp.symbol, idx) } }), _jsx("span", { className: "text-dark-text/70", children: exp.symbol }), _jsxs("span", { className: "font-semibold", children: [exp.percentage.toFixed(1), "%"] })] }, exp.symbol))) }), _jsxs("div", { className: "mt-6 pt-4 border-t border-dark-border", children: [_jsx("div", { className: "text-xs text-dark-text/70 mb-2", children: "Concentration Risk" }), exposures.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { children: "Top Position:" }), _jsxs("span", { className: "font-semibold", children: [exposures[0]?.symbol, ": ", exposures[0]?.percentage.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { children: "Diversification:" }), _jsxs("span", { className: `font-semibold ${exposures[0]?.percentage > 50 ? 'text-warn' : 'text-success'}`, children: [exposures.length, " assets"] })] })] }))] })] }) }) }));
};
