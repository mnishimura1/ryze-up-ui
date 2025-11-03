import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Sliders } from 'lucide-react';
export const RyAssetRiskConfig = ({ assets }) => {
    const [expanded, setExpanded] = useState(null);
    const getVolatilityColor = (vol) => {
        if (vol > 100)
            return 'text-danger';
        if (vol > 50)
            return 'text-warn';
        return 'text-success';
    };
    return (_jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-4 space-y-2", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsxs("h4", { className: "font-semibold text-sm flex items-center gap-2", children: [_jsx(Sliders, { className: "w-4 h-4" }), "Asset Risk Configuration"] }) }), _jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: assets.map((asset) => (_jsxs("div", { children: [_jsx("button", { onClick: () => setExpanded(expanded === asset.symbol ? null : asset.symbol), className: "w-full flex items-center justify-between bg-dark-bg border border-dark-border rounded-lg p-2 hover:border-accent/50 transition-colors text-left text-xs", children: _jsxs("div", { className: "flex items-center justify-between flex-1", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: asset.symbol }), _jsxs("div", { className: "text-subtext", children: ["Risk: ", asset.risk_weight.toFixed(2)] })] }), _jsxs("div", { className: `font-mono font-bold ${getVolatilityColor(asset.volatility)}`, children: ["\u03C3 ", asset.volatility.toFixed(1), "%"] })] }) }), expanded === asset.symbol && (_jsxs("div", { className: "bg-dark-bg border border-dark-border/50 border-t-0 rounded-b-lg p-3 space-y-2 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-subtext", children: "Current Exposure:" }), _jsxs("span", { className: "font-mono font-bold", children: ["$", asset.current_exposure.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-subtext", children: "Max Exposure:" }), _jsxs("span", { className: "font-mono font-bold text-accent", children: ["$", asset.max_exposure.toLocaleString()] })] }), _jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "w-full bg-dark-border rounded-full h-1.5 overflow-hidden", children: _jsx("div", { className: "h-full bg-accent transition-all", style: { width: `${(asset.current_exposure / asset.max_exposure) * 100}%` } }) }), _jsxs("div", { className: "text-right text-subtext mt-1", children: [((asset.current_exposure / asset.max_exposure) * 100).toFixed(1), "% utilized"] })] })] }))] }, asset.symbol))) })] }));
};
