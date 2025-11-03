import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
export const RyShieldDial = ({ poolId, onLevelChange }) => {
    const [level, setLevel] = useState(75);
    const [loading, setLoading] = useState(true);
    const svgRef = useRef(null);
    useEffect(() => {
        // Fetch shield level from API
        const fetchShield = async () => {
            try {
                const response = await fetch(`/api/ssp/pools/${poolId}/shield`);
                if (response.ok) {
                    const data = await response.json();
                    setLevel(data.level || 75);
                }
            }
            catch (error) {
                console.error('Failed to fetch shield level:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchShield();
    }, [poolId]);
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            const newLevel = Math.min(100, level + 5);
            setLevel(newLevel);
            onLevelChange?.(newLevel);
        }
        else if (e.key === 'ArrowDown') {
            const newLevel = Math.max(0, level - 5);
            setLevel(newLevel);
            onLevelChange?.(newLevel);
        }
    };
    const angle = (level / 100) * 180 - 90;
    return (_jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700 text-center", role: "slider", "aria-label": `Shield level: ${level}%`, "aria-valuenow": level, "aria-valuemin": 0, "aria-valuemax": 100, tabIndex: 0, onKeyDown: handleKeyDown, children: [_jsx("h4", { className: "text-sm font-semibold mb-4", children: "\uD83D\uDEE1\uFE0F Shield Level" }), loading ? (_jsx("div", { className: "h-32 flex items-center justify-center text-slate-400", children: "Loading..." })) : (_jsx("div", { className: "relative w-full h-32 flex items-center justify-center", children: _jsxs("svg", { ref: svgRef, viewBox: "0 0 100 60", className: "w-full h-full", style: { filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.3))' }, children: [_jsx("path", { d: "M 20 50 A 30 30 0 0 1 80 50", fill: "none", stroke: "#334155", strokeWidth: "3" }), _jsx("path", { d: `M 20 50 A 30 30 0 0 1 ${50 + 30 * Math.cos((angle * Math.PI) / 180)} ${50 - 30 * Math.sin((angle * Math.PI) / 180)}`, fill: "none", stroke: level >= 80 ? '#10b981' : level >= 50 ? '#f59e0b' : '#ef4444', strokeWidth: "3", strokeLinecap: "round", style: { transition: 'stroke 0.3s ease' } }), _jsx("line", { x1: "50", y1: "50", x2: 50 + 25 * Math.cos((angle * Math.PI) / 180), y2: 50 - 25 * Math.sin((angle * Math.PI) / 180), stroke: "#06b6d4", strokeWidth: "2", strokeLinecap: "round" }), _jsx("circle", { cx: "50", cy: "50", r: "4", fill: "#06b6d4" })] }) })), _jsxs("div", { className: "mt-4 text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-cyan-400 font-mono", children: [level, "%"] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: level >= 80
                            ? '🟢 Strong Protection'
                            : level >= 50
                                ? '🟡 Moderate Protection'
                                : '🔴 Low Protection' })] }), _jsx("p", { className: "text-xs text-slate-400 mt-3", children: "Use arrow keys to adjust (\u00B15)" })] }));
};
