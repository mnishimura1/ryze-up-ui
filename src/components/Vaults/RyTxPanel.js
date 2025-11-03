import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';
export const RyTxPanel = ({ strategyId = 'strat-1' }) => {
    const { safety, vaults } = useStore();
    const deployEnabled = safety.deploy;
    const strategy = vaults.list?.find(s => s.id === strategyId);
    const handleDeposit = () => {
        if (!deployEnabled)
            return console.log('Sandbox: Deposit disabled');
        console.log(`Deposit to ${strategyId}`);
    };
    const handleWithdraw = () => {
        if (!deployEnabled)
            return console.log('Sandbox: Withdraw disabled');
        console.log(`Withdraw from ${strategyId}`);
    };
    const handleClaim = () => {
        if (!deployEnabled)
            return console.log('Sandbox: Claim disabled');
        console.log(`Claim rewards from ${strategyId}`);
    };
    return (_jsxs(RyCard, { className: !deployEnabled ? 'opacity-50 pointer-events-none' : '', children: [_jsx("h4", { className: "font-semibold mb-2", children: "Transactions" }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsx("button", { onClick: handleDeposit, className: "w-full py-2 rounded bg-accent/20 text-accent hover:bg-accent/30 disabled:opacity-50", disabled: !deployEnabled, children: "Deposit" }), _jsx("button", { onClick: handleWithdraw, className: "w-full py-2 rounded bg-warn/20 text-warn hover:bg-warn/30 disabled:opacity-50", disabled: !deployEnabled, children: "Withdraw" }), _jsx("button", { onClick: handleClaim, className: "w-full py-2 rounded bg-success/20 text-success hover:bg-success/30 disabled:opacity-50", disabled: !deployEnabled, children: "Claim Rewards" }), !deployEnabled && (_jsx("div", { className: "text-danger text-xs text-center py-1 bg-danger/10 rounded", children: "Sandbox Mode: Transactions Disabled" }))] })] }));
};
