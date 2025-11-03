import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Card from '../Card';
export const RyInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
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
        const handler = (e) => {
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
    if (!show)
        return null;
    return (_jsx("div", { className: "fixed bottom-4 left-4 z-50 w-80", children: _jsx(Card, { children: _jsxs("div", { className: "p-4 space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold", children: "Install RYZE-UP" }), _jsx("p", { className: "text-xs text-dark-text/70", children: "Add to home screen for offline access and faster loading" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: handleInstall, className: "flex-1 py-2 bg-accent text-dark-bg rounded text-xs font-semibold hover:bg-accent/90 transition", children: "Install" }), _jsx("button", { onClick: handleDismiss, className: "flex-1 py-2 bg-dark-border/50 text-dark-text/70 rounded text-xs font-semibold hover:bg-dark-border transition", children: "Later" })] })] }) }) }));
};
export default RyInstallPrompt;
