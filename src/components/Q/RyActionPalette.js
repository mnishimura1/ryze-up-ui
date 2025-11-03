import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../lib/store';
export const RyActionPalette = () => {
    const { ai, safety } = useStore();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef(null);
    // Get real actions from AI suggestions in store
    const actions = (ai.suggestions || []).map((sugg, idx) => ({
        id: `action-${idx}`,
        name: typeof sugg === 'string' ? sugg : (sugg.text || sugg),
        description: `AI-suggested action`,
        icon: '🤖',
        category: 'trade',
        confidence: typeof sugg === 'object' ? (sugg.confidence || 0.8) : 0.8,
    }));
    if (actions.length === 0) {
        return null;
    }
    const filtered = actions.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase()));
    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);
    useEffect(() => {
        setSelectedIdx(0);
    }, [search]);
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIdx((prev) => Math.max(prev - 1, 0));
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            handleSelectAction(filtered[selectedIdx]);
        }
        else if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        }
    };
    const handleSelectAction = (action) => {
        if (!safety.deploy && action.category === 'trade') {
            return;
        }
        console.log(`Executing: ${action.name}`);
        setOpen(false);
        setSearch('');
    };
    const getCategoryColor = (category) => {
        const colors = {
            trade: 'text-success',
            research: 'text-warn',
            portfolio: 'text-info',
            control: 'text-danger',
        };
        return colors[category] || 'text-dark-text/70';
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed bottom-4 right-4 z-30", children: _jsx("button", { onClick: () => setOpen(!open), className: "px-4 py-2 rounded-lg bg-accent text-dark-bg font-semibold text-sm hover:bg-accent/90 transition shadow-lg", children: "\u2318K Action Palette" }) }), open && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-40 backdrop-blur-sm", onClick: () => setOpen(false) })), open && (_jsxs("div", { className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 z-50 rounded-lg shadow-2xl overflow-hidden bg-dark-panel border border-dark-border", children: [_jsx("div", { className: "p-4 border-b border-dark-border", children: _jsx("input", { ref: inputRef, type: "text", placeholder: "Type action name or description...", value: search, onChange: (e) => setSearch(e.target.value), onKeyDown: handleKeyDown, className: "w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-sm outline-none focus:border-accent" }) }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: filtered.length > 0 ? (filtered.map((action, idx) => {
                            const isDisabled = !safety.deploy && action.category === 'trade';
                            return (_jsx("button", { onClick: () => handleSelectAction(action), disabled: isDisabled, className: `w-full px-4 py-3 text-left border-b border-dark-border/50 transition ${idx === selectedIdx && !isDisabled
                                    ? 'bg-accent/20 border-accent'
                                    : isDisabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-dark-bg'}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("span", { className: "text-lg", children: action.icon }), _jsx("span", { className: "font-semibold text-dark-text", children: action.name }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded ${getCategoryColor(action.category)}`, children: action.category })] }), _jsx("p", { className: "text-xs text-dark-text/70", children: action.description })] }), _jsx("div", { className: "ml-3", children: _jsxs("span", { className: "text-xs font-bold text-accent", children: [(action.confidence * 100).toFixed(0), "%"] }) })] }) }, action.id));
                        })) : (_jsxs("div", { className: "p-8 text-center text-dark-text/70 text-sm", children: ["No actions match \"", search, "\""] })) }), _jsxs("div", { className: "p-3 border-t border-dark-border bg-dark-bg text-xs text-dark-text/70 space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "\u2191\u2193 Navigate" }), _jsx("span", { children: "\u23CE Execute" }), _jsx("span", { children: "ESC Close" })] }), !safety.deploy && (_jsx("div", { className: "text-warn pt-2 border-t border-dark-border/50", children: "\u26A0\uFE0F Trade actions disabled (Sandbox Mode)" }))] })] }))] }));
};
