import React, { useEffect, useRef, useState } from 'react'
import { Activity, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface FlowMetrics {
  heatmap: { frame_id: number; w: number; h: number; cells: Uint16Array }
  latency: { p50: number; p95: number; p99: number; loss_bp: number }
  imbalance: { ob_imb: number; microprice: number }
  queue_depth: number
}

const OrderFlow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [metrics, setMetrics] = useState<FlowMetrics>({
    heatmap: { frame_id: Date.now(), w: 50, h: 30, cells: new Uint16Array(1500) },
    latency: { p50: 45, p95: 120, p99: 200, loss_bp: 0.5 },
    imbalance: { ob_imb: 0.52, microprice: 2500.5 },
    queue_depth: 245
  })

  // Initialize and draw heatmap canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Responsive sizing
    const updateCanvasSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width - 8
        canvas.height = Math.min(400, window.innerHeight - 200)
        drawHeatmap(ctx, canvas, metrics.heatmap, zoom)
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Simulate real-time data updates
    const interval = setInterval(() => {
      const newCells = new Uint16Array(1500)
      for (let i = 0; i < 1500; i++) {
        newCells[i] = Math.floor(Math.random() * 65535)
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
      }))
    }, 1000)

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      clearInterval(interval)
    }
  }, [zoom])

  // Redraw on metrics change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawHeatmap(ctx, canvas, metrics.heatmap, zoom)
  }, [metrics, zoom])

  const drawHeatmap = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    frame: FlowMetrics['heatmap'],
    scale: number
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const cellW = (canvas.width / frame.w) * scale
    const cellH = (canvas.height / frame.h) * scale
    const offsetX = (canvas.width - frame.w * cellW) / 2
    const offsetY = (canvas.height - frame.h * cellH) / 2

    // Draw heatmap cells
    for (let y = 0; y < frame.h; y++) {
      for (let x = 0; x < frame.w; x++) {
        const idx = y * frame.w + x
        const intensity = frame.cells[idx] / 65535

        // Green to red gradient for intensity
        const hue = (1 - intensity) * 120 // Green (120) to Red (0)
        ctx.fillStyle = `hsl(${hue}, 100%, ${40 + intensity * 20}%)`

        ctx.fillRect(
          offsetX + x * cellW,
          offsetY + y * cellH,
          cellW,
          cellH
        )

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'
        ctx.lineWidth = 0.5
        ctx.strokeRect(
          offsetX + x * cellW,
          offsetY + y * cellH,
          cellW,
          cellH
        )
      }
    }

    // Draw legend
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(10, 10, 120, 80)
    ctx.fillStyle = 'white'
    ctx.font = '12px sans-serif'
    ctx.fillText('Order Flow Heatmap', 15, 30)
    ctx.fillText('Green: Low activity', 15, 50)
    ctx.fillText('Red: High activity', 15, 70)
    ctx.fillText(`Zoom: ${zoom.toFixed(2)}x`, 15, 85)
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 1))
  const handleReset = () => setZoom(1)

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Activity className="w-6 h-6" />
        Order Flow Intelligence
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Heatmap Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Order Flow Heatmap</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-dark-border hover:bg-accent/20 rounded transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-dark-border hover:bg-accent/20 rounded transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 bg-dark-border hover:bg-accent/20 rounded transition-colors"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              className="w-full border border-dark-border rounded bg-black"
              role="img"
              aria-label="Order flow heatmap visualization with real-time order intensity"
            />
            <div className="text-xs text-subtext mt-2">
              Frame ID: {metrics.heatmap.frame_id} | Queue Depth: {metrics.queue_depth} orders
            </div>
          </div>
        </div>

        {/* Metrics Panel */}
        <div className="space-y-3">
          {/* Latency Metrics */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3">Latency</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-subtext">P50:</span>
                <span className="font-mono text-accent">{metrics.latency.p50.toFixed(1)}μs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtext">P95:</span>
                <span className="font-mono text-warn">{metrics.latency.p95.toFixed(1)}μs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtext">P99:</span>
                <span className="font-mono text-danger">{metrics.latency.p99.toFixed(1)}μs</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dark-border">
                <span className="text-subtext">Loss:</span>
                <span className="font-mono text-danger">{metrics.latency.loss_bp.toFixed(2)} bp</span>
              </div>
            </div>
          </div>

          {/* Imbalance Gauge */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3">Order Imbalance</h4>
            <div className="space-y-2">
              <div className="w-full bg-border rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success to-danger transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, (metrics.imbalance.ob_imb * 100)))
                      }%`
                  }}
                  role="progressbar"
                  aria-valuenow={metrics.imbalance.ob_imb * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Order book imbalance"
                />
              </div>
              <div className="flex justify-between text-xs">
                <span>Buy</span>
                <span className="font-mono">
                  {(metrics.imbalance.ob_imb * 100).toFixed(1)}%
                </span>
                <span>Sell</span>
              </div>
            </div>

            <div className="mt-3 p-2 bg-dark-bg rounded text-xs">
              <div className="text-subtext mb-1">Microprice</div>
              <div className="font-mono text-accent">
                ${metrics.imbalance.microprice.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Queue Depth Indicator */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3">Queue Depth</h4>
            <div className="text-3xl font-bold text-accent mb-1">
              {metrics.queue_depth}
            </div>
            <div className="text-xs text-subtext">pending orders</div>
            <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${Math.min(100, (metrics.queue_depth / 500) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4 text-sm text-subtext">
        <p>
          Real-time order flow visualization with WebSocket streaming. Heatmap shows order intensity
          across price levels. Use zoom controls to inspect specific areas. Latency metrics track
          message delivery performance. Imbalance gauge indicates buy/sell pressure.
        </p>
      </div>
    </div>
  )
}

export default OrderFlow
