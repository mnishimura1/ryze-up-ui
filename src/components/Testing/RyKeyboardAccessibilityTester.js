import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Card from '../Card';
export const RyKeyboardAccessibilityTester = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [events, setEvents] = useState([]);
    // Real accessibility scores would come from actual audit in production
    const scores = null;
    useEffect(() => {
        const handleKeyDown = (e) => {
            const event = {
                key: e.key,
                timestamp: Date.now(),
                target: e.target.tagName,
                isAccessible: ['Enter', 'Space', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key),
            };
            setEvents((prev) => [event, ...prev.slice(0, 19)]);
        };
        if (isScanning) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isScanning]);
    const runFullScan = () => {
        setIsScanning(true);
        setEvents([]);
        // Actual scan would trigger via API
        setTimeout(() => setIsScanning(false), 2000);
    };
    if (!scores) {
        return null;
    }
    const getScoreColor = (score) => {
        if (score >= 90)
            return 'bg-success/20 text-success';
        if (score >= 75)
            return 'bg-warn/20 text-warn';
        return 'bg-danger/20 text-danger';
    };
    const getScoreGrade = (score) => {
        if (score >= 90)
            return 'A';
        if (score >= 80)
            return 'B';
        if (score >= 70)
            return 'C';
        return 'F';
    };
    return (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Keyboard Accessibility Tester" }), _jsx("button", { onClick: runFullScan, disabled: isScanning, className: `w-full px-4 py-2 rounded font-semibold text-sm transition mb-6 ${isScanning
                        ? 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'
                        : 'bg-accent text-dark-bg hover:bg-accent/90'}`, children: isScanning ? '⏳ Scanning...' : '🔍 Run Accessibility Audit' }), _jsx("div", { className: "p-4 bg-dark-bg rounded border border-dark-border/50 text-center text-sm text-dark-text/70 mb-6", children: "Run accessibility audit to populate scores" }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-sm font-semibold mb-3", children: "Keyboard Events Log (Live)" }), _jsx("div", { className: "max-h-32 overflow-y-auto space-y-1 bg-dark-bg rounded p-3 border border-dark-border/50", children: events.length > 0 ? (events.map((event, idx) => (_jsxs("div", { className: `text-xs font-mono p-1 rounded ${event.isAccessible
                                    ? 'bg-success/10 text-success'
                                    : 'bg-danger/10 text-danger'}`, children: [_jsx("span", { children: event.key }), _jsxs("span", { className: "text-dark-text/50 ml-2", children: ["on ", event.target] }), _jsx("span", { className: "text-dark-text/50 float-right", children: event.isAccessible ? '✓' : '✗' })] }, idx)))) : (_jsx("div", { className: "text-xs text-dark-text/70 py-2", children: isScanning ? 'Listening for keyboard events...' : 'No events yet. Press keys to test.' })) })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-dark-border text-xs text-dark-text/50 text-center", children: isScanning ? 'Scanning in progress...' : `Last scan: ${new Date().toLocaleTimeString()}` })] }) }));
};
