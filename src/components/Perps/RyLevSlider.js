import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';
export const RyLevSlider = ({ sym, maxLev = 100 }) => {
    const [leverage, setLeverage] = useState(1);
    const { perps, safety } = useStore();
    const position = perps.positions[sym] || { size: 0, entryPx: 0 };
    const quotingEnabled = safety.quoting;
    const matchingEnabled = safety.matching;
    const isDisabled = !quotingEnabled || !matchingEnabled;
    const handleLeverageChange = (e) => {
        const newLev = Number(e.target.value);
        if (newLev >= 1 && newLev <= maxLev) {
            setLeverage(newLev);
            // In prod: Update position leverage via WS { t: 'perps.adjust_lev', d: { sym, lev: newLev } }
            console.log(`Adjust leverage for ${sym} to ${newLev}x`);
        }
    };
    const liqPrice = position.size > 0
        ? (position.entryPx * (1 - (1 / leverage) * 0.05)).toFixed(2) // Stub: 5% maintenance margin
        : 'N/A';
    return (_jsxs(RyCard, { className: isDisabled ? 'opacity-50 pointer-events-none' : '', children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Leverage" }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "range", min: "1", max: maxLev, step: "1", value: leverage, onChange: handleLeverageChange, className: "w-full", disabled: isDisabled }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "1x" }), _jsxs("span", { className: "font-mono", children: [leverage, "x"] }), _jsxs("span", { children: [maxLev, "x"] })] }), _jsxs("div", { className: "text-xs text-subtext", children: ["Est. Liq Price: ", _jsxs("span", { className: "font-mono text-warn", children: ["$", liqPrice] })] }), !matchingEnabled && (_jsx("div", { className: "text-danger text-xs text-center py-1 bg-danger/10 rounded", children: "Matching Disabled" })), !quotingEnabled && (_jsx("div", { className: "text-warn text-xs text-center py-1 bg-warn/10 rounded", children: "Quoting Disabled" }))] })] }));
};
