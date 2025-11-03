import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { RyLevSlider } from './RyLevSlider';
import { RyFundingStat } from './RyFundingStat';
import { RyPnLChart } from './RyPnLChart';
import { RyRiskBadges } from './RyRiskBadges';
import { useStore } from '../../lib/store';
export const PerpsTab = () => {
    const [selectedSym] = useState('BTC-PERP'); // Stub; from Markets or search
    const { safety, perps } = useStore();
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 h-full", children: [_jsx("div", { className: "lg:col-span-1 space-y-4", children: _jsx(RyLevSlider, { sym: selectedSym }) }), _jsxs("div", { className: "lg:col-span-1 space-y-4", children: [_jsx(RyPnLChart, { sym: selectedSym }), _jsx(RyFundingStat, { sym: selectedSym })] }), _jsxs("div", { className: "lg:col-span-1 space-y-4", children: [_jsx(RyRiskBadges, { sym: selectedSym }), _jsxs("div", { className: "text-xs space-y-1", children: [_jsxs("div", { children: ["Index: $", perps.metrics[selectedSym]?.index?.toFixed(2) || 'N/A'] }), _jsxs("div", { children: ["Mark: $", perps.metrics[selectedSym]?.mark?.toFixed(2) || 'N/A'] }), !safety.matching && (_jsx("div", { className: "text-danger text-center py-1 bg-danger/10 rounded", children: "Matching Disabled" })), !safety.quoting && (_jsx("div", { className: "text-warn text-center py-1 bg-warn/10 rounded", children: "Quoting Disabled" }))] })] })] }));
};
