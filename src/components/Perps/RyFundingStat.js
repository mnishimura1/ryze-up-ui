import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';
export const RyFundingStat = ({ sym }) => {
    const { perps } = useStore();
    const state = perps.metrics[sym] || { funding_apr: 0, next_funding_ts: Date.now() + 3600000 }; // Stub: 1hr interval
    const nextFunding = new Date(state.next_funding_ts).toLocaleTimeString();
    const fundingRate = (state.funding_apr * 100).toFixed(4); // e.g., 0.01%
    // Funding timer: Countdown
    const [timeLeft, setTimeLeft] = React.useState(3600); // Stub: 1hr in sec
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Funding" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Rate:" }), _jsxs("span", { className: state.funding_apr > 0 ? 'text-success' : 'text-danger', children: [state.funding_apr > 0 ? '+' : '', fundingRate, "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Next:" }), _jsx("span", { children: nextFunding })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Countdown:" }), _jsx("span", { className: "font-mono text-accent", children: formatTime(timeLeft) })] }), _jsx("div", { className: "text-xs text-subtext", children: "Longs pay shorts if positive" })] })] }));
};
