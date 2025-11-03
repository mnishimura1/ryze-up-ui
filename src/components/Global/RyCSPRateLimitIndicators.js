import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../Card';
export const RyCSPRateLimitIndicators = () => {
    const [expanded, setExpanded] = useState(null);
    // Rate limits and CSP violations would come from real monitoring in production
    // For now, component returns null when no data available
    const rateLimits = [];
    const cspViolations = [];
    if (rateLimits.length === 0 && cspViolations.length === 0) {
        return null;
    }
    const formatTime = (seconds) => {
        if (seconds < 60)
            return `${seconds}s`;
        if (seconds < 3600)
            return `${Math.floor(seconds / 60)}m`;
        return `${Math.floor(seconds / 3600)}h`;
    };
    const getRateLimitColor = (used, limit) => {
        const ratio = used / limit;
        if (ratio > 0.9)
            return 'text-danger';
        if (ratio > 0.7)
            return 'text-warn';
        return 'text-success';
    };
    return (_jsxs("div", { className: "fixed top-16 right-4 z-20 space-y-2", children: [_jsxs(Card, { children: [_jsxs("button", { onClick: () => setExpanded(expanded === 'ratelimit' ? null : 'ratelimit'), className: "w-full p-3 hover:bg-dark-border/50 transition rounded flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [_jsx("span", { children: "\uD83D\uDCCA Rate Limits" }), _jsx("div", { className: "flex space-x-1", children: rateLimits.map((bucket) => {
                                            const ratio = bucket.used / bucket.limit;
                                            const color = ratio > 0.9 ? 'bg-danger' : ratio > 0.7 ? 'bg-warn' : 'bg-success';
                                            return (_jsx("div", { className: `w-2 h-2 rounded-full ${color}` }, bucket.name));
                                        }) })] }), _jsx("span", { className: "text-xs text-dark-text/50", children: expanded === 'ratelimit' ? '▼' : '▶' })] }), expanded === 'ratelimit' && (_jsx("div", { className: "border-t border-dark-border p-3 space-y-2 max-h-48 overflow-y-auto", children: rateLimits.map((bucket) => {
                            const ratio = bucket.used / bucket.limit;
                            const color = getRateLimitColor(bucket.used, bucket.limit);
                            return (_jsxs("div", { className: "text-xs space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-dark-text/70", children: bucket.name }), _jsxs("span", { className: `font-mono font-bold ${color}`, children: [bucket.used, " / ", bucket.limit] })] }), _jsx("div", { className: "w-full h-1.5 bg-dark-border rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition-all ${color.replace('text', 'bg')}`, style: { width: `${Math.min(ratio * 100, 100)}%` } }) }), _jsxs("div", { className: "text-dark-text/50", children: ["Resets in ", formatTime(bucket.resetIn)] })] }, bucket.name));
                        }) }))] }), _jsxs(Card, { children: [_jsxs("button", { onClick: () => setExpanded(expanded === 'csp' ? null : 'csp'), className: "w-full p-3 hover:bg-dark-border/50 transition rounded flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [_jsx("span", { children: "\uD83D\uDD12 CSP" }), _jsx("span", { className: "w-2 h-2 rounded-full bg-success" }), _jsxs("span", { className: "text-xs text-dark-text/70", children: [cspViolations.length, " events"] })] }), _jsx("span", { className: "text-xs text-dark-text/50", children: expanded === 'csp' ? '▼' : '▶' })] }), expanded === 'csp' && (_jsx("div", { className: "border-t border-dark-border p-3 space-y-2 max-h-48 overflow-y-auto", children: cspViolations.length > 0 ? (cspViolations.map((violation, idx) => (_jsxs("div", { className: `p-2 rounded text-xs border ${violation.severity === 'error'
                                ? 'border-danger/50 bg-danger/10'
                                : 'border-warn/50 bg-warn/10'}`, children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-semibold", children: violation.directive }), _jsx("span", { className: violation.severity === 'error' ? 'text-danger' : 'text-warn', children: violation.severity === 'error' ? '✕' : '⚠' })] }), _jsx("div", { className: "text-dark-text/70 break-all", children: violation.blockedUrl }), _jsxs("div", { className: "text-dark-text/50 mt-1", children: [Math.floor((Date.now() - violation.timestamp) / 60000), " mins ago"] })] }, idx)))) : (_jsx("div", { className: "text-xs text-dark-text/70 py-2", children: "No violations detected" })) }))] }), _jsx(Card, { children: _jsxs("div", { className: "p-3 space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-2 text-xs", children: [_jsx("span", { children: "\u2713 Lint" }), _jsx("span", { className: "px-2 py-0.5 rounded bg-success/20 text-success font-semibold", children: "A" })] }), _jsxs("div", { className: "flex items-center space-x-2 text-xs", children: [_jsx("span", { children: "\u26A1 Lighthouse" }), _jsxs("div", { className: "flex space-x-1", children: [_jsx("span", { className: "px-1.5 py-0.5 rounded bg-success/20 text-success text-xs font-mono", children: "92" }), _jsx("span", { className: "px-1.5 py-0.5 rounded bg-success/20 text-success text-xs font-mono", children: "88" }), _jsx("span", { className: "px-1.5 py-0.5 rounded bg-warn/20 text-warn text-xs font-mono", children: "78" })] })] })] }) })] }));
};
