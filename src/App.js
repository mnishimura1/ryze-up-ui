import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { LayoutGrid, TrendingUp, Repeat2, Zap, Wallet, BarChart3, Activity, Settings, PiggyBank } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Markets from './pages/Markets';
import Trade from './pages/Trade';
import Swap from './pages/Swap';
import Perpetuals from './pages/Perpetuals';
import Portfolio from './pages/Portfolio';
import Vaults from './pages/Vaults';
import OrderFlow from './pages/OrderFlow';
import Verify from './pages/Verify';
import Admin from './pages/Admin';
import RyInstallPrompt from './components/Global/RyInstallPrompt';
import RyOfflineBanner from './components/Global/RyOfflineBanner';
import RyAccessibilityEnhancer from './components/Global/RyAccessibilityEnhancer';
import RyTopBarSearchModal from './components/Global/RyTopBarSearchModal';
import { useIndexedDB } from './components/Global/RyIndexedDBPersistence';
const navItems = [
    { id: 'markets', label: 'Markets', icon: _jsx(LayoutGrid, { className: "w-4 h-4" }) },
    { id: 'trade', label: 'Trade', icon: _jsx(TrendingUp, { className: "w-4 h-4" }) },
    { id: 'swap', label: 'Swap', icon: _jsx(Repeat2, { className: "w-4 h-4" }) },
    { id: 'perpetuals', label: 'Perpetuals', icon: _jsx(Zap, { className: "w-4 h-4" }) },
    { id: 'portfolio', label: 'Portfolio', icon: _jsx(Wallet, { className: "w-4 h-4" }) },
    { id: 'vaults', label: 'Vaults', icon: _jsx(PiggyBank, { className: "w-4 h-4" }) },
    { id: 'orderflow', label: 'OrderFlow', icon: _jsx(Activity, { className: "w-4 h-4" }) },
    { id: 'verify', label: 'Verify', icon: _jsx(BarChart3, { className: "w-4 h-4" }) },
    { id: 'admin', label: 'Admin', icon: _jsx(Settings, { className: "w-4 h-4" }) },
];
export default function App() {
    const [currentPage, setCurrentPage] = useState('markets');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // Initialize PWA features
    useIndexedDB();
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then((registration) => {
                console.log('✓ Service Worker registered', registration);
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker)
                        return;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            console.log('✓ Service Worker update available');
                            // Optionally show "update available" banner
                            window.dispatchEvent(new CustomEvent('sw-update-available'));
                        }
                    });
                });
                // Handle controller change (SW updated)
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('✓ Service Worker controller changed');
                });
            }).catch(err => {
                console.error('Service Worker registration error:', err);
            });
            // Monitor online/offline status
            window.addEventListener('online', () => {
                console.log('✓ Back online');
            });
            window.addEventListener('offline', () => {
                console.log('⚠ Gone offline');
            });
        }
    }, []);
    const renderPage = () => {
        switch (currentPage) {
            case 'markets':
                return _jsx(Markets, {});
            case 'trade':
                return _jsx(Trade, {});
            case 'swap':
                return _jsx(Swap, {});
            case 'perpetuals':
                return _jsx(Perpetuals, {});
            case 'portfolio':
                return _jsx(Portfolio, {});
            case 'vaults':
                return _jsx(Vaults, {});
            case 'orderflow':
                return _jsx(OrderFlow, {});
            case 'verify':
                return _jsx(Verify, {});
            case 'admin':
                return _jsx(Admin, {});
            default:
                return _jsx(Markets, {});
        }
    };
    return (_jsx(RyAccessibilityEnhancer, { children: _jsxs("div", { className: "flex h-screen bg-dark-bg flex-col sm:flex-row", children: [_jsx(RyOfflineBanner, {}), _jsx(RyInstallPrompt, {}), _jsx(RyTopBarSearchModal, {}), _jsx("div", { className: `${sidebarOpen ? 'w-64' : 'w-0'} sm:w-64 transition-all duration-300 overflow-hidden`, children: _jsx(Sidebar, { navItems: navItems, currentPage: currentPage, onPageChange: setCurrentPage, isOpen: sidebarOpen }) }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(Header, { onMenuClick: () => setSidebarOpen(!sidebarOpen) }), _jsx("main", { id: "main-content", className: "flex-1 overflow-auto bg-dark-bg p-2 sm:p-4", role: "main", "aria-label": "Main content", children: renderPage() })] })] }) }));
}
