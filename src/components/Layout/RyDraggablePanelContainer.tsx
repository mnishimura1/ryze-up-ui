import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface PanelPosition {
  id: string;
  x: number;
  y: number;
  scale: number;
}

interface Props {
  children: React.ReactNode;
  panelId: string;
  title: string;
  onPositionChange?: (pos: PanelPosition) => void;
}

export const RyDraggablePanelContainer: React.FC<Props> = ({
  children,
  panelId,
  title,
  onPositionChange,
}) => {
  const [position, setPosition] = useState<PanelPosition>({
    id: panelId,
    x: 0,
    y: 0,
    scale: 1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // D3 Zoom Behavior
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
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
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

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

  return (
    <div
      className="relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG for D3 Zoom Background (optional) */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ display: 'none' }}
      />

      {/* Draggable Container */}
      <div
        ref={containerRef}
        className="transition-transform origin-top-left"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
        }}
      >
        {/* Panel Header */}
        <div className="drag-handle flex items-center space-x-2 p-3 bg-dark-border/50 hover:bg-dark-border rounded-t cursor-grab active:cursor-grabbing">
          <span className="text-sm">⋮⋮</span>
          <span className="flex-1 font-semibold text-sm text-dark-text">{title}</span>
          <button
            onClick={() => setPosition({ id: panelId, x: 0, y: 0, scale: 1 })}
            className="px-2 py-1 text-xs rounded bg-dark-border/50 hover:bg-dark-border transition"
          >
            Reset
          </button>
        </div>

        {/* Panel Content */}
        <div className="bg-dark-panel border border-t-0 border-dark-border rounded-b pointer-events-auto">
          {children}
        </div>
      </div>

      {/* Debug Info */}
      <div className="absolute bottom-0 right-0 text-xs text-dark-text/50 pointer-events-none p-2">
        x: {position.x.toFixed(0)} | y: {position.y.toFixed(0)} | scale: {position.scale.toFixed(2)}
      </div>
    </div>
  );
};
