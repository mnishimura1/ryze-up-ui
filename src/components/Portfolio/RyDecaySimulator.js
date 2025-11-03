import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
const DECAY_PRESETS = {
    lp: { params: { G: 7, H: 21, F: 0.2 }, name: 'LP Rewards' },
    trader: { params: { G: 3, H: 10, F: 0.1 }, name: 'Trader Rewards' },
    referral: { params: { G: 30, H: 60, F: 0.25 }, name: 'Referral Rewards' },
};
export const RyDecaySimulator = () => {
    const [preset, setPreset] = useState('lp');
    const [delta, setDelta] = useState(0);
    const [customParams, setCustomParams] = useState(null);
    const params = customParams || DECAY_PRESETS[preset].params;
    // D(Δ) = max(F, 2^(-(Δ-G)/H))
    const decayFunction = (deltaVal, p) => {
        const exponent = -(deltaVal - p.G) / p.H;
        const decay = Math.pow(2, exponent);
        return Math.max(p.F, decay);
    };
    const currentDecay = useMemo(() => {
        return decayFunction(delta, params);
    }, [delta, params]);
    // Generate curve data for SVG
    const curveData = useMemo(() => {
        const points = [];
        for (let d = 0; d <= 60; d += 1) {
            const y = decayFunction(d, params);
            points.push({ x: d, y });
        }
        return points;
    }, [params]);
    // Scale for SVG
    const svgWidth = 400;
    const svgHeight = 250;
    const padding = 40;
    const plotWidth = svgWidth - 2 * padding;
    const plotHeight = svgHeight - 2 * padding;
    const xScale = (x) => padding + (x / 60) * plotWidth;
    const yScale = (y) => svgHeight - padding - (y * plotHeight);
    // Current point position
    const currentX = xScale(delta);
    const currentY = yScale(currentDecay);
    return (_jsxs("div", { className: "space-y-6", role: "region", "aria-label": "Decay simulator", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Decay Simulator" }), _jsx("div", { className: "text-sm text-slate-400", children: "D(\u0394) = max(F, 2^(-(\u0394-G)/H))" })] }), _jsx("div", { className: "flex gap-2", children: (Object.entries(DECAY_PRESETS)).map(([key]) => {
                    const presetKey = key;
                    return (_jsx("button", { onClick: () => {
                            setPreset(presetKey);
                            setCustomParams(null);
                        }, className: `px-4 py-2 rounded-lg font-medium transition-colors ${presetKey === preset && !customParams
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`, "aria-pressed": presetKey === preset, children: DECAY_PRESETS[presetKey].name }, key));
                }) }), _jsxs("div", { className: "grid grid-cols-3 gap-3 bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "G", className: "block text-xs font-medium text-slate-400 mb-1", children: "G (Offset Days)" }), _jsx("input", { id: "G", type: "number", value: params.G, onChange: (e) => setCustomParams({
                                    ...params,
                                    G: Number(e.target.value),
                                }), className: "w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-sm", min: "0", step: "0.5" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "H", className: "block text-xs font-medium text-slate-400 mb-1", children: "H (Half-life Days)" }), _jsx("input", { id: "H", type: "number", value: params.H, onChange: (e) => setCustomParams({
                                    ...params,
                                    H: Number(e.target.value),
                                }), className: "w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-sm", min: "1", step: "0.5" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "F", className: "block text-xs font-medium text-slate-400 mb-1", children: "F (Floor %)" }), _jsx("input", { id: "F", type: "number", value: params.F * 100, onChange: (e) => setCustomParams({
                                    ...params,
                                    F: Number(e.target.value) / 100,
                                }), className: "w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-sm", min: "0", max: "100", step: "1" })] })] }), _jsx("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700 overflow-x-auto", children: _jsxs("svg", { width: svgWidth, height: svgHeight, className: "mx-auto", role: "img", "aria-label": "Decay function plot", children: [_jsx("line", { x1: padding, y1: svgHeight - padding, x2: svgWidth - padding, y2: svgHeight - padding, stroke: "#475569", strokeWidth: "2" }), _jsx("line", { x1: padding, y1: padding, x2: padding, y2: svgHeight - padding, stroke: "#475569", strokeWidth: "2" }), [0, 15, 30, 45, 60].map((d) => (_jsxs("g", { children: [_jsx("line", { x1: xScale(d), y1: svgHeight - padding, x2: xScale(d), y2: svgHeight - padding + 5, stroke: "#475569", strokeWidth: "1" }), _jsxs("text", { x: xScale(d), y: svgHeight - padding + 20, textAnchor: "middle", fontSize: "12", fill: "#94a3b8", children: [d, "d"] })] }, `gridx-${d}`))), [0, 0.25, 0.5, 0.75, 1].map((y) => (_jsxs("g", { children: [_jsx("line", { x1: padding - 5, y1: yScale(y), x2: padding, y2: yScale(y), stroke: "#475569", strokeWidth: "1" }), _jsxs("text", { x: padding - 10, y: yScale(y) + 4, textAnchor: "end", fontSize: "12", fill: "#94a3b8", children: [(y * 100).toFixed(0), "%"] })] }, `gridy-${y}`))), _jsx("polyline", { points: curveData
                                .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
                                .join(' '), fill: "none", stroke: "#06b6d4", strokeWidth: "2" }), _jsx("circle", { cx: currentX, cy: currentY, r: "5", fill: "#ff1493" }), _jsx("line", { x1: currentX, y1: svgHeight - padding, x2: currentX, y2: currentY, stroke: "#ff1493", strokeWidth: "1", strokeDasharray: "4", opacity: "0.5" })] }) }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { htmlFor: "delta-slider", className: "font-medium text-slate-300", children: "Days Since Start (\u0394)" }), _jsxs("span", { className: "text-2xl font-bold text-cyan-400 font-mono", children: [delta, "d"] })] }), _jsx("input", { id: "delta-slider", type: "range", min: "0", max: "60", value: delta, onChange: (e) => setDelta(Number(e.target.value)), className: "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer", style: {
                            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(delta / 60) * 100}%, #475569 ${(delta / 60) * 100}%, #475569 100%)`,
                        } })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-cyan-900/50 to-slate-800 rounded-lg p-4 border border-cyan-700/50", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Current Decay Value" }), _jsxs("p", { className: "text-3xl font-bold text-cyan-400 font-mono", children: [(currentDecay * 100).toFixed(2), "%"] })] }), _jsxs("div", { className: "bg-gradient-to-br from-pink-900/50 to-slate-800 rounded-lg p-4 border border-pink-700/50", children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Floor (Min Value)" }), _jsxs("p", { className: "text-3xl font-bold text-pink-400 font-mono", children: [(params.F * 100).toFixed(2), "%"] })] })] })] }));
};
