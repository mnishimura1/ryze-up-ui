import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
export const RyDraggablePanelContainer = ({ children, panelId, title, onPositionChange, }) => {
    const [position, setPosition] = useState({
        id: panelId,
        x: 0,
        y: 0,
        scale: 1,
    });
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    // D3 Zoom Behavior
    useEffect(() => {
        if (!svgRef.current || !containerRef.current)
            return;
        const zoom = d3.zoom()
            .on('zoom', (event) => {
            if (containerRef.current) {
                const { x, y, k } = event.transform;
                containerRef.current.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
                setPosition((prev) => ({
                    ...prev,
                    x,
                    y,
                    scale: k,
                }));
                onPositionChange?.({ id: panelId, x, y, scale: k });
            }
        });
        d3.select(svgRef.current).call(zoom);
    }, [panelId, onPositionChange]);
    // Drag Handler
    const handleMouseDown = (e) => {
        if (e.target.closest('.drag-handle')) {
            setIsDragging(true);
        }
    };
    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current)
            return;
        const newX = position.x + e.movementX;
        const newY = position.y + e.movementY;
        containerRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${position.scale})`;
        setPosition((prev) => ({
            ...prev,
            x: newX,
            y: newY,
        }));
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    return (_jsxs("div", { className: "relative", onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, children: [_jsx("svg", { ref: svgRef, className: "absolute inset-0 w-full h-full pointer-events-none z-0", style: { display: 'none' } }), _jsxs("div", { ref: containerRef, className: "transition-transform origin-top-left", style: {
                    transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
                }, children: [_jsxs("div", { className: "drag-handle flex items-center space-x-2 p-3 bg-dark-border/50 hover:bg-dark-border rounded-t cursor-grab active:cursor-grabbing", children: [_jsx("span", { className: "text-sm", children: "\u22EE\u22EE" }), _jsx("span", { className: "flex-1 font-semibold text-sm text-dark-text", children: title }), _jsx("button", { onClick: () => setPosition({ id: panelId, x: 0, y: 0, scale: 1 }), className: "px-2 py-1 text-xs rounded bg-dark-border/50 hover:bg-dark-border transition", children: "Reset" })] }), _jsx("div", { className: "bg-dark-panel border border-t-0 border-dark-border rounded-b pointer-events-auto", children: children })] }), _jsxs("div", { className: "absolute bottom-0 right-0 text-xs text-dark-text/50 pointer-events-none p-2", children: ["x: ", position.x.toFixed(0), " | y: ", position.y.toFixed(0), " | scale: ", position.scale.toFixed(2)] })] }));
};
