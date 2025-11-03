import React, { useState, useEffect } from 'react';
import Card from '../Card';

interface KeyboardEvent {
  key: string;
  timestamp: number;
  target: string;
  isAccessible: boolean;
}

interface AccessibilityScore {
  aria: number;
  contrast: number;
  keyboard: number;
  semantic: number;
  overall: number;
}

export const RyKeyboardAccessibilityTester: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [events, setEvents] = useState<KeyboardEvent[]>([]);

  // Real accessibility scores would come from actual audit in production
  const scores: AccessibilityScore | null = null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const event = {
        key: e.key,
        timestamp: Date.now(),
        target: (e.target as unknown as HTMLElement).tagName,
        isAccessible: ['Enter', 'Space', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key),
      };

      setEvents((prev) => [event as any, ...prev.slice(0, 19)]);
    };

    if (isScanning) {
      window.addEventListener('keydown', handleKeyDown as unknown as EventListener);
    }

    return () => window.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
  }, [isScanning]);

  const runFullScan = () => {
    setIsScanning(true);
    setEvents([]);
    // Actual scan would trigger via API
    setTimeout(() => setIsScanning(false), 2000);
  };

  if (!scores) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-success/20 text-success';
    if (score >= 75) return 'bg-warn/20 text-warn';
    return 'bg-danger/20 text-danger';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'F';
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Keyboard Accessibility Tester</h3>

        {/* Control Button */}
        <button
          onClick={runFullScan}
          disabled={isScanning}
          className={`w-full px-4 py-2 rounded font-semibold text-sm transition mb-6 ${
            isScanning
              ? 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'
              : 'bg-accent text-dark-bg hover:bg-accent/90'
          }`}
        >
          {isScanning ? '⏳ Scanning...' : '🔍 Run Accessibility Audit'}
        </button>

        {/* Placeholder for scores when audit completes */}
        <div className="p-4 bg-dark-bg rounded border border-dark-border/50 text-center text-sm text-dark-text/70 mb-6">
          Run accessibility audit to populate scores
        </div>

        {/* Keyboard Events Log */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">Keyboard Events Log (Live)</h4>
          <div className="max-h-32 overflow-y-auto space-y-1 bg-dark-bg rounded p-3 border border-dark-border/50">
            {events.length > 0 ? (
              events.map((event, idx) => (
                <div
                  key={idx}
                  className={`text-xs font-mono p-1 rounded ${
                    event.isAccessible
                      ? 'bg-success/10 text-success'
                      : 'bg-danger/10 text-danger'
                  }`}
                >
                  <span>{event.key}</span>
                  <span className="text-dark-text/50 ml-2">on {event.target}</span>
                  <span className="text-dark-text/50 float-right">
                    {event.isAccessible ? '✓' : '✗'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-dark-text/70 py-2">
                {isScanning ? 'Listening for keyboard events...' : 'No events yet. Press keys to test.'}
              </div>
            )}
          </div>
        </div>


        {/* Status Footer */}
        <div className="mt-4 pt-4 border-t border-dark-border text-xs text-dark-text/50 text-center">
          {isScanning ? 'Scanning in progress...' : `Last scan: ${new Date().toLocaleTimeString()}`}
        </div>
      </div>
    </Card>
  );
};
