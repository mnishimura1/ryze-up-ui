import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { RyCard } from '../primitives/RyCard';
export const RyMarketCard = ({ sym, price, change, vol, latency_us, venue }) => {
    const isPositive = change >= 0;
    const changeClass = isPositive ? 'text-success' : 'text-danger';
    const formatVolume = (v) => {
        if (v >= 1e9)
            return `$${(v / 1e9).toFixed(1)}B`;
        if (v >= 1e6)
            return `$${(v / 1e6).toFixed(1)}M`;
        return `$${(v / 1e3).toFixed(1)}K`;
    };
    const formatPrice = (p) => {
        if (p < 0.01)
            return `$${p.toFixed(6)}`;
        if (p < 1)
            return `$${p.toFixed(4)}`;
        if (p < 100)
            return `$${p.toFixed(2)}`;
        return `$${p.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    };
    return (_jsx(RyCard, { className: "p-3 hover:border-accent transition-all cursor-pointer", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-sm", children: sym }), _jsx("div", { className: "text-xs text-subtext", children: venue })] }), _jsxs("div", { className: `text-xs px-2 py-1 rounded ${isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`, children: [isPositive ? '+' : '', change.toFixed(2), "%"] })] }), _jsx("div", { className: "text-lg font-mono font-bold", children: formatPrice(price) }), _jsxs("div", { className: "text-xs text-subtext", children: ["Vol 24h: ", _jsx("span", { className: "text-accent", children: formatVolume(vol) })] }), _jsxs("div", { className: "flex justify-between items-center pt-1 border-t border-dark-border", children: [_jsxs("div", { className: "text-xs text-subtext", children: ["Latency: ", _jsxs("span", { className: "font-mono text-accent", children: [latency_us, "\u03BCs"] })] }), _jsx("div", { className: "text-accent", children: isPositive ? (_jsx(TrendingUp, { className: "w-4 h-4" })) : (_jsx(TrendingDown, { className: "w-4 h-4" })) })] })] }) }));
};
