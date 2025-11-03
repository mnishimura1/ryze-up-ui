import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Clock } from 'lucide-react';
export const RyADLEvents = () => {
    const [events, setEvents] = useState([
        {
            id: '1',
            timestamp: Date.now() - 300000,
            event_type: 'risk_warning',
            severity: 'medium',
            symbol: 'ETH-USD',
            impact: 0.5,
            status: 'active'
        },
        {
            id: '2',
            timestamp: Date.now() - 600000,
            event_type: 'partial_liquidation',
            severity: 'high',
            symbol: 'BTC-USD',
            impact: 0.8,
            status: 'resolved'
        }
    ]);
    const getSeverityColor = (severity) => {
        if (severity === 'high')
            return 'text-danger border-danger/30 bg-danger/5';
        if (severity === 'medium')
            return 'text-warn border-warn/30 bg-warn/5';
        return 'text-accent border-accent/30 bg-accent/5';
    };
    const getEventIcon = (type) => {
        if (type === 'liquidation')
            return '🔴';
        if (type === 'partial_liquidation')
            return '🟠';
        return '⚠️';
    };
    const formatTime = (timestamp) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        return new Date(timestamp).toLocaleDateString();
    };
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-semibold text-sm text-subtext", children: "Recent ADL Events" }), events.length === 0 ? (_jsx("div", { className: "text-xs text-subtext text-center py-4", children: "No recent events" })) : (_jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: events.map((event) => (_jsxs("div", { className: `border rounded-lg p-3 text-xs ${getSeverityColor(event.severity)} ${event.status === 'active' ? 'opacity-100' : 'opacity-50'}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: getEventIcon(event.event_type) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold capitalize", children: event.event_type.replace('_', ' ') }), _jsx("div", { className: "text-subtext", children: event.symbol })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-mono font-bold", children: [(event.impact * 100).toFixed(1), "%"] }), _jsxs("div", { className: "text-subtext flex items-center justify-end gap-1 mt-1", children: [_jsx(Clock, { className: "w-3 h-3" }), formatTime(event.timestamp)] })] })] }), event.status === 'active' && (_jsxs("div", { className: "text-xs bg-current/20 rounded px-2 py-1 inline-block mt-1", children: ["Status: ", event.status.toUpperCase()] }))] }, event.id))) }))] }));
};
