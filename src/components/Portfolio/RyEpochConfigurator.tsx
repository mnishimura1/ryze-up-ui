import React, { useState, useMemo } from 'react'

interface EpochConfig {
  B_c: number
  K_c: number
  T_min: number
  activityLevel: number
}

export const RyEpochConfigurator: React.FC = () => {
  const [config, setConfig] = useState<EpochConfig>({
    B_c: 1000000,      // Cap: 1M units/epoch
    K_c: 500000,       // Scaling factor
    T_min: 100000,     // Threshold
    activityLevel: 750000, // Current activity
  })

  const emission = useMemo(() => {
    return Math.min(config.B_c, config.activityLevel / config.K_c)
  }, [config])

  const previewPercentage = useMemo(() => {
    return (emission / config.B_c) * 100
  }, [emission, config.B_c])

  const applyEpoch = async () => {
    try {
      const response = await fetch('/api/units/epoch-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        console.log('Epoch configuration applied')
      }
    } catch (error) {
      console.error('Failed to apply epoch config:', error)
    }
  }

  return (
    <div
      className="space-y-6"
      role="region"
      aria-label="Epoch configurator"
    >
      <h3 className="text-lg font-semibold">Epoch Configuration</h3>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* B_c (Cap) */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <label htmlFor="B_c" className="block text-sm font-medium text-slate-300 mb-2">
            B_c (Cap) - Max units per epoch
          </label>
          <input
            id="B_c"
            type="number"
            value={config.B_c}
            onChange={(e) =>
              setConfig({ ...config, B_c: Number(e.target.value) })
            }
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono"
            min="1000"
            step="10000"
          />
          <p className="text-xs text-slate-400 mt-2">
            Currently: {config.B_c.toLocaleString()}
          </p>
        </div>

        {/* K_c (Scaling Factor) */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <label htmlFor="K_c" className="block text-sm font-medium text-slate-300 mb-2">
            K_c (Scaling) - Activity multiplier
          </label>
          <input
            id="K_c"
            type="number"
            value={config.K_c}
            onChange={(e) =>
              setConfig({ ...config, K_c: Number(e.target.value) })
            }
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono"
            min="1000"
            step="10000"
          />
          <p className="text-xs text-slate-400 mt-2">
            Currently: {config.K_c.toLocaleString()}
          </p>
        </div>

        {/* T_min (Threshold) */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <label htmlFor="T_min" className="block text-sm font-medium text-slate-300 mb-2">
            T_min (Threshold) - Min activity trigger
          </label>
          <input
            id="T_min"
            type="number"
            value={config.T_min}
            onChange={(e) =>
              setConfig({ ...config, T_min: Number(e.target.value) })
            }
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono"
            min="0"
            step="10000"
          />
          <p className="text-xs text-slate-400 mt-2">
            Currently: {config.T_min.toLocaleString()}
          </p>
        </div>

        {/* Activity Level */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <label htmlFor="activity" className="block text-sm font-medium text-slate-300 mb-2">
            Activity Level - Current epoch activity
          </label>
          <input
            id="activity"
            type="number"
            value={config.activityLevel}
            onChange={(e) =>
              setConfig({ ...config, activityLevel: Number(e.target.value) })
            }
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white font-mono"
            min="0"
            step="10000"
          />
          <p className="text-xs text-slate-400 mt-2">
            Currently: {config.activityLevel.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Emission Preview */}
      <div className="bg-gradient-to-br from-cyan-900/50 to-slate-800 rounded-lg p-6 border border-cyan-700/50">
        <h4 className="font-semibold mb-4 text-cyan-300">📊 Emission Preview</h4>

        <div className="space-y-4">
          {/* Formula */}
          <div className="bg-slate-800/50 rounded p-3 font-mono text-sm text-slate-300">
            <p>Emission = min(B_c, Activity / K_c)</p>
            <p>Emission = min({config.B_c.toLocaleString()}, {config.activityLevel.toLocaleString()} / {config.K_c.toLocaleString()})</p>
          </div>

          {/* Result */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-2">Calculated Emission</p>
              <p className="text-3xl font-bold text-cyan-400 font-mono">
                {emission.toLocaleString('en-US', {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">% of Cap</p>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-white font-mono">
                  {previewPercentage.toFixed(1)}%
                </p>
                <div className="text-sm text-slate-400">
                  {previewPercentage >= 90 && '🔴 High'}
                  {previewPercentage >= 50 && previewPercentage < 90 && '🟡 Medium'}
                  {previewPercentage < 50 && '🟢 Low'}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                previewPercentage >= 90
                  ? 'bg-red-500'
                  : previewPercentage >= 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(previewPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={applyEpoch}
          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
          aria-label="Apply epoch configuration"
        >
          ⚙️ Apply Epoch Config
        </button>
        <button
          onClick={() =>
            setConfig({
              B_c: 1000000,
              K_c: 500000,
              T_min: 100000,
              activityLevel: 750000,
            })
          }
          className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
