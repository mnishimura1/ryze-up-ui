import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';
const riskColors = {
    low: 'text-success',
    medium: 'text-warn',
    high: 'text-danger'
};
export const RyStrategyList = ({ strategies = [] }) => {
    const { vaults } = useStore();
    const strategyData = strategies.length > 0 ? strategies : vaults.list || [
        { id: 'strat-1', name: 'ETH Yield Farm', description: 'Auto-compound ETH/USDC LP', apr: 12.5, tvl: 5000000, risk_level: 'low' },
        { id: 'strat-2', name: 'BTC Hedged Vault', description: 'Delta-neutral BTC perp + spot', apr: 8.2, tvl: 3000000, risk_level: 'medium' },
        { id: 'strat-3', name: 'Meme Momentum', description: 'High-vol Base tokens rotation', apr: 45.0, tvl: 1000000, risk_level: 'high' }
    ];
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Strategies" }), _jsx("ul", { className: "space-y-3", children: strategyData.map((strat) => (_jsx("li", { className: "border-b border-dark-border/50 pb-3 last:border-b-0", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h5", { className: "font-medium", children: strat.name }), _jsx("p", { className: "text-xs text-subtext", children: strat.description })] }), _jsxs("div", { className: "text-right ml-4", children: [_jsxs("div", { className: "font-mono text-sm", children: [strat.apr, "% APR"] }), _jsxs("div", { className: "text-xs text-subtext", children: ["TVL: $", (strat.tvl / 1e6).toFixed(1), "M"] }), _jsx("div", { className: `text-xs ${riskColors[strat.risk_level]}`, children: strat.risk_level.toUpperCase() })] })] }) }, strat.id))) })] }));
};
