import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export const RyFeeDistributionPie = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchFees = async () => {
            try {
                const response = await fetch('/api/ssp/fees');
                if (response.ok) {
                    const data = await response.json();
                    setFees(data || []);
                }
            }
            catch (error) {
                console.error('Failed to fetch fees:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, []);
    const total = fees.reduce((sum, f) => sum + f.amount, 0);
    if (loading || fees.length === 0) {
        return (_jsxs("div", { className: "bg-slate-800 rounded-lg p-6 border border-slate-700", children: [_jsx("h4", { className: "text-sm font-semibold mb-4", children: "Fee Distribution" }), _jsx("div", { className: "h-32 flex items-center justify-center text-slate-400", children: loading ? 'Loading fees...' : 'No fee data' })] }));
    }
    let cumulativePercent = 0;
    const slices = fees.map((f) => {
        const startPercent = cumulativePercent;
        cumulativePercent += f.percentage;
        const startAngle = (startPercent / 100) * 360 - 90;
        const endAngle = (cumulativePercent / 100) * 360 - 90;
        return { ...f, startAngle, endAngle };
    });
    const size = 120;
    const radius = 50;
    return (_jsxs("div", { className: "bg-slate-800 rounded-lg p-6 border border-slate-700", children: [_jsx("h4", { className: "text-sm font-semibold mb-4", children: "Fee Distribution" }), _jsx("div", { className: "flex items-center justify-center mb-6", children: _jsx("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, children: slices.map((slice, idx) => {
                        const startRad = (slice.startAngle * Math.PI) / 180;
                        const endRad = (slice.endAngle * Math.PI) / 180;
                        const x1 = size / 2 + radius * Math.cos(startRad);
                        const y1 = size / 2 + radius * Math.sin(startRad);
                        const x2 = size / 2 + radius * Math.cos(endRad);
                        const y2 = size / 2 + radius * Math.sin(endRad);
                        const largeArc = slice.percentage > 50 ? 1 : 0;
                        return (_jsx("path", { d: `M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`, fill: slice.color, opacity: "0.8", stroke: "#1e293b", strokeWidth: "1" }, idx));
                    }) }) }), _jsx("div", { className: "space-y-2", children: fees.map((f, idx) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded", style: { backgroundColor: f.color } }), _jsx("span", { className: "text-sm text-slate-300", children: f.source })] }), _jsxs("div", { className: "text-right", children: [_jsxs("span", { className: "text-sm font-mono font-semibold", children: [f.percentage.toFixed(1), "%"] }), _jsxs("span", { className: "text-xs text-slate-400 ml-2", children: ["$", f.amount.toFixed(2)] })] })] }, idx))) }), _jsx("div", { className: "border-t border-slate-700 mt-4 pt-4", children: _jsxs("p", { className: "text-sm text-slate-400", children: ["Total collected: ", _jsxs("span", { className: "font-semibold text-white", children: ["$", total.toFixed(2)] })] }) })] }));
};
