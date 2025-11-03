import { create } from 'zustand';
export const useStore = create((set) => ({
    safety: {
        quoting: true,
        matching: true,
        deploy: true,
    },
    perps: {
        metrics: {},
        positions: {},
        pnlHistory: {},
        updatePerpsState: (sym, data) => set((state) => ({
            perps: {
                ...state.perps,
                metrics: {
                    ...state.perps.metrics,
                    [sym]: { ...state.perps.metrics[sym], ...data },
                },
            },
        })),
    },
    markets: {
        cards: {},
        updateMarkets: (cards) => set((state) => ({
            markets: {
                ...state.markets,
                cards,
            },
        })),
    },
    vaults: {
        list: [
            { id: 'strat-1', name: 'ETH Yield Farm', description: 'Auto-compound ETH/USDC LP', apr: 12.5, tvl: 5000000, risk_level: 'low' },
            { id: 'strat-2', name: 'BTC Hedged Vault', description: 'Delta-neutral BTC perp + spot', apr: 8.2, tvl: 3000000, risk_level: 'medium' },
            { id: 'strat-3', name: 'Meme Momentum', description: 'High-vol Base tokens rotation', apr: 45.0, tvl: 1000000, risk_level: 'high' }
        ],
        metrics: {
            'strat-1': { apr_7d: 12.5, apr_30d: 12.3, tvl: 5000000, ts_ns: Date.now() * 1e6, apr_history: [{ period: '7d', apr: 12.5 }, { period: '30d', apr: 12.3 }, { period: '90d', apr: 12.1 }] },
            'strat-2': { apr_7d: 8.2, apr_30d: 8.5, tvl: 3000000, ts_ns: Date.now() * 1e6, apr_history: [{ period: '7d', apr: 8.2 }, { period: '30d', apr: 8.5 }, { period: '90d', apr: 8.0 }] },
            'strat-3': { apr_7d: 45.0, apr_30d: 38.2, tvl: 1000000, ts_ns: Date.now() * 1e6, apr_history: [{ period: '7d', apr: 45.0 }, { period: '30d', apr: 38.2 }, { period: '90d', apr: 32.1 }] }
        },
        updateVaultsMetrics: (id, data) => set((state) => ({
            vaults: {
                ...state.vaults,
                metrics: {
                    ...state.vaults.metrics,
                    [id]: { ...state.vaults.metrics[id], ...data }
                }
            }
        })),
    },
    portfolio: {
        balances: [],
        positions: [],
        history: [],
    },
    units: {
        balance: 50000,
        revenue_share: 487.25,
        tge_rate: 0.15,
        emissions: {
            lp: 5000,
            trader: 3500,
            referral: 1500,
        },
        gauge_weights: {
            lp: 50,
            trader: 35,
            referral: 15,
        },
        decay_timer: 0,
    },
    mesh: {
        consensus: {},
        health: [],
        proofs: [],
        ai_summaries: [],
    },
    flow: {
        heat: {},
        imbalance: { ob_imb: 0, microprice: 0 },
        latency: { p50: 0, p95: 0, p99: 0, loss_bp: 0 },
        queue_depth: 0,
    },
    ai: {
        suggestions: [],
        ctx: 'Initializing',
    },
}));
