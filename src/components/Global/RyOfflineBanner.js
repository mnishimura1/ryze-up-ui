import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export const RyOfflineBanner = () => {
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
    if (!offline)
        return null;
    return (_jsxs("div", { className: "fixed top-0 left-0 right-0 z-50 bg-danger/90 text-white p-3 text-center text-sm font-semibold", children: ["\uD83D\uDCE1 Offline Mode: Using cached data. Reconnecting...", _jsx("button", { onClick: () => window.location.reload(), className: "ml-3 underline hover:opacity-80", children: "Retry" })] }));
};
export default RyOfflineBanner;
