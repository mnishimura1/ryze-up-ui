import React, { useState } from 'react';
import Card from '../Card';

interface RateLimitBucket {
  name: string;
  used: number;
  limit: number;
  resetIn: number;
}

interface CSPViolation {
  directive: string;
  blockedUrl: string;
  severity: 'warn' | 'error';
  timestamp: number;
}

export const RyCSPRateLimitIndicators: React.FC = () => {
  const [expanded, setExpanded] = useState<'ratelimit' | 'csp' | null>(null);

  // Rate limits and CSP violations would come from real monitoring in production
  // For now, component returns null when no data available
  const rateLimits: RateLimitBucket[] = [];
  const cspViolations: CSPViolation[] = [];

  if (rateLimits.length === 0 && cspViolations.length === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const getRateLimitColor = (used: number, limit: number) => {
    const ratio = used / limit;
    if (ratio > 0.9) return 'text-danger';
    if (ratio > 0.7) return 'text-warn';
    return 'text-success';
  };

  return (
    <div className="fixed top-16 right-4 z-20 space-y-2">
      {/* Rate Limit Indicator */}
      <Card>
        <button
          onClick={() => setExpanded(expanded === 'ratelimit' ? null : 'ratelimit')}
          className="w-full p-3 hover:bg-dark-border/50 transition rounded flex items-center justify-between"
        >
          <div className="flex items-center space-x-2 text-sm">
            <span>📊 Rate Limits</span>
            <div className="flex space-x-1">
              {rateLimits.map((bucket) => {
                const ratio = bucket.used / bucket.limit;
                const color =
                  ratio > 0.9 ? 'bg-danger' : ratio > 0.7 ? 'bg-warn' : 'bg-success';
                return (
                  <div
                    key={bucket.name}
                    className={`w-2 h-2 rounded-full ${color}`}
                  />
                );
              })}
            </div>
          </div>
          <span className="text-xs text-dark-text/50">{expanded === 'ratelimit' ? '▼' : '▶'}</span>
        </button>

        {expanded === 'ratelimit' && (
          <div className="border-t border-dark-border p-3 space-y-2 max-h-48 overflow-y-auto">
            {rateLimits.map((bucket) => {
              const ratio = bucket.used / bucket.limit;
              const color = getRateLimitColor(bucket.used, bucket.limit);
              return (
                <div key={bucket.name} className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-dark-text/70">{bucket.name}</span>
                    <span className={`font-mono font-bold ${color}`}>
                      {bucket.used} / {bucket.limit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${color.replace('text', 'bg')}`}
                      style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-dark-text/50">
                    Resets in {formatTime(bucket.resetIn)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* CSP Violations Indicator */}
      <Card>
        <button
          onClick={() => setExpanded(expanded === 'csp' ? null : 'csp')}
          className="w-full p-3 hover:bg-dark-border/50 transition rounded flex items-center justify-between"
        >
          <div className="flex items-center space-x-2 text-sm">
            <span>🔒 CSP</span>
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-dark-text/70">{cspViolations.length} events</span>
          </div>
          <span className="text-xs text-dark-text/50">{expanded === 'csp' ? '▼' : '▶'}</span>
        </button>

        {expanded === 'csp' && (
          <div className="border-t border-dark-border p-3 space-y-2 max-h-48 overflow-y-auto">
            {cspViolations.length > 0 ? (
              cspViolations.map((violation, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-xs border ${
                    violation.severity === 'error'
                      ? 'border-danger/50 bg-danger/10'
                      : 'border-warn/50 bg-warn/10'
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{violation.directive}</span>
                    <span className={violation.severity === 'error' ? 'text-danger' : 'text-warn'}>
                      {violation.severity === 'error' ? '✕' : '⚠'}
                    </span>
                  </div>
                  <div className="text-dark-text/70 break-all">
                    {violation.blockedUrl}
                  </div>
                  <div className="text-dark-text/50 mt-1">
                    {Math.floor((Date.now() - violation.timestamp) / 60000)} mins ago
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-dark-text/70 py-2">No violations detected</div>
            )}
          </div>
        )}
      </Card>

      {/* Lint & Lighthouse Badges */}
      <Card>
        <div className="p-3 space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <span>✓ Lint</span>
            <span className="px-2 py-0.5 rounded bg-success/20 text-success font-semibold">A</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span>⚡ Lighthouse</span>
            <div className="flex space-x-1">
              <span className="px-1.5 py-0.5 rounded bg-success/20 text-success text-xs font-mono">92</span>
              <span className="px-1.5 py-0.5 rounded bg-success/20 text-success text-xs font-mono">88</span>
              <span className="px-1.5 py-0.5 rounded bg-warn/20 text-warn text-xs font-mono">78</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
