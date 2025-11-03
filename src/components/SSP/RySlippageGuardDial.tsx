import React from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

export const RySlippageGuardDial: React.FC = () => {
  const { safety } = useStore();

  // Get real tolerance from store or return null if not available
  const tolerance = (safety as any)?.ssp?.slippage_tolerance || null;

  if (tolerance === null) {
    return null;
  }

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (tolerance / 100) * circumference;

  const getColor = (bps: number) => {
    if (bps <= 25) return '#10b981'; // success - tight
    if (bps <= 50) return '#f59e0b'; // warn - moderate
    if (bps <= 100) return '#ef4444'; // danger - loose
    return '#6b7280'; // gray - too loose
  };

  const getLabel = (bps: number) => {
    if (bps <= 25) return 'Tight';
    if (bps <= 50) return 'Moderate';
    if (bps <= 100) return 'Loose';
    return 'Extreme';
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-6">Slippage Guard</h3>

        {/* SVG Dial */}
        <div className="flex justify-center mb-6">
          <svg width="140" height="140" viewBox="0 0 140 140" className="drop-shadow-lg">
            {/* Background circle */}
            <circle cx="70" cy="70" r="50" fill="none" stroke="var(--dark-border)" strokeWidth="8" opacity="0.3" />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="33%" stopColor="#f59e0b" />
                <stop offset="66%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
            </defs>

            {/* Progress arc */}
            <circle
              cx="70"
              cy="70"
              r="45"
              fill="none"
              stroke="url(#dialGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />

            {/* Center circle */}
            <circle cx="70" cy="70" r="28" fill="var(--dark-bg)" stroke="var(--dark-border)" strokeWidth="1" />

            {/* Needle */}
            <g transform={`rotate(${(tolerance / 100) * 360} 70 70)`}>
              <line x1="70" y1="70" x2="70" y2="28" stroke={getColor(tolerance)} strokeWidth="3" strokeLinecap="round" />
              <circle cx="70" cy="70" r="4" fill={getColor(tolerance)} />
            </g>

            {/* Labels around dial */}
            <text x="70" y="125" textAnchor="middle" fontSize="10" fill="var(--subtext)" opacity="0.6">
              0 bps
            </text>
            <text x="122" y="75" textAnchor="start" fontSize="10" fill="var(--subtext)" opacity="0.6">
              100 bps
            </text>
          </svg>
        </div>

        {/* Value Display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold" style={{ color: getColor(tolerance) }}>
            {tolerance}
          </div>
          <div className="text-sm text-dark-text/70 mt-1">{(tolerance / 100).toFixed(2)}% slippage</div>
          <div className="text-xs font-semibold text-dark-text/70 mt-2">
            {getLabel(tolerance)} Protection
          </div>
        </div>


        {/* Status */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-dark-text/70">Guard Status:</span>
            <span className={safety.quoting ? 'text-success font-semibold' : 'text-danger font-semibold'}>
              {safety.quoting ? '✓ Active' : '✗ Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text/70">Circuit State:</span>
            <span className={safety.matching ? 'text-success' : 'text-warn'}>
              {safety.matching ? 'Normal' : 'Degraded'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
