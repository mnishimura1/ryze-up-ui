import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { RyStrategyList } from './RyStrategyList';
import { RyAprChart } from './RyAprChart';
import { RyTxPanel } from './RyTxPanel';
import { RyHealthGauges } from './RyHealthGauges';
import { RyADLEvents } from './RyADLEvents';
import { RySolvencyInvariantsDashboard } from './RySolvencyInvariantsDashboard';
import { RyAssetRiskConfig } from './RyAssetRiskConfig';
import { RyRiskWeightedMetrics } from './RyRiskWeightedMetrics';
import { useFetchVaults } from '../../hooks/useFetch';
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';
import { TrendingUp } from 'lucide-react';
export const VaultsTab = () => {
    const { loading } = useFetchVaults();
    const [selectedStrat] = useState('strat-1');
    const { safety, vaults } = useStore();
    if (loading)
        return _jsx("div", { className: "text-center py-4", children: "Loading vaults..." });
    // Mock health metrics
    const healthMetrics = {
        collateral_ratio: 185,
        liquidation_threshold: 75,
        utilization: 65,
        health_score: 92
    };
    // Mock invariants
    const invariants = [
        {
            name: 'Collateral Coverage',
            status: 'passed',
            value: 1.85,
            threshold: 1.5,
            description: 'Total collateral / borrowed amount'
        },
        {
            name: 'Liquidation Buffer',
            status: 'passed',
            value: 110,
            threshold: 20,
            description: 'Distance to liquidation threshold'
        },
        {
            name: 'Reserve Ratio',
            status: 'passed',
            value: 0.42,
            threshold: 0.1,
            description: 'Reserves / total liabilities'
        },
        {
            name: 'Debt Level',
            status: 'warning',
            value: 65,
            threshold: 50,
            description: 'Current debt utilization'
        }
    ];
    // Mock asset risks
    const assetRisks = [
        {
            symbol: 'ETH',
            risk_weight: 0.08,
            max_exposure: 10000000,
            current_exposure: 5200000,
            volatility: 45.2
        },
        {
            symbol: 'USDC',
            risk_weight: 0.01,
            max_exposure: 20000000,
            current_exposure: 8500000,
            volatility: 2.1
        },
        {
            symbol: 'BTC',
            risk_weight: 0.1,
            max_exposure: 5000000,
            current_exposure: 2100000,
            volatility: 52.3
        }
    ];
    // Mock risk metrics
    const riskMetrics = {
        var_95: 3.2,
        cvar_95: 5.1,
        sharpe_ratio: 1.43,
        max_drawdown: 18.5,
        correlation_btc: 0.62,
        beta: 0.95
    };
    return (_jsxs("div", { className: "space-y-4 pb-4", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "space-y-4", children: _jsx(RyStrategyList, {}) }), _jsxs("div", { className: "space-y-4", children: [_jsx(RyAprChart, { strategyId: selectedStrat }), _jsxs(RyCard, { className: "p-4 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { children: "TVL" }), _jsxs("span", { className: "font-mono font-bold text-accent", children: ["$", (vaults.metrics?.[selectedStrat]?.tvl || 0).toLocaleString()] })] }), _jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { children: "APR (7d)" }), _jsxs("span", { className: "font-mono font-bold text-success flex items-center gap-1", children: [_jsx(TrendingUp, { className: "w-3 h-3" }), (vaults.metrics?.[selectedStrat]?.apr_7d || 0).toFixed(2), "%"] })] }), !safety.deploy && (_jsx("div", { className: "text-danger text-center py-1 bg-danger/10 rounded mt-2 text-xs", children: "Sandbox: Claims Disabled" }))] })] }), _jsx("div", { children: _jsx(RyTxPanel, { strategyId: selectedStrat }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(RyHealthGauges, { metrics: healthMetrics }), _jsx(RyRiskWeightedMetrics, { metrics: riskMetrics })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(RySolvencyInvariantsDashboard, { invariants: invariants }), _jsx(RyADLEvents, {})] }), _jsx("div", { className: "space-y-4", children: _jsx(RyAssetRiskConfig, { assets: assetRisks }) })] })] }));
};
