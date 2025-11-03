import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
export const RySolvencyInvariantsDashboard = ({ invariants }) => {
    const getStatusIcon = (status) => {
        if (status === 'passed')
            return _jsx(CheckCircle, { className: "w-4 h-4 text-success" });
        if (status === 'warning')
            return _jsx(AlertCircle, { className: "w-4 h-4 text-warn" });
        return _jsx(XCircle, { className: "w-4 h-4 text-danger" });
    };
    const getStatusColor = (status) => {
        if (status === 'passed')
            return 'bg-success/10 border-success/30 text-success';
        if (status === 'warning')
            return 'bg-warn/10 border-warn/30 text-warn';
        return 'bg-danger/10 border-danger/30 text-danger';
    };
    const passCount = invariants.filter((i) => i.status === 'passed').length;
    const passPercentage = ((passCount / invariants.length) * 100).toFixed(0);
    return (_jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-semibold text-sm", children: "Solvency Invariants" }), _jsxs("div", { className: "text-sm font-mono text-accent", children: [passCount, "/", invariants.length, " (", passPercentage, "%)"] })] }), _jsx("div", { className: "w-full bg-dark-border rounded-full h-2 overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-success to-warn transition-all", style: { width: `${passPercentage}%` } }) }), _jsx("div", { className: "space-y-2", children: invariants.map((inv, idx) => (_jsxs("div", { className: `border rounded-lg p-2 text-xs ${getStatusColor(inv.status)} flex items-start justify-between`, children: [_jsxs("div", { className: "flex items-start gap-2 flex-1", children: [_jsx("div", { className: "mt-0.5", children: getStatusIcon(inv.status) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: inv.name }), _jsx("div", { className: "text-xs opacity-75", children: inv.description })] })] }), _jsxs("div", { className: "text-right ml-2", children: [_jsx("div", { className: "font-mono font-bold", children: inv.value.toFixed(2) }), _jsxs("div", { className: "text-xs opacity-75", children: ["/ ", inv.threshold.toFixed(2)] })] })] }, idx))) })] }));
};
