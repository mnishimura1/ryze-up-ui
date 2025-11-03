import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { LayoutGrid, TrendingUp, TrendingDown } from 'lucide-react';
const Markets = () => {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h');
                const data = await response.json();
                const marketData = data.map((coin) => ({
                    sym: `${coin.symbol.toUpperCase()}-USD`,
                    price: coin.current_price || 0,
                    change: coin.price_change_percentage_1h_in_currency || 0,
                    vol: coin.total_volume || 0,
                    latency_us: Math.floor(Math.random() * 50) + 5,
                    venue: Math.random() > 0.7 ? 'Bridged' : 'Base',
                    bidAsk: {
                        bid: (coin.current_price || 0) * 0.9999,
                        ask: (coin.current_price || 0) * 1.0001,
                        spread: 0.02
                    }
                }));
                setMarkets(marketData);
                setLoading(false);
            }
            catch (error) {
                console.error('Failed to fetch markets:', error);
                setLoading(false);
            }
        };
        fetchMarkets();
        const interval = setInterval(fetchMarkets, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsxs("div", { className: "text-center", children: [_jsx(LayoutGrid, { className: "w-8 h-8 animate-spin mx-auto mb-2 text-accent" }), _jsx("p", { className: "text-subtext", children: "Loading real-time Base tokens..." })] }) }));
    }
    return (_jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Markets (Base + Bridged Assets)" }), _jsxs("div", { className: "text-sm text-subtext", children: ["Total: ", markets.length, " tokens | Updated: ", new Date().toLocaleTimeString()] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3", children: markets.map((card) => (_jsxs("div", { onMouseEnter: () => setHoveredCard(card.sym), onMouseLeave: () => setHoveredCard(null), className: "bg-dark-surface border border-dark-border rounded-lg p-3 hover:border-accent/50 transition-all cursor-pointer group", role: "article", "aria-label": `Market ${card.sym}: ${card.price.toFixed(2)} USD`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-sm", children: card.sym }), _jsx("div", { className: "text-xs text-subtext", children: card.venue })] }), _jsxs("div", { className: `text-xs px-2 py-1 rounded ${card.change >= 0
                                        ? 'bg-success/10 text-success'
                                        : 'bg-danger/10 text-danger'}`, children: [card.change >= 0 ? '+' : '', card.change.toFixed(2), "%"] })] }), _jsxs("div", { className: "text-lg font-mono font-bold mb-2", children: ["$", card.price.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 8
                                })] }), _jsxs("div", { className: "text-xs text-subtext space-y-1 mb-2", children: [_jsxs("div", { children: ["Vol 24h: $", (card.vol / 1e6).toFixed(1), "M"] }), _jsxs("div", { className: "flex justify-between", children: [_jsxs("span", { children: ["Latency: ", _jsxs("span", { className: "text-accent font-mono", children: [card.latency_us, "\u03BCs"] })] }), _jsx("span", { children: card.change >= 0 ? _jsx(TrendingUp, { className: "w-3 h-3 text-success inline" }) : _jsx(TrendingDown, { className: "w-3 h-3 text-danger inline" }) })] })] }), hoveredCard === card.sym && card.bidAsk && (_jsxs("div", { className: "mt-3 pt-3 border-t border-dark-border/30 animate-in fade-in duration-200", children: [_jsx("div", { className: "text-xs font-semibold mb-2", children: "Depth" }), _jsxs("div", { className: "flex items-end gap-1 h-12", children: [_jsx("div", { className: "flex-1 bg-success/30 rounded-t hover:bg-success/50 transition-colors", style: { height: '60%' }, role: "img", "aria-label": `Bid side at ${card.bidAsk.bid.toFixed(2)}` }), _jsx("div", { className: "flex-1 bg-danger/30 rounded-t hover:bg-danger/50 transition-colors", style: { height: '40%' }, role: "img", "aria-label": `Ask side at ${card.bidAsk.ask.toFixed(2)}` })] }), _jsxs("div", { className: "text-xs text-subtext mt-1", children: ["Spread: ", card.bidAsk.spread.toFixed(4), "%"] })] }))] }, card.sym))) }), markets.length === 0 && (_jsx("div", { className: "text-center py-12 text-subtext", children: "No markets available" }))] }));
};
export default Markets;
