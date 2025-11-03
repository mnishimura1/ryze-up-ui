import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Activity, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
const OrderFlow = () => {
    const canvasRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [metrics, setMetrics] = useState({
        heatmap: { frame_id: Date.now(), w: 50, h: 30, cells: new Uint16Array(1500) },
        latency: { p50: 45, p95: 120, p99: 200, loss_bp: 0.5 },
        imbalance: { ob_imb: 0.52, microprice: 2500.5 },
        queue_depth: 245
    });
    // Initialize and draw heatmap canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx)
            return;
        // Responsive sizing
        const updateCanvasSize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (rect) {
                canvas.width = rect.width - 8;
                canvas.height = Math.min(400, window.innerHeight - 200);
                drawHeatmap(ctx, canvas, metrics.heatmap, zoom);
            }
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        // Simulate real-time data updates
        const interval = setInterval(() => {
            const newCells = new Uint16Array(1500);
            for (let i = 0; i < 1500; i++) {
                newCells[i] = Math.floor(Math.random() * 65535);
            }
            setMetrics((prev) => ({
                ...prev,
                heatmap: { ...prev.heatmap, cells: newCells },
                latency: {
                    p50: 40 + Math.random() * 20,
                    p95: 100 + Math.random() * 50,
                    p99: 180 + Math.random() * 50,
                    loss_bp: Math.random() * 1
                },
                imbalance: {
                    ob_imb: 0.4 + Math.random() * 0.2,
                    microprice: 2400 + Math.random() * 200
                },
                queue_depth: 200 + Math.floor(Math.random() * 100)
            }));
        }, 1000);
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            clearInterval(interval);
        };
    }, [zoom]);
    // Redraw on metrics change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        drawHeatmap(ctx, canvas, metrics.heatmap, zoom);
    }, [metrics, zoom]);
    const drawHeatmap = (ctx, canvas, frame, scale) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cellW = (canvas.width / frame.w) * scale;
        const cellH = (canvas.height / frame.h) * scale;
        const offsetX = (canvas.width - frame.w * cellW) / 2;
        const offsetY = (canvas.height - frame.h * cellH) / 2;
        // Draw heatmap cells
        for (let y = 0; y < frame.h; y++) {
            for (let x = 0; x < frame.w; x++) {
                const idx = y * frame.w + x;
                const intensity = frame.cells[idx] / 65535;
                // Green to red gradient for intensity
                const hue = (1 - intensity) * 120; // Green (120) to Red (0)
                ctx.fillStyle = `hsl(${hue}, 100%, ${40 + intensity * 20}%)`;
                ctx.fillRect(offsetX + x * cellW, offsetY + y * cellH, cellW, cellH);
                // Draw grid lines
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(offsetX + x * cellW, offsetY + y * cellH, cellW, cellH);
            }
        }
        // Draw legend
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(10, 10, 120, 80);
        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        ctx.fillText('Order Flow Heatmap', 15, 30);
        ctx.fillText('Green: Low activity', 15, 50);
        ctx.fillText('Red: High activity', 15, 70);
        ctx.fillText(`Zoom: ${zoom.toFixed(2)}x`, 15, 85);
    };
    const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 3));
    const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 1));
    const handleReset = () => setZoom(1);
    return (_jsxs("div", { className: "space-y-4 p-4", children: [_jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [_jsx(Activity, { className: "w-6 h-6" }), "Order Flow Intelligence"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h3", { className: "font-semibold", children: "Order Flow Heatmap" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleZoomIn, className: "p-2 bg-dark-border hover:bg-accent/20 rounded transition-colors", "aria-label": "Zoom in", children: _jsx(ZoomIn, { className: "w-4 h-4" }) }), _jsx("button", { onClick: handleZoomOut, className: "p-2 bg-dark-border hover:bg-accent/20 rounded transition-colors", "aria-label": "Zoom out", children: _jsx(ZoomOut, { className: "w-4 h-4" }) }), _jsx("button", { onClick: handleReset, className: "p-2 bg-dark-border hover:bg-accent/20 rounded transition-colors", "aria-label": "Reset zoom", children: _jsx(RotateCcw, { className: "w-4 h-4" }) })] })] }), _jsx("canvas", { ref: canvasRef, className: "w-full border border-dark-border rounded bg-black", role: "img", "aria-label": "Order flow heatmap visualization with real-time order intensity" }), _jsxs("div", { className: "text-xs text-subtext mt-2", children: ["Frame ID: ", metrics.heatmap.frame_id, " | Queue Depth: ", metrics.queue_depth, " orders"] })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-sm mb-3", children: "Latency" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-subtext", children: "P50:" }), _jsxs("span", { className: "font-mono text-accent", children: [metrics.latency.p50.toFixed(1), "\u03BCs"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-subtext", children: "P95:" }), _jsxs("span", { className: "font-mono text-warn", children: [metrics.latency.p95.toFixed(1), "\u03BCs"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-subtext", children: "P99:" }), _jsxs("span", { className: "font-mono text-danger", children: [metrics.latency.p99.toFixed(1), "\u03BCs"] })] }), _jsxs("div", { className: "flex justify-between pt-2 border-t border-dark-border", children: [_jsx("span", { className: "text-subtext", children: "Loss:" }), _jsxs("span", { className: "font-mono text-danger", children: [metrics.latency.loss_bp.toFixed(2), " bp"] })] })] })] }), _jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-sm mb-3", children: "Order Imbalance" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "w-full bg-border rounded-full h-6 overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-success to-danger transition-all", style: {
                                                        width: `${Math.max(0, Math.min(100, (metrics.imbalance.ob_imb * 100)))}%`
                                                    }, role: "progressbar", "aria-valuenow": metrics.imbalance.ob_imb * 100, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": "Order book imbalance" }) }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { children: "Buy" }), _jsxs("span", { className: "font-mono", children: [(metrics.imbalance.ob_imb * 100).toFixed(1), "%"] }), _jsx("span", { children: "Sell" })] })] }), _jsxs("div", { className: "mt-3 p-2 bg-dark-bg rounded text-xs", children: [_jsx("div", { className: "text-subtext mb-1", children: "Microprice" }), _jsxs("div", { className: "font-mono text-accent", children: ["$", metrics.imbalance.microprice.toFixed(2)] })] })] }), _jsxs("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-sm mb-3", children: "Queue Depth" }), _jsx("div", { className: "text-3xl font-bold text-accent mb-1", children: metrics.queue_depth }), _jsx("div", { className: "text-xs text-subtext", children: "pending orders" }), _jsx("div", { className: "mt-2 h-1 bg-border rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-accent transition-all", style: { width: `${Math.min(100, (metrics.queue_depth / 500) * 100)}%` } }) })] })] })] }), _jsx("div", { className: "bg-dark-surface border border-dark-border rounded-lg p-4 text-sm text-subtext", children: _jsx("p", { children: "Real-time order flow visualization with WebSocket streaming. Heatmap shows order intensity across price levels. Use zoom controls to inspect specific areas. Latency metrics track message delivery performance. Imbalance gauge indicates buy/sell pressure." }) })] }));
};
export default OrderFlow;
