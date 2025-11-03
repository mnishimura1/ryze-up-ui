import React, { useState, useEffect } from 'react'
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react'

interface ADLEvent {
  id: string
  timestamp: number
  event_type: 'liquidation' | 'partial_liquidation' | 'risk_warning'
  severity: 'low' | 'medium' | 'high'
  symbol: string
  impact: number
  status: 'active' | 'resolved'
}

export const RyADLEvents: React.FC = () => {
  const [events, setEvents] = useState<ADLEvent[]>([
    {
      id: '1',
      timestamp: Date.now() - 300000,
      event_type: 'risk_warning',
      severity: 'medium',
      symbol: 'ETH-USD',
      impact: 0.5,
      status: 'active'
    },
    {
      id: '2',
      timestamp: Date.now() - 600000,
      event_type: 'partial_liquidation',
      severity: 'high',
      symbol: 'BTC-USD',
      impact: 0.8,
      status: 'resolved'
    }
  ])

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'text-danger border-danger/30 bg-danger/5'
    if (severity === 'medium') return 'text-warn border-warn/30 bg-warn/5'
    return 'text-accent border-accent/30 bg-accent/5'
  }

  const getEventIcon = (type: string) => {
    if (type === 'liquidation') return '🔴'
    if (type === 'partial_liquidation') return '🟠'
    return '⚠️'
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-subtext">Recent ADL Events</h4>
      {events.length === 0 ? (
        <div className="text-xs text-subtext text-center py-4">No recent events</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-3 text-xs ${getSeverityColor(event.severity)} ${
                event.status === 'active' ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getEventIcon(event.event_type)}</span>
                  <div>
                    <div className="font-semibold capitalize">{event.event_type.replace('_', ' ')}</div>
                    <div className="text-subtext">{event.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold">{(event.impact * 100).toFixed(1)}%</div>
                  <div className="text-subtext flex items-center justify-end gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(event.timestamp)}
                  </div>
                </div>
              </div>
              {event.status === 'active' && (
                <div className="text-xs bg-current/20 rounded px-2 py-1 inline-block mt-1">
                  Status: {event.status.toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
