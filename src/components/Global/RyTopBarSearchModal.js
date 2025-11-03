import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
const SEARCH_DATA = [
    { id: 'markets', label: 'Markets', category: 'page', icon: '📊' },
    { id: 'trade', label: 'Trade', category: 'page', icon: '📈' },
    { id: 'swap', label: 'Swap', category: 'page', icon: '🔄' },
    { id: 'perpetuals', label: 'Perpetuals', category: 'page', icon: '⚡' },
    { id: 'portfolio', label: 'Portfolio', category: 'page', icon: '💼' },
    { id: 'vaults', label: 'Vaults', category: 'page', icon: '🏦' },
    { id: 'orderflow', label: 'Order Flow', category: 'page', icon: '📡' },
    { id: 'eth', label: 'ETH', category: 'token', icon: '🪙' },
    { id: 'btc', label: 'BTC', category: 'token', icon: '🪙' },
    { id: 'usdc', label: 'USDC', category: 'token', icon: '💵' },
];
export const RyTopBarSearchModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const inputRef = useRef(null);
    const modalRef = useRef(null);
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const query = searchQuery.toLowerCase();
        const results = SEARCH_DATA.filter((item) => item.label.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query));
        setSearchResults(results.slice(0, 8)); // Limit to 8 results
    }, [searchQuery]);
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            // Disable body scroll on mobile
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(!isOpen);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);
    const handleSelect = (result) => {
        console.log('Selected:', result);
        // Emit event or navigate based on category
        if (result.category === 'page') {
            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: result.id } }));
        }
        setIsOpen(false);
        setSearchQuery('');
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed top-4 right-4 sm:top-6 sm:right-6 z-40 desktop-only", children: _jsxs("button", { onClick: () => setIsOpen(true), className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-border/50 hover:bg-dark-border text-dark-text/70 hover:text-dark-text transition-all text-sm", "aria-label": "Search (Ctrl+K)", children: [_jsx(Search, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Search..." }), _jsx("kbd", { className: "hidden sm:inline text-xs bg-dark-border rounded px-1.5 py-0.5", children: "\u2318K" })] }) }), _jsx("div", { className: "mobile-only fixed top-4 right-4 z-40", children: _jsx("button", { onClick: () => setIsOpen(true), className: "p-2 rounded-lg bg-dark-border/50 hover:bg-dark-border text-dark-text/70 hover:text-dark-text transition-all", "aria-label": "Search", children: _jsx(Search, { className: "w-5 h-5" }) }) }), isOpen && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-50 transition-opacity", onClick: () => setIsOpen(false), role: "button", "aria-label": "Close search modal", tabIndex: 0, onKeyDown: (e) => e.key === 'Escape' && setIsOpen(false) })), isOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4", children: _jsxs("div", { ref: modalRef, className: "w-full max-w-2xl bg-dark-panel rounded-lg shadow-2xl border border-dark-border overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200", onClick: (e) => e.stopPropagation(), role: "dialog", "aria-label": "Search dialog", "aria-modal": "true", children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-dark-border", children: [_jsx(Search, { className: "w-5 h-5 text-dark-text/50" }), _jsx("input", { ref: inputRef, type: "text", placeholder: "Search pages, tokens, markets... (ESC to close)", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "flex-1 bg-transparent outline-none text-dark-text placeholder-dark-text/50 text-base sm:text-lg", "aria-label": "Search input" }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-1 hover:bg-dark-border rounded transition-colors", "aria-label": "Close", children: _jsx(X, { className: "w-5 h-5 text-dark-text/50" }) })] }), searchResults.length > 0 ? (_jsx("div", { className: "max-h-96 overflow-y-auto", role: "listbox", children: searchResults.map((result, index) => (_jsxs("button", { onClick: () => handleSelect(result), className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-border/50 transition-colors text-left border-b border-dark-border/50 last:border-b-0 focus:bg-dark-border outline-none", role: "option", "aria-selected": false, children: [_jsx("span", { className: "text-xl", children: result.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-dark-text font-medium truncate", children: result.label }), _jsx("div", { className: "text-xs text-dark-text/50 capitalize", children: result.category })] }), _jsx("kbd", { className: "hidden sm:inline text-xs bg-dark-border/50 rounded px-2 py-1 text-dark-text/50", children: index === 0 ? '↵' : '' })] }, result.id))) })) : searchQuery ? (_jsxs("div", { className: "px-4 py-8 text-center text-dark-text/50", children: ["No results found for \"", searchQuery, "\""] })) : (_jsxs("div", { className: "px-4 py-8 text-center", children: [_jsx("div", { className: "text-dark-text/70 mb-4", children: "Popular Searches" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: SEARCH_DATA.slice(0, 6).map((item) => (_jsxs("button", { onClick: () => handleSelect(item), className: "px-3 py-2 rounded bg-dark-border/30 hover:bg-dark-border/50 text-dark-text/70 hover:text-dark-text transition-all text-sm", children: [item.icon, " ", item.label] }, item.id))) })] })), _jsx("div", { className: "px-4 py-2 bg-dark-border/20 text-xs text-dark-text/50 flex justify-between items-center border-t border-dark-border", children: _jsx("span", { children: "Keyboard shortcuts: \u2318K to open, ESC to close" }) })] }) }))] }));
};
export default RyTopBarSearchModal;
