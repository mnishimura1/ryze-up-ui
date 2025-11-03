import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Card from '../Card';
export const RyGazeHeatmapOverlay = () => {
    const [gazePoints, setGazePoints] = useState([]);
    const [enabled, setEnabled] = useState(false);
    const [permission, setPermission] = useState('pending');
    useEffect(() => {
        if (enabled && permission === 'pending') {
            requestCameraPermission();
        }
    }, [enabled]);
    const requestCameraPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setPermission('granted');
        }
        catch (err) {
            setPermission('denied');
            console.error('Camera permission denied:', err);
        }
    };
    const heatmapRadius = 60;
    const getHeatmapColor = (intensity) => {
        if (intensity > 0.7)
            return 'rgba(255, 20, 147, 0.6)'; // hot pink
        if (intensity > 0.4)
            return 'rgba(255, 165, 0, 0.4)'; // orange
        return 'rgba(0, 212, 255, 0.2)'; // cyan
    };
    return (_jsxs(_Fragment, { children: [enabled && permission === 'granted' && (_jsx("svg", { className: "fixed inset-0 w-full h-full z-10 pointer-events-none", style: { mixBlendMode: 'screen' }, children: gazePoints.map((point, idx) => (_jsx("circle", { cx: point.x, cy: point.y, r: heatmapRadius, fill: getHeatmapColor(point.intensity), style: {
                        filter: `blur(${20 * (1 - point.intensity)}px)`,
                        opacity: point.intensity * 0.6,
                    } }, idx))) })), _jsx(Card, { children: _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: enabled, onChange: (e) => setEnabled(e.target.checked), className: "rounded" }), _jsx("span", { className: "text-sm font-semibold", children: "Gaze Heatmap" })] }), enabled && (_jsx("span", { className: `text-xs px-2 py-1 rounded font-semibold ${permission === 'granted' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`, children: permission === 'granted' ? '✓ Active' : '✗ ' + (permission === 'denied' ? 'Denied' : 'Pending') }))] }), enabled && permission === 'denied' && (_jsx("div", { className: "text-xs text-danger bg-danger/10 p-2 rounded", children: "Camera permission required. Please enable in browser settings." })), enabled && permission === 'granted' && (_jsxs("div", { className: "text-xs text-dark-text/70 space-y-1", children: [_jsxs("div", { children: ["Gaze points tracked: ", gazePoints.length] }), _jsx("div", { children: "Heatmap intensity: Warm = focused, Cool = periphery" })] }))] }) })] }));
};
