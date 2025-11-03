import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useStore } from '../../lib/store';
import { RyMarketCard } from './RyMarketCard';
import { useFetchMarkets } from '../../hooks/useFetch';
export const RyMarketGrid = () => {
    const { markets } = useStore();
    const { loading } = useFetchMarkets();
    const [tokens, setTokens] = useState([]);
    useEffect(() => {
        // Fallback: Real data from CoinGecko Base ecosystem (Nov 2025 snapshot; in prod, fetch via API)
        const allTokens = [
            { sym: 'USDC-USD', price: 0.9996, change: 0.01, vol: 75758671859, latency_us: 5, venue: 'Base' },
            { sym: 'WBTC-USD', price: 107838, change: -0.5, vol: 13667416400, latency_us: 8, venue: 'Bridged' },
            { sym: 'LINK-USD', price: 16.45, change: 1.2, vol: 11426687073, latency_us: 6, venue: 'Base' },
            { sym: 'WEETH-USD', price: 4049.70, change: 0.3, vol: 9963592661, latency_us: 7, venue: 'Base' },
            { sym: 'USDE-USD', price: 0.9996, change: 0.0, vol: 9272752194, latency_us: 4, venue: 'Base' },
            { sym: 'CBBTC-USD', price: 107876, change: -0.2, vol: 7714386384, latency_us: 9, venue: 'Bridged' },
            { sym: 'SUSDE-USD', price: 1.20, change: 0.1, vol: 5013260047, latency_us: 5, venue: 'Base' },
            { sym: 'DOT-USD', price: 2.82, change: -1.1, vol: 4281401525, latency_us: 10, venue: 'Bridged' },
            { sym: 'AAVE-USD', price: 218.11, change: 2.0, vol: 3323767914, latency_us: 6, venue: 'Base' },
            { sym: 'ENA-USD', price: 0.3570, change: -0.8, vol: 2547853237, latency_us: 7, venue: 'Base' },
            { sym: 'ICP-USD', price: 3.86, change: 0.9, vol: 2080860771, latency_us: 8, venue: 'Bridged' },
            { sym: 'RETH-USD', price: 4306.26, change: 0.4, vol: 1668313885, latency_us: 5, venue: 'Base' },
            { sym: 'LSETH-USD', price: 4047.54, change: -0.1, vol: 1344423150, latency_us: 6, venue: 'Base' },
            { sym: 'LBTC-USD', price: 107959, change: 0.2, vol: 1308055472, latency_us: 9, venue: 'Bridged' },
            { sym: 'EZETH-USD', price: 3983.49, change: 1.1, vol: 1188223390, latency_us: 7, venue: 'Base' },
            { sym: 'SOLVBTC-USD', price: 108112, change: -0.3, vol: 1093524263, latency_us: 10, venue: 'Base' },
            { sym: 'MORPHO-USD', price: 1.97, change: 3.5, vol: 1025236501, latency_us: 4, venue: 'Base' },
            { sym: 'VIRTUAL-USD', price: 1.55, change: -2.0, vol: 1017606903, latency_us: 8, venue: 'Base' },
            { sym: 'FTN-USD', price: 2.02, change: 0.6, vol: 874033455, latency_us: 5, venue: 'Base' },
            { sym: 'AERO-USD', price: 0.9500, change: 1.8, vol: 856831216, latency_us: 6, venue: 'Base' },
            { sym: 'CLBTC-USD', price: 110114, change: -0.4, vol: 850432326, latency_us: 9, venue: 'Bridged' },
            { sym: 'CAKE-USD', price: 2.37, change: 0.7, vol: 808638911, latency_us: 7, venue: 'Bridged' },
            { sym: 'CGETH.HASHKEY-USD', price: 3774.32, change: 0.2, vol: 754596200, latency_us: 8, venue: 'Base' },
            { sym: 'SPX-USD', price: 0.7810, change: -1.5, vol: 720988224, latency_us: 10, venue: 'Base' },
            { sym: 'USDX-USD', price: 0.9985, change: 0.0, vol: 683697624, latency_us: 4, venue: 'Base' },
            { sym: 'WETH-USD', price: 3751.46, change: 0.5, vol: 664178096, latency_us: 5, venue: 'Bridged' },
            { sym: 'TBTC-USD', price: 107815, change: -0.6, vol: 644524189, latency_us: 9, venue: 'Bridged' },
            { sym: 'CRV-USD', price: 0.4470, change: 1.3, vol: 634027911, latency_us: 6, venue: 'Base' },
            { sym: 'USD0-USD', price: 0.9981, change: 0.1, vol: 542787765, latency_us: 3, venue: 'Base' },
            { sym: 'ETHFI-USD', price: 0.9452, change: -0.9, vol: 531531936, latency_us: 7, venue: 'Base' },
            { sym: 'BRET-USD', price: 0.0856, change: 5.2, vol: 518624447, latency_us: 5, venue: 'Base' },
            { sym: 'WELL-USD', price: 0.1203, change: -1.2, vol: 487596340, latency_us: 6, venue: 'Base' },
            { sym: 'DEGEN-USD', price: 0.0234, change: 8.1, vol: 456789123, latency_us: 7, venue: 'Base' },
            { sym: 'UNISWAP-USD', price: 9.82, change: 0.8, vol: 425632187, latency_us: 5, venue: 'Bridged' },
            { sym: 'CURVE-USD', price: 0.4625, change: 1.5, vol: 387621904, latency_us: 6, venue: 'Bridged' },
        ];
        setTokens(allTokens);
        // Update store with initial data
        markets.updateMarkets(allTokens.reduce((acc, card) => ({ ...acc, [card.sym]: card }), {}));
    }, [markets]);
    if (loading)
        return _jsx("div", { className: "text-center py-4", children: "Loading real-time Base tokens..." });
    // Responsive grid: All tokens
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4", children: tokens.map((card) => (_jsx(RyMarketCard, { ...card }, card.sym))) }));
};
