import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { api } from '../lib/api';
import { useFetchResearch } from '../hooks/useFetch';
import { useStore } from '../lib/store';
export default function Verify() {
    const { loading: oracleLoading } = useFetchResearch();
    const { mesh } = useStore();
    const [verificationData, setVerificationData] = useState(null);
    const [auditLog, setAuditLog] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [data, audit] = await Promise.all([
                    api.get('/v1/verification'),
                    api.get('/v1/audit-log'),
                ]);
                setVerificationData(data);
                setAuditLog(audit);
            }
            catch (err) {
                console.error('Failed to fetch verification data:', err);
                // Fallback mock data
                setVerificationData({
                    kyc_status: 'approved',
                    kyc_level: 'level_3',
                    verified_email: true,
                    verified_phone: true,
                    verified_identity: true,
                    daily_limit: 100000,
                    monthly_limit: 500000,
                    last_kyc_update: new Date(Date.now() - 2592000000).toISOString(),
                });
                setAuditLog([
                    {
                        timestamp: new Date(Date.now() - 86400000).toISOString(),
                        action: 'login',
                        description: 'User logged in',
                        ip_address: '192.168.1.1',
                    },
                    {
                        timestamp: new Date(Date.now() - 172800000).toISOString(),
                        action: 'trade',
                        description: 'Executed trade BTC/USDC',
                        ip_address: '192.168.1.1',
                    },
                    {
                        timestamp: new Date(Date.now() - 259200000).toISOString(),
                        action: 'kyc_approved',
                        description: 'KYC verification approved (Level 3)',
                        ip_address: '192.168.1.1',
                    },
                ]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const getKycBadgeColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-400/20 text-green-400';
            case 'pending':
                return 'bg-yellow-400/20 text-yellow-400';
            case 'rejected':
                return 'bg-red-400/20 text-red-400';
            default:
                return 'bg-dark-border text-dark-text';
        }
    };
    const getLevelDescription = (level) => {
        const descriptions = {
            level_0: 'No verification',
            level_1: 'Email verified',
            level_2: 'Identity verified',
            level_3: 'Full KYC approved',
        };
        return descriptions[level] || 'Unknown';
    };
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString();
    };
    if (loading || !verificationData) {
        return (_jsx("div", { className: "p-8", children: _jsx("div", { className: "text-dark-text/70", children: "Loading verification data..." }) }));
    }
    return (_jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Verification & Oracle Proofs" }), mesh.ai_summaries && mesh.ai_summaries.length > 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Oracle Consensus" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: mesh.ai_summaries.map((summary, idx) => (_jsxs("div", { className: "p-3 rounded bg-dark-bg border border-dark-border", children: [_jsx("p", { className: "text-sm font-semibold text-accent", children: summary.sym }), _jsx("p", { className: "text-xs text-dark-text/70 mt-1", children: summary.summary })] }, idx))) })] }) })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "KYC Status" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-dark-text/70 text-sm mb-2", children: "Verification Status" }), _jsx("div", { className: `inline-block px-3 py-1 rounded font-semibold text-sm ${getKycBadgeColor(verificationData.kyc_status)}`, children: verificationData.kyc_status.charAt(0).toUpperCase() +
                                                        verificationData.kyc_status.slice(1) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-dark-text/70 text-sm mb-2", children: "Verification Level" }), _jsx("p", { className: "text-lg font-semibold", children: getLevelDescription(verificationData.kyc_level) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-dark-text/70 text-sm mb-3", children: "Verified Items" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${verificationData.verified_email ? 'bg-green-400' : 'bg-dark-border'}`, children: verificationData.verified_email ? '✓' : '' }), _jsx("span", { className: "text-sm", children: "Email Verified" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${verificationData.verified_phone ? 'bg-green-400' : 'bg-dark-border'}`, children: verificationData.verified_phone ? '✓' : '' }), _jsx("span", { className: "text-sm", children: "Phone Verified" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${verificationData.verified_identity ? 'bg-green-400' : 'bg-dark-border'}`, children: verificationData.verified_identity ? '✓' : '' }), _jsx("span", { className: "text-sm", children: "Identity Verified" })] })] })] })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Trading Limits" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-dark-text/70 text-sm mb-2", children: "Daily Limit" }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", verificationData.daily_limit.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-dark-text/70 text-sm mb-2", children: "Monthly Limit" }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", verificationData.monthly_limit.toLocaleString()] })] }), _jsx("div", { className: "pt-2", children: _jsxs("p", { className: "text-dark-text/70 text-xs", children: ["Last updated:", ' ', new Date(verificationData.last_kyc_update).toLocaleDateString()] }) }), _jsx("button", { className: "w-full bg-accent text-dark-bg font-semibold py-2 rounded hover:bg-accent/90 transition mt-4", children: "Update Verification" })] })] }) })] }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Audit Log" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-dark-border", children: [_jsx("th", { className: "text-left py-2 px-2", children: "Timestamp" }), _jsx("th", { className: "text-left py-2 px-2", children: "Action" }), _jsx("th", { className: "text-left py-2 px-2", children: "Description" }), _jsx("th", { className: "text-left py-2 px-2", children: "IP Address" })] }) }), _jsx("tbody", { children: auditLog.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "py-4 px-2 text-dark-text/70", children: "No audit entries" }) })) : (auditLog.map((entry, idx) => (_jsxs("tr", { className: "border-b border-dark-border hover:bg-dark-bg transition", children: [_jsx("td", { className: "py-3 px-2 font-mono text-xs", children: formatDate(entry.timestamp) }), _jsx("td", { className: "py-3 px-2", children: _jsx("span", { className: "px-2 py-1 bg-dark-bg rounded text-xs font-semibold uppercase", children: entry.action }) }), _jsx("td", { className: "py-3 px-2", children: entry.description }), _jsx("td", { className: "py-3 px-2 font-mono text-xs text-dark-text/70", children: entry.ip_address })] }, idx)))) })] }) })] }) })] }));
}
