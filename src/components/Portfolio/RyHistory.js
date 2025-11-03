import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useStore } from '../../lib/store';
export const RyHistory = () => {
    const portfolio = useStore((s) => s.portfolio);
    const [filterType, setFilterType] = useState('all');
    const history = portfolio.history || [];
    const filtered = history.filter((tx) => filterType === 'all' ? true : tx.type === filterType);
    const exportHistory = async () => {
        const csv = [
            'Date,Type,Symbol,Amount,Price,Total USD,Status',
            ...filtered.map((tx) => [
                new Date(tx.timestamp).toISOString(),
                tx.type,
                tx.symbol,
                tx.amount.toFixed(6),
                tx.price?.toFixed(4) || '-',
                tx.usdValue?.toFixed(2) || '-',
                tx.status,
            ].join(',')),
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-history-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "space-y-4", role: "region", "aria-label": "Transaction history", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "History" }), _jsx("button", { onClick: exportHistory, className: "px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm font-medium transition-colors", "aria-label": "Export transaction history", children: "\uD83D\uDCE5 Export CSV" })] }), _jsx("div", { className: "flex gap-2 flex-wrap", children: ['all', 'trade', 'deposit', 'withdraw'].map((type) => (_jsx("button", { onClick: () => setFilterType(type), className: `px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${filterType === type
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, "aria-pressed": filterType === type, children: type }, type))) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", role: "table", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-slate-700", children: [_jsx("th", { className: "text-left py-3 px-4 text-slate-400 font-medium", children: "Date" }), _jsx("th", { className: "text-left py-3 px-4 text-slate-400 font-medium", children: "Type" }), _jsx("th", { className: "text-left py-3 px-4 text-slate-400 font-medium", children: "Asset" }), _jsx("th", { className: "text-right py-3 px-4 text-slate-400 font-medium", children: "Amount" }), _jsx("th", { className: "text-right py-3 px-4 text-slate-400 font-medium", children: "Price" }), _jsx("th", { className: "text-right py-3 px-4 text-slate-400 font-medium", children: "USD Value" }), _jsx("th", { className: "text-center py-3 px-4 text-slate-400 font-medium", children: "Status" })] }) }), _jsx("tbody", { children: filtered.map((tx, idx) => (_jsxs("tr", { className: "border-b border-slate-700 hover:bg-slate-750 transition-colors", children: [_jsxs("td", { className: "py-3 px-4 text-slate-300 font-mono text-xs", children: [new Date(tx.timestamp).toLocaleDateString(), " at", ' ', new Date(tx.timestamp).toLocaleTimeString()] }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-semibold capitalize ${tx.type === 'trade'
                                                ? 'bg-blue-900 text-blue-200'
                                                : tx.type === 'deposit'
                                                    ? 'bg-green-900 text-green-200'
                                                    : 'bg-orange-900 text-orange-200'}`, children: tx.type }) }), _jsx("td", { className: "py-3 px-4 font-mono font-semibold", children: tx.symbol }), _jsx("td", { className: "py-3 px-4 text-right font-mono", children: tx.amount.toFixed(6) }), _jsxs("td", { className: "py-3 px-4 text-right font-mono text-slate-400", children: ["$", tx.price?.toFixed(4) || '-'] }), _jsxs("td", { className: "py-3 px-4 text-right font-semibold", children: ["$", tx.usdValue?.toFixed(2) || '-'] }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-semibold ${tx.status === 'completed'
                                                ? 'bg-green-900 text-green-200'
                                                : tx.status === 'pending'
                                                    ? 'bg-yellow-900 text-yellow-200'
                                                    : 'bg-red-900 text-red-200'}`, children: tx.status }) })] }, idx))) })] }) }), filtered.length === 0 && (_jsx("div", { className: "text-center py-8 text-slate-400", children: "No transactions found" }))] }));
};
