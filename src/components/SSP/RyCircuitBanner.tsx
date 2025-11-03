import React, { useState, useEffect } from 'react'

interface CircuitState {
  active: boolean
  reason?: string
  triggeredAt?: number
  cooldownUntil?: number
}

export const RyCircuitBanner: React.FC = () => {
  const [circuit, setCircuit] = useState<CircuitState>({ active: false })
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  useEffect(() => {
    const fetchCircuitState = async () => {
      try {
        const response = await fetch('/api/ssp/circuit')
        if (response.ok) {
          const data = await response.json()
          setCircuit(data || { active: false })
        }
      } catch (error) {
        console.error('Failed to fetch circuit state:', error)
      }
    }

    fetchCircuitState()
    const interval = setInterval(fetchCircuitState, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (circuit.cooldownUntil) {
      const timer = setInterval(() => {
        const remaining = Math.max(
          0,
          circuit.cooldownUntil! - Date.now()
        )
        setCooldownRemaining(remaining)
        if (remaining === 0) {
          clearInterval(timer)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [circuit.cooldownUntil])

  const cooldownMinutes = Math.ceil(cooldownRemaining / 60000)

  if (!circuit.active) {
    return (
      <div className="bg-green-900/20 border border-green-700/50 rounded-lg px-4 py-3">
        <p className="text-sm text-green-300 flex items-center gap-2">
          <span>✅</span>
          Circuit breaker: Normal operation
        </p>
      </div>
    )
  }

  return (
    <div
      className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-4 space-y-2"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm font-semibold text-red-300 flex items-center gap-2">
        <span className="animate-pulse">🚨</span>
        Circuit Breaker Triggered
      </p>

      {circuit.reason && (
        <p className="text-sm text-red-200">
          Reason: {circuit.reason}
        </p>
      )}

      {circuit.triggeredAt && (
        <p className="text-xs text-red-300">
          Triggered: {new Date(circuit.triggeredAt).toLocaleTimeString()}
        </p>
      )}

      {cooldownRemaining > 0 && (
        <div className="mt-3 pt-3 border-t border-red-700/30">
          <p className="text-xs text-red-300 mb-2">
            Cooldown: {cooldownMinutes}m remaining
          </p>
          <div className="w-full bg-red-900 rounded-full h-1">
            <div
              className="bg-red-500 h-1 rounded-full transition-all"
              style={{
                width: `${100 - (cooldownRemaining / (60 * 60000)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-red-200 mt-3">
        Smart swap protection is active. Normal trading operations are paused.
      </p>
    </div>
  )
}
