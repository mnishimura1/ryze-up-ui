import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

interface MFAChallenge {
  type: 'email' | 'authenticator' | 'hardware';
  status: 'pending' | 'verified';
  lastUsed?: number;
}

export const RyLeverToggleAdminPanel: React.FC = () => {
  const { safety } = useStore();
  const [showMFA, setShowMFA] = useState(false);
  const [mfaToken, setMFAToken] = useState('');
  const [selectedLever, setSelectedLever] = useState<'deploy' | 'routing' | 'quoting' | null>(null);
  const [mfaChallenges, setMFAChallenges] = useState<MFAChallenge[]>([
    { type: 'email', status: 'verified', lastUsed: Date.now() - 3600000 },
    { type: 'authenticator', status: 'verified' },
  ]);

  const levers = [
    {
      key: 'deploy',
      name: 'Deploy (Execute Trades)',
      description: 'Allow AI to execute live trading operations',
      enabled: safety.deploy,
      risk: 'high',
    },
    {
      key: 'routing',
      name: 'Routing (Order Routing)',
      description: 'Allow intelligent order routing across venues',
      enabled: safety.routing,
      risk: 'medium',
    },
    {
      key: 'quoting',
      name: 'Quoting (Price Quotes)',
      description: 'Allow automated quote generation and updates',
      enabled: safety.quoting,
      risk: 'low',
    },
  ];

  const handleToggleLever = (lever: typeof levers[0]) => {
    if (!lever.enabled) {
      // Enabling requires MFA
      setSelectedLever(lever.key as any);
      setShowMFA(true);
    } else {
      // Disabling doesn't require MFA
      console.log(`Disabled: ${lever.name}`);
    }
  };

  const handleMFAVerify = () => {
    if (mfaToken.length === 6) {
      console.log(`Verified MFA for ${selectedLever}`);
      setShowMFA(false);
      setMFAToken('');
      setSelectedLever(null);
    }
  };

  const getRiskColor = (risk: string) => {
    return {
      high: 'bg-danger/10 text-danger border-danger/30',
      medium: 'bg-warn/10 text-warn border-warn/30',
      low: 'bg-success/10 text-success border-success/30',
    }[risk];
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-6">Admin: Safety Levers</h3>

        {/* Lever Controls */}
        <div className="space-y-4 mb-6">
          {levers.map((lever) => (
            <div
              key={lever.key}
              className={`p-4 rounded border ${getRiskColor(lever.risk)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{lever.name}</h4>
                  <p className="text-xs opacity-75 mt-1">{lever.description}</p>
                </div>
                <button
                  onClick={() => handleToggleLever(lever)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition ${
                    lever.enabled
                      ? 'bg-success text-dark-bg hover:bg-success/90'
                      : 'bg-dark-border text-dark-text hover:bg-dark-border/80'
                  }`}
                >
                  {lever.enabled ? '🔓 ON' : '🔒 OFF'}
                </button>
              </div>

              {/* Risk Badge */}
              <div className="flex items-center space-x-2 text-xs mt-3">
                <span>Risk Level:</span>
                <span className="font-bold uppercase">{lever.risk}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MFA Challenge Modal */}
        {showMFA && selectedLever && (
          <div className="p-4 bg-dark-bg rounded border border-accent mb-6 space-y-4">
            <h4 className="font-semibold">Multi-Factor Authentication Required</h4>
            <p className="text-sm text-dark-text/70">
              Enabling <strong>{levers.find((l) => l.key === selectedLever)?.name}</strong> requires verification.
            </p>

            {/* MFA Method Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-dark-text/70">Select Verification Method:</label>
              <div className="space-y-2">
                {mfaChallenges.map((challenge) => (
                  <label key={challenge.type} className="flex items-center space-x-2 p-2 rounded hover:bg-dark-border/50 cursor-pointer">
                    <input type="radio" name="mfa-method" defaultChecked={challenge.type === 'email'} className="rounded" />
                    <span className="text-sm">
                      {challenge.type === 'email' && '📧 Email'}
                      {challenge.type === 'authenticator' && '📱 Authenticator App'}
                      {challenge.type === 'hardware' && '🔑 Hardware Key'}
                    </span>
                    {challenge.status === 'verified' && (
                      <span className="text-xs text-success ml-auto">✓ Verified</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Token Input */}
            <div>
              <label className="text-xs font-semibold text-dark-text/70 block mb-2">Enter 6-Digit Code:</label>
              <input
                type="text"
                maxLength={6}
                value={mfaToken}
                onChange={(e) => setMFAToken(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-3 py-2 border border-dark-border rounded text-center text-2xl tracking-widest font-mono outline-none focus:border-accent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleMFAVerify}
                disabled={mfaToken.length !== 6}
                className={`flex-1 px-3 py-2 rounded font-semibold text-sm transition ${
                  mfaToken.length === 6
                    ? 'bg-accent text-dark-bg hover:bg-accent/90'
                    : 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'
                }`}
              >
                Verify & Enable
              </button>
              <button
                onClick={() => {
                  setShowMFA(false);
                  setMFAToken('');
                  setSelectedLever(null);
                }}
                className="flex-1 px-3 py-2 rounded font-semibold text-sm bg-dark-border text-dark-text hover:bg-dark-border/80 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity Log */}
        {(safety as any)?.audit_logs && (safety as any).audit_logs.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Recent Activity</h4>
            <div className="space-y-2 text-xs text-dark-text/70 max-h-32 overflow-y-auto">
              {(safety as any).audit_logs.slice(0, 5).map((log: any, idx: number) => (
                <div key={idx} className="flex justify-between py-1">
                  <span>{log.action}</span>
                  <span className="font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
