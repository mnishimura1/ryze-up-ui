import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';

// Markets: Poll CoinGecko for Base ecosystem tokens
export const useFetchMarkets = () => {
  const [loading, setLoading] = useState(true);
  const updateMarkets = useStore((s) => s.markets.updateMarkets);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h'
        );
        const data = await response.json();
        const cards = data.map((coin: any) => ({
          sym: `${coin.symbol.toUpperCase()}-USD`,
          price: coin.current_price,
          change: coin.price_change_percentage_1h_in_currency || 0,
          vol: coin.total_volume || 0,
          latency_us: 0,
          venue: 'Base' as const,
        }));
        updateMarkets(
          cards.reduce((acc: any, card: any) => ({ ...acc, [card.sym]: card }), {})
        );
      } catch (error) {
        console.error('Markets fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [updateMarkets]);

  return { loading };
};

// Portfolio: Fetch balances from API or CoinGecko
export const useFetchPortfolio = () => {
  const [loading, setLoading] = useState(true);
  const { portfolio } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Stub wallet balances; in prod: fetch(`/api/portfolio?wallet=${user.wallet}`)
        const balances: Record<string, number> = { USDC: 10000, ETH: 2.5 };
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin&vs_currencies=usd'
        );
        const prices = await response.json();

        const valuedBalances = Object.entries(balances).map(([sym, qty]) => ({
          symbol: sym,
          amount: qty,
          price: prices[sym.toLowerCase()]?.usd || 1,
          usdValue: qty * (prices[sym.toLowerCase()]?.usd || 1),
        }));

        useStore.setState((state) => ({
          portfolio: { ...state.portfolio, balances: valuedBalances, history: [] },
        }));
      } catch (error) {
        console.error('Portfolio fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every 1min
    return () => clearInterval(interval);
  }, []);

  return { loading };
};

// Vaults: Fetch from DeFiLlama for Base vaults
export const useFetchVaults = () => {
  const [loading, setLoading] = useState(true);
  const updateVaultsMetrics = useStore((s) => s.vaults.updateVaultsMetrics);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.llama.fi/vaults?chain=base');
        const data = await response.json();

        if (data.data) {
          data.data.forEach((vault: any) => {
            updateVaultsMetrics(vault.address || `vault-${Math.random()}`, {
              apr_7d: vault.aprWeek || 0,
              apr_30d: vault.aprMonth || 0,
              tvl: vault.tvl || 0,
              ts_ns: Date.now() * 1e6,
              apr_history: [
                { period: '7d', apr: vault.aprWeek || 0 },
                { period: '30d', apr: vault.aprMonth || 0 },
                { period: '90d', apr: vault.apr || 0 },
              ],
            });
          });
        }
      } catch (error) {
        console.error('Vaults fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every 1min
    return () => clearInterval(interval);
  }, [updateVaultsMetrics]);

  return { loading };
};

// Research: Fetch oracle proofs from DIA or fallback to CoinGecko
export const useFetchResearch = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Stub: DIA oracle data
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await response.json();
        const ethPrice = data.ethereum.usd;

        useStore.setState((state) => ({
          mesh: {
            ...state.mesh,
            consensus: {
              'ETH-USD': {
                mid: ethPrice,
                variance: 0.02,
              },
            },
            health: [
              {
                id: 'dia',
                name: 'DIA',
                rtt_us: 5,
                jitter_us: 1,
                status: 'healthy',
              },
            ],
            proofs: [
              {
                sym: 'ETH-USD',
                median: ethPrice,
                q25: ethPrice * 0.999,
                q75: ethPrice * 1.001,
                method: 'SIMD-median',
                window_ms: 250,
                ts_ns: Date.now() * 1e6,
              },
            ],
            ai_summaries: [
              {
                sym: 'ETH-USD',
                summary: 'Low variance from oracle feed.',
              },
            ],
          },
        }));
      } catch (error) {
        console.error('Research fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return { loading };
};

// OrderFlow: Fetch from Bitquery (stub with mock data)
export const useFetchOrderFlow = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Stub: Mock order flow data (Bitquery requires API key)
        const mockTrades = Array.from({ length: 100 }, (_, i) => ({
          side: i % 2 === 0 ? 'BUY' : 'SELL',
        }));

        const imbalance =
          mockTrades.reduce(
            (acc, trade) => acc + (trade.side === 'BUY' ? 1 : -1),
            0
          ) / mockTrades.length;

        useStore.setState((state) => ({
          flow: {
            ...state.flow,
            heat: {
              'ETH-USDC': {
                frame_id: Date.now(),
                w: 50,
                h: 30,
                cells: new Uint16Array(1500),
              },
            },
            imbalance: {
              ob_imb: imbalance,
              microprice: 2500,
            },
            latency: {
              p50: 50,
              p95: 120,
              p99: 200,
              loss_bp: 0.5,
            },
            queue_depth: mockTrades.length,
          },
        }));
      } catch (error) {
        console.error('OrderFlow fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return { loading };
};

// Q-Agent: Fetch suggestions from API
export const useFetchQ = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Stub: Mock suggestions endpoint
        const suggestions = [
          { id: '1', text: 'Buy ETH on weakness', confidence: 0.8 },
          { id: '2', text: 'Rebalance portfolio', confidence: 0.6 },
        ];

        useStore.setState((state) => ({
          ai: {
            ...state.ai,
            suggestions,
            ctx: 'Ready',
          },
        }));
      } catch (error) {
        console.error('Q fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return { loading };
};
