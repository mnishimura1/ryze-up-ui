import React, { useEffect, useState } from 'react';
import Card from '../Card';

export const RyInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let visits = parseInt(localStorage.getItem('pwa-visits') || '0') + 1;
    localStorage.setItem('pwa-visits', visits.toString());

    const sessionStart = parseInt(localStorage.getItem('pwa-session-start') || Date.now().toString());
    const sessionDuration = Date.now() - sessionStart;

    if (visits >= 2 && sessionDuration > 300000) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
        localStorage.setItem('pwa-installed', 'true');
      }
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80">
      <Card>
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-semibold">Install RYZE-UP</h4>
          <p className="text-xs text-dark-text/70">
            Add to home screen for offline access and faster loading
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              className="flex-1 py-2 bg-accent text-dark-bg rounded text-xs font-semibold hover:bg-accent/90 transition"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 py-2 bg-dark-border/50 text-dark-text/70 rounded text-xs font-semibold hover:bg-dark-border transition"
            >
              Later
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RyInstallPrompt;
