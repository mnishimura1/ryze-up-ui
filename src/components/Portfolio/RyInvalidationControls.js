import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';
export const RyInvalidationControls = () => {
    const { portfolio, safety } = useStore();
    const [selectedAssets, setSelectedAssets] = useState([]);
    const assets = Object.keys(portfolio.balances || {});
    // Get real liquidation risk from store
    const liquidationRisk = portfolio?.liquidation_risk || false;
    // Get real hedge gaps from store or return null if not available
    const hedgeGaps = portfolio?.hedge_gaps || [];
    if (assets.length === 0 || hedgeGaps.length === 0) {
        return null;
    }
    return (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Invalidation Controls" }), _jsx("div", { className: `mb-4 p-3 rounded border ${liquidationRisk ? 'border-danger/50 bg-danger/10' : 'border-success/50 bg-success/10'}`, children: _jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [_jsx("span", { className: "text-lg", children: liquidationRisk ? '⚠️' : '✓' }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: liquidationRisk ? 'Liquidation Risk Detected' : 'No Liquidation Risk' }), _jsx("div", { className: "text-xs text-dark-text/70 mt-1", children: liquidationRisk
                                            ? 'LTV: 78% (threshold: 85%)'
                                            : 'LTV: 42% (safe margin)' })] })] }) }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-sm font-semibold mb-3", children: "Hedge Gaps" }), _jsx("div", { className: "space-y-3", children: hedgeGaps.map((gap) => (_jsxs("div", { className: "flex items-center space-x-3 text-xs", children: [_jsx("span", { className: "font-semibold w-12 text-dark-text/70", children: gap.asset }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsxs("span", { className: "text-dark-text/70", children: ["Current: ", gap.current, "%"] }), _jsxs("span", { className: "text-dark-text/70", children: ["Target: ", gap.ideal, "%"] })] }), _jsx("div", { className: "w-full bg-dark-border rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full transition ${gap.gap.startsWith('+') ? 'bg-warn' : 'bg-success'}`, style: { width: `${Math.max(gap.current, gap.ideal)}%` } }) })] }), _jsx("span", { className: `font-semibold w-12 text-right ${gap.gap.startsWith('+') ? 'text-warn' : 'text-success'}`, children: gap.gap })] }, gap.asset))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-sm font-semibold mb-3", children: "Rebalance Assets" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: assets.map((asset) => (_jsx("button", { onClick: () => setSelectedAssets((prev) => prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]), className: `px-3 py-2 rounded text-xs font-semibold transition ${selectedAssets.includes(asset)
                                    ? 'bg-accent text-dark-bg'
                                    : 'bg-dark-border/50 text-dark-text/70 hover:bg-dark-border'}`, children: asset }, asset))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { disabled: !safety.routing || selectedAssets.length === 0, className: `w-full px-3 py-2 rounded font-semibold text-sm transition ${safety.routing && selectedAssets.length > 0
                                ? 'bg-accent text-dark-bg hover:bg-accent/90'
                                : 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'}`, children: selectedAssets.length > 0 ? `Rebalance (${selectedAssets.join(', ')})` : 'Select Assets' }), _jsx("button", { disabled: !safety.routing, className: `w-full px-3 py-2 rounded font-semibold text-sm transition ${safety.routing
                                ? 'bg-dark-border text-dark-text hover:bg-dark-border/80'
                                : 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'}`, children: "Resync Prices" }), liquidationRisk && (_jsx("button", { className: "w-full px-3 py-2 rounded font-semibold text-sm bg-danger text-white hover:bg-danger/90 transition", children: "\uD83D\uDEA8 Emergency Deleverage" }))] }), _jsxs("div", { className: "mt-4 pt-4 border-t border-dark-border text-xs text-dark-text/70 space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Last Sync:" }), _jsx("span", { className: "font-mono", children: "2 seconds ago" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Invalidation Mode:" }), _jsx("span", { className: safety.deploy ? 'text-success' : 'text-warn', children: safety.deploy ? 'Auto' : 'Manual' })] })] })] }) }));
};
