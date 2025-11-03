import React, { useState, useEffect } from 'react';
import Card from '../Card';

interface GazePoint {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
}

export const RyGazeHeatmapOverlay: React.FC = () => {
  const [gazePoints, setGazePoints] = useState<GazePoint[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    if (enabled && permission === 'pending') {
      requestCameraPermission();
    }
  }, [enabled]);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermission('granted');
    } catch (err) {
      setPermission('denied');
      console.error('Camera permission denied:', err);
    }
  };

  const heatmapRadius = 60;

  const getHeatmapColor = (intensity: number) => {
    if (intensity > 0.7) return 'rgba(255, 20, 147, 0.6)'; // hot pink
    if (intensity > 0.4) return 'rgba(255, 165, 0, 0.4)'; // orange
    return 'rgba(0, 212, 255, 0.2)'; // cyan
  };

  return (
    <>
      {/* Gaze Points SVG Overlay */}
      {enabled && permission === 'granted' && (
        <svg
          className="fixed inset-0 w-full h-full z-10 pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        >
          {gazePoints.map((point, idx) => (
            <circle
              key={idx}
              cx={point.x}
              cy={point.y}
              r={heatmapRadius}
              fill={getHeatmapColor(point.intensity)}
              style={{
                filter: `blur(${20 * (1 - point.intensity)}px)`,
                opacity: point.intensity * 0.6,
              }}
            />
          ))}
        </svg>
      )}

      {/* Control Card */}
      <Card>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-semibold">Gaze Heatmap</span>
            </label>
            {enabled && (
              <span className={`text-xs px-2 py-1 rounded font-semibold ${permission === 'granted' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                {permission === 'granted' ? '✓ Active' : '✗ ' + (permission === 'denied' ? 'Denied' : 'Pending')}
              </span>
            )}
          </div>

          {enabled && permission === 'denied' && (
            <div className="text-xs text-danger bg-danger/10 p-2 rounded">
              Camera permission required. Please enable in browser settings.
            </div>
          )}

          {enabled && permission === 'granted' && (
            <div className="text-xs text-dark-text/70 space-y-1">
              <div>Gaze points tracked: {gazePoints.length}</div>
              <div>Heatmap intensity: Warm = focused, Cool = periphery</div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};
