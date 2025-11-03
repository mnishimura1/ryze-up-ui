import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
export const RyEpochConfigurator = () => {
    const [config, setConfig] = useState({
        B_c: 1000000, // Cap: 1M units/epoch
        K_c: 500000, // Scaling factor
        T_min: 100000, // Threshold
        activityLevel: 750000, // Current activity
    });
    const emission = useMemo(() => {
        return Math.min(config.B_c, config.activityLevel / config.K_c);
    }, [config]);
    const previewPercentage = useMemo(() => {
        return (emission / config.B_c) * 100;
    }, [emission, config.B_c]);
    const applyEpoch = async () => {
        try {
            const response = await fetch('/api/units/epoch-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            if (response.ok) {
                console.log('Epoch configuration applied');
            }
        }
        catch (error) {
            console.error('Failed to apply epoch config:', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", role: "region", "aria-label": "Epoch configurator", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Epoch Configuration" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("label", { htmlFor: "B_c", className: "block text-sm font-medium text-slate-300 mb-2", children: "B_c (Cap) - Max units per epoch" }), _jsx("input", { id: "B_c", type: "number", value: config.B_c, onChange: (e) => setConfig({ ...config, B_c: Number(e.target.value) }), className: "w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono", min: "1000", step: "10000" }), _jsxs("p", { className: "text-xs text-slate-400 mt-2", children: ["Currently: ", config.B_c.toLocaleString()] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("label", { htmlFor: "K_c", className: "block text-sm font-medium text-slate-300 mb-2", children: "K_c (Scaling) - Activity multiplier" }), _jsx("input", { id: "K_c", type: "number", value: config.K_c, onChange: (e) => setConfig({ ...config, K_c: Number(e.target.value) }), className: "w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono", min: "1000", step: "10000" }), _jsxs("p", { className: "text-xs text-slate-400 mt-2", children: ["Currently: ", config.K_c.toLocaleString()] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("label", { htmlFor: "T_min", className: "block text-sm font-medium text-slate-300 mb-2", children: "T_min (Threshold) - Min activity trigger" }), _jsx("input", { id: "T_min", type: "number", value: config.T_min, onChange: (e) => setConfig({ ...config, T_min: Number(e.target.value) }), className: "w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono", min: "0", step: "10000" }), _jsxs("p", { className: "text-xs text-slate-400 mt-2", children: ["Currently: ", config.T_min.toLocaleString()] })] }), _jsxs("div", { className: "bg-slate-800 rounded-lg p-4 border border-slate-700", children: [_jsx("label", { htmlFor: "activity", className: "block text-sm font-medium text-slate-300 mb-2", children: "Activity Level - Current epoch activity" }), _jsx("input", { id: "activity", type: "number", value: config.activityLevel, onChange: (e) => setConfig({ ...config, activityLevel: Number(e.target.value) }), className: "w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono", min: "0", step: "10000" }), _jsxs("p", { className: "text-xs text-slate-400 mt-2", children: ["Currently: ", config.activityLevel.toLocaleString()] })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-cyan-900/50 to-slate-800 rounded-lg p-6 border border-cyan-700/50", children: [_jsx("h4", { className: "font-semibold mb-4 text-cyan-300", children: "\uD83D\uDCCA Emission Preview" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-slate-800/50 rounded p-3 font-mono text-sm text-slate-300", children: [_jsx("p", { children: "Emission = min(B_c, Activity / K_c)" }), _jsxs("p", { children: ["Emission = min(", config.B_c.toLocaleString(), ", ", config.activityLevel.toLocaleString(), " / ", config.K_c.toLocaleString(), ")"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Calculated Emission" }), _jsx("p", { className: "text-3xl font-bold text-cyan-400 font-mono", children: emission.toLocaleString('en-US', {
                                                    maximumFractionDigits: 0,
                                                }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "% of Cap" }), _jsxs("div", { className: "flex items-end gap-3", children: [_jsxs("p", { className: "text-3xl font-bold text-white font-mono", children: [previewPercentage.toFixed(1), "%"] }), _jsxs("div", { className: "text-sm text-slate-400", children: [previewPercentage >= 90 && '🔴 High', previewPercentage >= 50 && previewPercentage < 90 && '🟡 Medium', previewPercentage < 50 && '🟢 Low'] })] })] })] }), _jsx("div", { className: "w-full bg-slate-700 rounded-full h-3", children: _jsx("div", { className: `h-3 rounded-full transition-all ${previewPercentage >= 90
                                        ? 'bg-red-500'
                                        : previewPercentage >= 50
                                            ? 'bg-yellow-500'
                                            : 'bg-green-500'}`, style: { width: `${Math.min(previewPercentage, 100)}%` } }) })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: applyEpoch, className: "flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors", "aria-label": "Apply epoch configuration", children: "\u2699\uFE0F Apply Epoch Config" }), _jsx("button", { onClick: () => setConfig({
                            B_c: 1000000,
                            K_c: 500000,
                            T_min: 100000,
                            activityLevel: 750000,
                        }), className: "px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors", children: "Reset" })] })] }));
};
