import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
export const RyRefundClaimer = () => {
    // Mock data - in production, fetch from WS or /api/refunds/unclaimed
    const unclaimedRefunds = useMemo(() => [
        {
            id: '1',
            tradeId: '5a9c1e',
            amount: 42.5,
            venue: 'Uniswap V3',
            timestamp: Date.now() - 86400000,
            merkleProof: [
                '0x1234...5678',
                '0xabcd...ef01',
                '0x9876...5432',
            ],
            status: 'unclaimed',
        },
        {
            id: '2',
            tradeId: '3b7f8d',
            amount: 28.75,
            venue: 'Aerodrome',
            timestamp: Date.now() - 172800000,
            merkleProof: [
                '0x2345...6789',
                '0xbcde...f012',
            ],
            status: 'unclaimed',
        },
        {
            id: '3',
            tradeId: '2c6e4a',
            amount: 15.3,
            venue: 'Balancer',
            timestamp: Date.now() - 259200000,
            merkleProof: ['0x3456...789a'],
            status: 'unclaimed',
        },
    ], []);
    const [claimingIds, setClaimingIds] = useState(new Set());
    const [claimedIds, setClaimedIds] = useState(new Set());
    const totalClaimable = useMemo(() => {
        return unclaimedRefunds
            .filter((r) => !claimedIds.has(r.id))
            .reduce((sum, r) => sum + r.amount, 0);
    }, [unclaimedRefunds, claimedIds]);
    const claimRefund = async (refund) => {
        setClaimingIds((prev) => new Set(prev).add(refund.id));
        try {
            // In production, this would:
            // 1. Verify Merkle proof
            // 2. Call smart contract with proof
            // 3. Wait for tx confirmation
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setClaimedIds((prev) => new Set(prev).add(refund.id));
            console.log(`Claimed refund: ${refund.id}`);
        }
        catch (error) {
            console.error('Failed to claim refund:', error);
        }
        finally {
            setClaimingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(refund.id);
                return newSet;
            });
        }
    };
    const unclaimedToDisplay = unclaimedRefunds.filter((r) => !claimedIds.has(r.id));
    return (_jsxs("div", { className: "space-y-4", role: "region", "aria-label": "Unclaimed refunds", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Unclaimed Refunds" }), _jsxs("div", { className: "text-sm text-slate-400", children: [unclaimedToDisplay.length, " pending"] })] }), unclaimedToDisplay.length > 0 && (_jsxs("div", { className: "bg-gradient-to-br from-green-900/30 to-slate-800 rounded-lg p-4 border border-green-700/30", children: [_jsx("p", { className: "text-sm text-green-300 mb-1", children: "Total Claimable" }), _jsxs("p", { className: "text-3xl font-bold text-green-400 font-mono", children: ["$", totalClaimable.toFixed(2)] })] })), _jsx("div", { role: "list", className: "space-y-3", children: unclaimedToDisplay.map((refund) => {
                    const isClaiming = claimingIds.has(refund.id);
                    const daysAgo = Math.floor((Date.now() - refund.timestamp) / (1000 * 60 * 60 * 24));
                    return (_jsxs("div", { role: "listitem", className: "bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-green-500/50 transition-colors", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsxs("span", { className: "font-mono font-semibold text-white", children: ["Trade #", refund.tradeId] }), _jsx("span", { className: "text-xs px-2 py-1 rounded bg-slate-700 text-slate-300", children: refund.venue })] }), _jsxs("p", { className: "text-sm text-slate-400", children: [daysAgo, " day", daysAgo !== 1 ? 's' : '', " ago"] })] }), _jsx("div", { className: "text-right", children: _jsxs("p", { className: "text-lg font-bold text-green-400 font-mono", children: ["+$", refund.amount.toFixed(2)] }) })] }), _jsx("div", { className: "mt-3 pt-3 border-t border-slate-700", children: _jsxs("details", { className: "group", children: [_jsxs("summary", { className: "cursor-pointer text-xs text-slate-400 hover:text-slate-300 transition-colors", children: ["\uD83D\uDCCB Merkle Proof (", refund.merkleProof.length, " hashes)"] }), _jsx("div", { className: "mt-2 space-y-1 pl-3", children: refund.merkleProof.map((hash, idx) => (_jsx("p", { className: "text-xs font-mono text-slate-500 break-all", children: hash }, idx))) })] }) }), _jsx("button", { onClick: () => claimRefund(refund), disabled: isClaiming, className: `w-full mt-4 py-2 px-3 rounded font-semibold transition-colors text-sm ${isClaiming
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'}`, "aria-busy": isClaiming, "aria-label": `Claim $${refund.amount} refund from ${refund.venue}`, children: isClaiming ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "inline-block animate-spin", children: "\u23F3" }), " Claiming..."] })) : (`✅ Claim $${refund.amount.toFixed(2)}`) })] }, refund.id));
                }) }), unclaimedToDisplay.length === 0 && !claimedIds.size && (_jsx("div", { className: "text-center py-8 text-slate-400", children: "No unclaimed refunds" })), claimedIds.size > 0 && (_jsxs("div", { className: "bg-green-900/20 border border-green-700/50 rounded px-4 py-3 text-sm text-green-300", children: ["\u2705 Successfully claimed ", claimedIds.size, " refund", claimedIds.size !== 1 ? 's' : ''] }))] }));
};
