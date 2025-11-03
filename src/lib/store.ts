import { create } from 'zustand';

export type Symbol = string;

export interface SafetyState {
  quoting: boolean;
  matching: boolean;
  deploy?: boolean;
  routing?: boolean;
}

export interface PerpsMetrics {
  index?: number;
  mark?: number;
  funding_apr: number;
  oi: number;
  skew: number;
  next_funding_ts: number;
  ts_ns: number;
}

export interface PerpsPosition {
  size: number;
  entryPx: number;
  lev: number;
}

export interface PerpsState {
  metrics: Record<Symbol, PerpsMetrics>;
  positions: Record<Symbol, PerpsPosition>;
  pnlHistory: Record<Symbol, Array<{ ts: number; pnl: number }>>;
  greeks?: Array<{ symbol: string; delta: number; gamma: number; theta: number; vega: number }>;
  updatePerpsState: (sym: Symbol, data: any) => void;
}

export interface MarketCard {
  sym: Symbol;
  price: number;
  change: number;
  vol: number;
  latency_us: number;
  venue: 'Base' | 'Bridged';
}

export interface MarketsState {
  cards: Record<Symbol, MarketCard>;
  updateMarkets: (cards: Record<Symbol, MarketCard>) => void;
}

export interface StrategyData {
  id: string;
  name: string;
  description: string;
  apr: number;
  tvl: number;
  risk_level: 'low' | 'medium' | 'high';
}

export interface VaultsMetrics {
  apr_7d?: number;
  apr_30d?: number;
  tvl: number;
  ts_ns: number;
  apr_history?: Array<{ period: string; apr: number }>;
}

export interface VaultsState {
  list: StrategyData[];
  metrics: Record<string, VaultsMetrics>;
  updateVaultsMetrics: (id: string, data: any) => void;
}

export interface PortfolioBalance {
  symbol: string;
  amount: number;
  price: number;
  usdValue: number;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  price: number;
  entryPrice: number;
  entryValue: number;
  pnl: number;
  leverage: number;
  openedAt: number;
}

export interface PortfolioTransaction {
  type: 'trade' | 'deposit' | 'withdraw' | 'refund';
  symbol: string;
  amount: number;
  price?: number;
  usdValue?: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface PortfolioState {
  balances: PortfolioBalance[];
  positions: PortfolioPosition[];
  history: PortfolioTransaction[];
}

export interface UnitsState {
  balance: number;
  revenue_share: number;
  tge_rate: number;
  emissions?: {
    lp: number;
    trader: number;
    referral: number;
  };
  gauge_weights?: {
    lp: number;
    trader: number;
    referral: number;
  };
  decay_timer?: number;
}

export interface MeshState {
  consensus: Record<string, { mid: number; variance: number }>;
  health: Array<{ id: string; name: string; rtt_us: number; jitter_us: number; status: string }>;
  proofs: Array<any>;
  ai_summaries: Array<{ sym: string; summary: string }>;
}

export interface FlowState {
  heat: Record<string, { frame_id: number; w: number; h: number; cells: Uint16Array }>;
  imbalance: { ob_imb: number; microprice: number };
  latency: { p50: number; p95: number; p99: number; loss_bp: number };
  queue_depth: number;
}

export interface AIState {
  suggestions: Array<{ id: string; text: string; confidence: number }>;
  ctx: string;
}

export interface Store {
  safety: SafetyState;
  perps: PerpsState;
  markets: MarketsState;
  vaults: VaultsState;
  portfolio: PortfolioState;
  units: UnitsState;
  mesh: MeshState;
  flow: FlowState;
  ai: AIState;
}

export const useStore = create<Store>((set) => ({
  safety: {
    quoting: true,
    matching: true,
    deploy: true,
  },
  perps: {
    metrics: {},
    positions: {},
    pnlHistory: {},
    updatePerpsState: (sym, data) =>
      set((state) => ({
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
    updateMarkets: (cards) =>
      set((state) => ({
        markets: {
          ...state.markets,
          cards,
        },
      })),
  },
  vaults: {
    list: [
      { id: 'strat-1', name: 'ETH Yield Farm', description: 'Auto-compound ETH/USDC LP', apr: 12.5, tvl: 5000000, risk_level: 'low' as const },
      { id: 'strat-2', name: 'BTC Hedged Vault', description: 'Delta-neutral BTC perp + spot', apr: 8.2, tvl: 3000000, risk_level: 'medium' as const },
      { id: 'strat-3', name: 'Meme Momentum', description: 'High-vol Base tokens rotation', apr: 45.0, tvl: 1000000, risk_level: 'high' as const }
    ],
    metrics: {
      'strat-1': { apr_7d: 12.5, apr_30d: 12.3, tvl: 5000000, ts_ns: Date.now() * 1e6, apr_history: [{ period: '7d', apr: 12.5 }, { period: '30d', apr: 12.3 }, { period: '90d', apr: 12.1 }] },
      'strat-2': { apr_7d: 8.2, apr_30d: 8.5, tvl: 3000000, ts_ns: Date.now() * 1e6, apr_history: [{ period: '7d', apr: 8.2 }, { period: '30d', apr: 8.5 }, { period: '90d', apr: 8.0 }] },
      'strat-3': { apr_7d: 45.0, apr_30d: 38.2, tvl: 1000000, ts_ns: Date.now() * 1e6, apr_history: [{ period: '7d', apr: 45.0 }, { period: '30d', apr: 38.2 }, { period: '90d', apr: 32.1 }] }
    },
    updateVaultsMetrics: (id, data) =>
      set((state) => ({
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
