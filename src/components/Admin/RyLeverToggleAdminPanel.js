import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';
export const RyLeverToggleAdminPanel = () => {
    const { safety } = useStore();
    const [showMFA, setShowMFA] = useState(false);
    const [mfaToken, setMFAToken] = useState('');
    const [selectedLever, setSelectedLever] = useState(null);
    const [mfaChallenges, setMFAChallenges] = useState([
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
    const handleToggleLever = (lever) => {
        if (!lever.enabled) {
            // Enabling requires MFA
            setSelectedLever(lever.key);
            setShowMFA(true);
        }
        else {
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
    const getRiskColor = (risk) => {
        return {
            high: 'bg-danger/10 text-danger border-danger/30',
            medium: 'bg-warn/10 text-warn border-warn/30',
            low: 'bg-success/10 text-success border-success/30',
        }[risk];
    };
    return (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-6", children: "Admin: Safety Levers" }), _jsx("div", { className: "space-y-4 mb-6", children: levers.map((lever) => (_jsxs("div", { className: `p-4 rounded border ${getRiskColor(lever.risk)}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold", children: lever.name }), _jsx("p", { className: "text-xs opacity-75 mt-1", children: lever.description })] }), _jsx("button", { onClick: () => handleToggleLever(lever), className: `px-3 py-1 rounded text-sm font-semibold transition ${lever.enabled
                                            ? 'bg-success text-dark-bg hover:bg-success/90'
                                            : 'bg-dark-border text-dark-text hover:bg-dark-border/80'}`, children: lever.enabled ? '🔓 ON' : '🔒 OFF' })] }), _jsxs("div", { className: "flex items-center space-x-2 text-xs mt-3", children: [_jsx("span", { children: "Risk Level:" }), _jsx("span", { className: "font-bold uppercase", children: lever.risk })] })] }, lever.key))) }), showMFA && selectedLever && (_jsxs("div", { className: "p-4 bg-dark-bg rounded border border-accent mb-6 space-y-4", children: [_jsx("h4", { className: "font-semibold", children: "Multi-Factor Authentication Required" }), _jsxs("p", { className: "text-sm text-dark-text/70", children: ["Enabling ", _jsx("strong", { children: levers.find((l) => l.key === selectedLever)?.name }), " requires verification."] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-dark-text/70", children: "Select Verification Method:" }), _jsx("div", { className: "space-y-2", children: mfaChallenges.map((challenge) => (_jsxs("label", { className: "flex items-center space-x-2 p-2 rounded hover:bg-dark-border/50 cursor-pointer", children: [_jsx("input", { type: "radio", name: "mfa-method", defaultChecked: challenge.type === 'email', className: "rounded" }), _jsxs("span", { className: "text-sm", children: [challenge.type === 'email' && '📧 Email', challenge.type === 'authenticator' && '📱 Authenticator App', challenge.type === 'hardware' && '🔑 Hardware Key'] }), challenge.status === 'verified' && (_jsx("span", { className: "text-xs text-success ml-auto", children: "\u2713 Verified" }))] }, challenge.type))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-dark-text/70 block mb-2", children: "Enter 6-Digit Code:" }), _jsx("input", { type: "text", maxLength: 6, value: mfaToken, onChange: (e) => setMFAToken(e.target.value.replace(/\D/g, '')), placeholder: "000000", className: "w-full px-3 py-2 border border-dark-border rounded text-center text-2xl tracking-widest font-mono outline-none focus:border-accent" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: handleMFAVerify, disabled: mfaToken.length !== 6, className: `flex-1 px-3 py-2 rounded font-semibold text-sm transition ${mfaToken.length === 6
                                        ? 'bg-accent text-dark-bg hover:bg-accent/90'
                                        : 'bg-dark-border/50 text-dark-text/70 cursor-not-allowed opacity-50'}`, children: "Verify & Enable" }), _jsx("button", { onClick: () => {
                                        setShowMFA(false);
                                        setMFAToken('');
                                        setSelectedLever(null);
                                    }, className: "flex-1 px-3 py-2 rounded font-semibold text-sm bg-dark-border text-dark-text hover:bg-dark-border/80 transition", children: "Cancel" })] })] })), safety?.audit_logs && safety.audit_logs.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold mb-3", children: "Recent Activity" }), _jsx("div", { className: "space-y-2 text-xs text-dark-text/70 max-h-32 overflow-y-auto", children: safety.audit_logs.slice(0, 5).map((log, idx) => (_jsxs("div", { className: "flex justify-between py-1", children: [_jsx("span", { children: log.action }), _jsx("span", { className: "font-mono", children: log.timestamp })] }, idx))) })] }))] }) }));
};
