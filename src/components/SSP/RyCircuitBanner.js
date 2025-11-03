import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export const RyCircuitBanner = () => {
    const [circuit, setCircuit] = useState({ active: false });
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    useEffect(() => {
        const fetchCircuitState = async () => {
            try {
                const response = await fetch('/api/ssp/circuit');
                if (response.ok) {
                    const data = await response.json();
                    setCircuit(data || { active: false });
                }
            }
            catch (error) {
                console.error('Failed to fetch circuit state:', error);
            }
        };
        fetchCircuitState();
        const interval = setInterval(fetchCircuitState, 5000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (circuit.cooldownUntil) {
            const timer = setInterval(() => {
                const remaining = Math.max(0, circuit.cooldownUntil - Date.now());
                setCooldownRemaining(remaining);
                if (remaining === 0) {
                    clearInterval(timer);
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [circuit.cooldownUntil]);
    const cooldownMinutes = Math.ceil(cooldownRemaining / 60000);
    if (!circuit.active) {
        return (_jsx("div", { className: "bg-green-900/20 border border-green-700/50 rounded-lg px-4 py-3", children: _jsxs("p", { className: "text-sm text-green-300 flex items-center gap-2", children: [_jsx("span", { children: "\u2705" }), "Circuit breaker: Normal operation"] }) }));
    }
    return (_jsxs("div", { className: "bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-4 space-y-2", role: "alert", "aria-live": "assertive", children: [_jsxs("p", { className: "text-sm font-semibold text-red-300 flex items-center gap-2", children: [_jsx("span", { className: "animate-pulse", children: "\uD83D\uDEA8" }), "Circuit Breaker Triggered"] }), circuit.reason && (_jsxs("p", { className: "text-sm text-red-200", children: ["Reason: ", circuit.reason] })), circuit.triggeredAt && (_jsxs("p", { className: "text-xs text-red-300", children: ["Triggered: ", new Date(circuit.triggeredAt).toLocaleTimeString()] })), cooldownRemaining > 0 && (_jsxs("div", { className: "mt-3 pt-3 border-t border-red-700/30", children: [_jsxs("p", { className: "text-xs text-red-300 mb-2", children: ["Cooldown: ", cooldownMinutes, "m remaining"] }), _jsx("div", { className: "w-full bg-red-900 rounded-full h-1", children: _jsx("div", { className: "bg-red-500 h-1 rounded-full transition-all", style: {
                                width: `${100 - (cooldownRemaining / (60 * 60000)) * 100}%`,
                            } }) })] })), _jsx("p", { className: "text-xs text-red-200 mt-3", children: "Smart swap protection is active. Normal trading operations are paused." })] }));
};
