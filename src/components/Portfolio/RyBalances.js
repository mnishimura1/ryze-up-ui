import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useStore } from '../../lib/store';
export const RyBalances = () => {
    const portfolio = useStore((s) => s.portfolio);
    const [sortBy, setSortBy] = useState('value');
    const sortedBalances = [...(portfolio.balances || [])].sort((a, b) => {
        if (sortBy === 'value') {
            return (b.usdValue || 0) - (a.usdValue || 0);
        }
        return a.symbol.localeCompare(b.symbol);
    });
    return (_jsxs("div", { className: "space-y-4", role: "region", "aria-label": "Token balances", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Balances" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setSortBy('value'), className: `px-3 py-1 rounded text-sm font-medium transition-colors ${sortBy === 'value'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, "aria-pressed": sortBy === 'value', children: "By Value" }), _jsx("button", { onClick: () => setSortBy('name'), className: `px-3 py-1 rounded text-sm font-medium transition-colors ${sortBy === 'name'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, "aria-pressed": sortBy === 'name', children: "By Name" })] })] }), _jsx("div", { role: "list", className: "space-y-3", children: sortedBalances.map((balance) => (_jsx("div", { role: "listitem", className: "bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 transition-colors", tabIndex: 0, onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            e.currentTarget.click?.();
                        }
                    }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-mono font-semibold text-white", children: balance.symbol }), _jsxs("p", { className: "text-sm text-slate-400", children: [balance.amount.toFixed(6), " tokens"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-semibold text-white", children: ["$", (balance.usdValue || 0).toFixed(2)] }), _jsxs("p", { className: "text-sm text-slate-400", children: ["$", (balance.price || 0).toFixed(4), " each"] })] })] }) }, balance.symbol))) }), (!sortedBalances || sortedBalances.length === 0) && (_jsx("div", { className: "text-center py-8 text-slate-400", children: "No balances yet" }))] }));
};
