import React, { useMemo, useState } from 'react'

interface DecayParams {
  G: number // Offset days
  H: number // Half-life days
  F: number // Floor %
}

const DECAY_PRESETS: Record<string, { params: DecayParams; name: string }> = {
  lp: { params: { G: 7, H: 21, F: 0.2 }, name: 'LP Rewards' },
  trader: { params: { G: 3, H: 10, F: 0.1 }, name: 'Trader Rewards' },
  referral: { params: { G: 30, H: 60, F: 0.25 }, name: 'Referral Rewards' },
}

export const RyDecaySimulator: React.FC = () => {
  const [preset, setPreset] = useState<'lp' | 'trader' | 'referral'>('lp')
  const [delta, setDelta] = useState(0)
  const [customParams, setCustomParams] = useState<DecayParams | null>(null)

  const params = customParams || DECAY_PRESETS[preset].params

  // D(Δ) = max(F, 2^(-(Δ-G)/H))
  const decayFunction = (deltaVal: number, p: DecayParams): number => {
    const exponent = -(deltaVal - p.G) / p.H
    const decay = Math.pow(2, exponent)
    return Math.max(p.F, decay)
  }

  const currentDecay = useMemo(() => {
    return decayFunction(delta, params)
  }, [delta, params])

  // Generate curve data for SVG
  const curveData = useMemo(() => {
    const points = []
    for (let d = 0; d <= 60; d += 1) {
      const y = decayFunction(d, params)
      points.push({ x: d, y })
    }
    return points
  }, [params])

  // Scale for SVG
  const svgWidth = 400
  const svgHeight = 250
  const padding = 40
  const plotWidth = svgWidth - 2 * padding
  const plotHeight = svgHeight - 2 * padding

  const xScale = (x: number) => padding + (x / 60) * plotWidth
  const yScale = (y: number) => svgHeight - padding - (y * plotHeight)

  // Current point position
  const currentX = xScale(delta)
  const currentY = yScale(currentDecay)

  return (
    <div
      className="space-y-6"
      role="region"
      aria-label="Decay simulator"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Decay Simulator</h3>
        <div className="text-sm text-slate-400">
          D(Δ) = max(F, 2^(-(Δ-G)/H))
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex gap-2">
        {(Object.entries(DECAY_PRESETS)).map(
          ([key]) => {
            const presetKey = key as 'lp' | 'trader' | 'referral'
            return (
            <button
              key={key}
              onClick={() => {
                setPreset(presetKey)
                setCustomParams(null)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                presetKey === preset && !customParams
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              aria-pressed={presetKey === preset}
            >
              {DECAY_PRESETS[presetKey].name}
            </button>
          )
          }
        )}
      </div>

      {/* Parameter Controls */}
      <div className="grid grid-cols-3 gap-3 bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div>
          <label htmlFor="G" className="block text-xs font-medium text-slate-400 mb-1">
            G (Offset Days)
          </label>
          <input
            id="G"
            type="number"
            value={params.G}
            onChange={(e) =>
              setCustomParams({
                ...params,
                G: Number(e.target.value),
              })
            }
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-sm"
            min="0"
            step="0.5"
          />
        </div>
        <div>
          <label htmlFor="H" className="block text-xs font-medium text-slate-400 mb-1">
            H (Half-life Days)
          </label>
          <input
            id="H"
            type="number"
            value={params.H}
            onChange={(e) =>
              setCustomParams({
                ...params,
                H: Number(e.target.value),
              })
            }
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-sm"
            min="1"
            step="0.5"
          />
        </div>
        <div>
          <label htmlFor="F" className="block text-xs font-medium text-slate-400 mb-1">
            F (Floor %)
          </label>
          <input
            id="F"
            type="number"
            value={params.F * 100}
            onChange={(e) =>
              setCustomParams({
                ...params,
                F: Number(e.target.value) / 100,
              })
            }
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-mono text-sm"
            min="0"
            max="100"
            step="1"
          />
        </div>
      </div>

      {/* SVG Decay Plot */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="mx-auto"
          role="img"
          aria-label="Decay function plot"
        >
          {/* Axes */}
          <line
            x1={padding}
            y1={svgHeight - padding}
            x2={svgWidth - padding}
            y2={svgHeight - padding}
            stroke="#475569"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={svgHeight - padding}
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Grid lines */}
          {[0, 15, 30, 45, 60].map((d) => (
            <g key={`gridx-${d}`}>
              <line
                x1={xScale(d)}
                y1={svgHeight - padding}
                x2={xScale(d)}
                y2={svgHeight - padding + 5}
                stroke="#475569"
                strokeWidth="1"
              />
              <text
                x={xScale(d)}
                y={svgHeight - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#94a3b8"
              >
                {d}d
              </text>
            </g>
          ))}

          {[0, 0.25, 0.5, 0.75, 1].map((y) => (
            <g key={`gridy-${y}`}>
              <line
                x1={padding - 5}
                y1={yScale(y)}
                x2={padding}
                y2={yScale(y)}
                stroke="#475569"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={yScale(y) + 4}
                textAnchor="end"
                fontSize="12"
                fill="#94a3b8"
              >
                {(y * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {/* Curve */}
          <polyline
            points={curveData
              .map((p) => `${xScale(p.x)},${yScale(p.y)}`)
              .join(' ')}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
          />

          {/* Current position marker */}
          <circle cx={currentX} cy={currentY} r="5" fill="#ff1493" />
          <line
            x1={currentX}
            y1={svgHeight - padding}
            x2={currentX}
            y2={currentY}
            stroke="#ff1493"
            strokeWidth="1"
            strokeDasharray="4"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Delta Slider */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="delta-slider" className="font-medium text-slate-300">
            Days Since Start (Δ)
          </label>
          <span className="text-2xl font-bold text-cyan-400 font-mono">
            {delta}d
          </span>
        </div>
        <input
          id="delta-slider"
          type="range"
          min="0"
          max="60"
          value={delta}
          onChange={(e) => setDelta(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${
              (delta / 60) * 100
            }%, #475569 ${(delta / 60) * 100}%, #475569 100%)`,
          }}
        />
      </div>

      {/* Current Value Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-cyan-900/50 to-slate-800 rounded-lg p-4 border border-cyan-700/50">
          <p className="text-sm text-slate-400 mb-2">Current Decay Value</p>
          <p className="text-3xl font-bold text-cyan-400 font-mono">
            {(currentDecay * 100).toFixed(2)}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-pink-900/50 to-slate-800 rounded-lg p-4 border border-pink-700/50">
          <p className="text-sm text-slate-400 mb-2">Floor (Min Value)</p>
          <p className="text-3xl font-bold text-pink-400 font-mono">
            {(params.F * 100).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}
