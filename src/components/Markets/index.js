import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RyMarketGrid } from './RyMarketGrid';
import { useStore } from '../../lib/store';
export const MarketsTab = () => {
    const { safety } = useStore();
    return (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Markets (Base + Bridged Assets)" }), _jsxs("div", { className: "text-sm text-subtext", children: ["Total Tokens: ~35 | Updated: ", new Date().toLocaleTimeString()] })] }), !safety.quoting && (_jsx("div", { className: "text-warn text-center py-2 bg-warn/10 rounded mb-4", children: "Quoting Disabled" })), _jsx(RyMarketGrid, {})] }));
};
