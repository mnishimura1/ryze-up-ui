import React, { useState, useEffect, useRef } from 'react'

interface RyShieldDialProps {
  poolId: string
  onLevelChange?: (level: number) => void
}

export const RyShieldDial: React.FC<RyShieldDialProps> = ({ poolId, onLevelChange }) => {
  const [level, setLevel] = useState(75)
  const [loading, setLoading] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Fetch shield level from API
    const fetchShield = async () => {
      try {
        const response = await fetch(`/api/ssp/pools/${poolId}/shield`)
        if (response.ok) {
          const data = await response.json()
          setLevel(data.level || 75)
        }
      } catch (error) {
        console.error('Failed to fetch shield level:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShield()
  }, [poolId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      const newLevel = Math.min(100, level + 5)
      setLevel(newLevel)
      onLevelChange?.(newLevel)
    } else if (e.key === 'ArrowDown') {
      const newLevel = Math.max(0, level - 5)
      setLevel(newLevel)
      onLevelChange?.(newLevel)
    }
  }

  const angle = (level / 100) * 180 - 90

  return (
    <div
      className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center"
      role="slider"
      aria-label={`Shield level: ${level}%`}
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h4 className="text-sm font-semibold mb-4">🛡️ Shield Level</h4>

      {loading ? (
        <div className="h-32 flex items-center justify-center text-slate-400">
          Loading...
        </div>
      ) : (
        <div className="relative w-full h-32 flex items-center justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 100 60"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.3))' }}
          >
            {/* Background arc */}
            <path
              d="M 20 50 A 30 30 0 0 1 80 50"
              fill="none"
              stroke="#334155"
              strokeWidth="3"
            />

            {/* Active arc */}
            <path
              d={`M 20 50 A 30 30 0 0 1 ${50 + 30 * Math.cos((angle * Math.PI) / 180)} ${50 - 30 * Math.sin((angle * Math.PI) / 180)}`}
              fill="none"
              stroke={level >= 80 ? '#10b981' : level >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transition: 'stroke 0.3s ease' }}
            />

            {/* Needle */}
            <line
              x1="50"
              y1="50"
              x2={50 + 25 * Math.cos((angle * Math.PI) / 180)}
              y2={50 - 25 * Math.sin((angle * Math.PI) / 180)}
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Center circle */}
            <circle cx="50" cy="50" r="4" fill="#06b6d4" />
          </svg>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-cyan-400 font-mono">{level}%</p>
        <p className="text-xs text-slate-400 mt-1">
          {level >= 80
            ? '🟢 Strong Protection'
            : level >= 50
              ? '🟡 Moderate Protection'
              : '🔴 Low Protection'}
        </p>
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Use arrow keys to adjust (±5)
      </p>
    </div>
  )
}
