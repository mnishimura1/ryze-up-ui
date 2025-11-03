import { jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';
const greeks = {
    delta: 0.65,
    gamma: 0.02,
    theta: -5.2,
    vega: 12.1
};
export const RyRiskBadges = ({ sym }) => {
    const { perps } = useStore();
    const metrics = perps.metrics[sym] || { oi: 0, skew: 0 };
    return (_jsxs(RyCard, { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { className: "text-xs", children: [_jsxs("div", { children: ["Open Interest: ", metrics.oi.toLocaleString()] }), _jsxs("div", { children: ["Skew: ", metrics.skew.toFixed(2), "%"] })] }), _jsxs("div", { className: "text-xs space-y-1", children: [_jsxs("div", { children: ["\u0394: ", greeks.delta] }), _jsxs("div", { children: ["\u0393: ", greeks.gamma] }), _jsxs("div", { children: ["\u0398: ", greeks.theta] }), _jsxs("div", { children: ["\u03BD: ", greeks.vega] })] })] }));
};
