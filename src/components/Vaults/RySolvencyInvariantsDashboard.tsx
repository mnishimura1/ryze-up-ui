import React from 'react'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface Invariant {
  name: string
  status: 'passed' | 'warning' | 'failed'
  value: number
  threshold: number
  description: string
}

export const RySolvencyInvariantsDashboard: React.FC<{ invariants: Invariant[] }> = ({ invariants }) => {
  const getStatusIcon = (status: string) => {
    if (status === 'passed') return <CheckCircle className="w-4 h-4 text-success" />
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-warn" />
    return <XCircle className="w-4 h-4 text-danger" />
  }

  const getStatusColor = (status: string) => {
    if (status === 'passed') return 'bg-success/10 border-success/30 text-success'
    if (status === 'warning') return 'bg-warn/10 border-warn/30 text-warn'
    return 'bg-danger/10 border-danger/30 text-danger'
  }

  const passCount = invariants.filter((i) => i.status === 'passed').length
  const passPercentage = ((passCount / invariants.length) * 100).toFixed(0)

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">Solvency Invariants</h4>
        <div className="text-sm font-mono text-accent">
          {passCount}/{invariants.length} ({passPercentage}%)
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-success to-warn transition-all"
          style={{ width: `${passPercentage}%` }}
        />
      </div>

      {/* Invariants list */}
      <div className="space-y-2">
        {invariants.map((inv, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-2 text-xs ${getStatusColor(inv.status)} flex items-start justify-between`}
          >
            <div className="flex items-start gap-2 flex-1">
              <div className="mt-0.5">{getStatusIcon(inv.status)}</div>
              <div>
                <div className="font-semibold">{inv.name}</div>
                <div className="text-xs opacity-75">{inv.description}</div>
              </div>
            </div>
            <div className="text-right ml-2">
              <div className="font-mono font-bold">{inv.value.toFixed(2)}</div>
              <div className="text-xs opacity-75">/ {inv.threshold.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
