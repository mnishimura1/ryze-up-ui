import React, { useEffect, useState } from 'react';

export const RyOfflineBanner: React.FC = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-danger/90 text-white p-3 text-center text-sm font-semibold">
      📡 Offline Mode: Using cached data. Reconnecting...
      <button
        onClick={() => window.location.reload()}
        className="ml-3 underline hover:opacity-80"
      >
        Retry
      </button>
    </div>
  );
};

export default RyOfflineBanner;
