import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export const RyPoolList = () => {
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('tvl');
    const [expandedId, setExpandedId] = useState(null);
    useEffect(() => {
        const fetchPools = async () => {
            try {
                const response = await fetch('/api/ssp/pools');
                if (response.ok) {
                    const data = await response.json();
                    setPools(data || []);
                }
            }
            catch (error) {
                console.error('Failed to fetch SSP pools:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPools();
        const interval = setInterval(fetchPools, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);
    const sortedPools = [...pools].sort((a, b) => {
        if (sortBy === 'tvl')
            return (b.tvl || 0) - (a.tvl || 0);
        if (sortBy === 'apr')
            return (b.apr || 0) - (a.apr || 0);
        return (b.volume24h || 0) - (a.volume24h || 0);
    });
    if (loading) {
        return (_jsx("div", { className: "text-center py-8 text-slate-400", children: "Loading SSP pools..." }));
    }
    return (_jsxs("div", { className: "space-y-4", role: "region", "aria-label": "SSP pools list", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Smart Swap Pools" }), _jsx("div", { className: "flex gap-2", children: ['tvl', 'apr', 'volume'].map((key) => (_jsx("button", { onClick: () => setSortBy(key), className: `px-3 py-1 rounded text-sm font-medium transition-colors ${sortBy === key
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, "aria-pressed": sortBy === key, children: key === 'tvl' ? 'TVL' : key === 'apr' ? 'APR' : 'Volume' }, key))) })] }), _jsx("div", { className: "space-y-3", children: sortedPools.map((pool) => (_jsxs("div", { className: "bg-slate-800 rounded-lg border border-slate-700 overflow-hidden", children: [_jsxs("button", { onClick: () => setExpandedId(expandedId === pool.id ? null : pool.id), className: "w-full p-4 text-left hover:bg-slate-750 transition-colors flex items-center justify-between", "aria-expanded": expandedId === pool.id, children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-semibold text-white", children: pool.name }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Pool ID: ", pool.id.slice(0, 8), "..."] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm font-mono text-cyan-400", children: ["$", (pool.tvl / 1e6).toFixed(1), "M"] }), _jsxs("p", { className: `text-xs font-semibold ${pool.apr >= 50 ? 'text-green-400' : pool.apr >= 20 ? 'text-blue-400' : 'text-slate-400'}`, children: [pool.apr.toFixed(1), "% APR"] })] })] }), expandedId === pool.id && (_jsxs("div", { className: "border-t border-slate-700 p-4 bg-slate-750 space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400 mb-1", children: "24h Volume" }), _jsxs("p", { className: "font-mono font-semibold", children: ["$", (pool.volume24h / 1e6).toFixed(2), "M"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400 mb-1", children: "Shield Level" }), _jsxs("p", { className: "font-mono font-semibold text-green-400", children: [pool.shield, "%"] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400 mb-2", children: "Status" }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${pool.status === 'active'
                                                ? 'bg-green-900 text-green-200'
                                                : pool.status === 'paused'
                                                    ? 'bg-yellow-900 text-yellow-200'
                                                    : 'bg-slate-700 text-slate-300'}`, children: pool.status.charAt(0).toUpperCase() + pool.status.slice(1) })] }), _jsx("button", { className: "w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded transition-colors", children: "\uD83D\uDCB1 Trade This Pool" })] }))] }, pool.id))) }), pools.length === 0 && (_jsx("div", { className: "text-center py-8 text-slate-400", children: "No SSP pools available" }))] }));
};
