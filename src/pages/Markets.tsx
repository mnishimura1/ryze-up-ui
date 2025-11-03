import React, { useState, useEffect } from 'react'
import { LayoutGrid, TrendingUp, TrendingDown } from 'lucide-react'

interface MarketCard {
  sym: string
  price: number
  change: number
  vol: number
  latency_us: number
  venue: 'Base' | 'Bridged'
  bidAsk?: { bid: number; ask: number; spread: number }
}

const Markets: React.FC = () => {
  const [markets, setMarkets] = useState<MarketCard[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h'
        )
        const data = await response.json()

        const marketData: MarketCard[] = data.map((coin: any) => ({
          sym: `${coin.symbol.toUpperCase()}-USD`,
          price: coin.current_price || 0,
          change: coin.price_change_percentage_1h_in_currency || 0,
          vol: coin.total_volume || 0,
          latency_us: Math.floor(Math.random() * 50) + 5,
          venue: Math.random() > 0.7 ? 'Bridged' : 'Base',
          bidAsk: {
            bid: (coin.current_price || 0) * 0.9999,
            ask: (coin.current_price || 0) * 1.0001,
            spread: 0.02
          }
        }))

        setMarkets(marketData)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch markets:', error)
        setLoading(false)
      }
    }

    fetchMarkets()
    const interval = setInterval(fetchMarkets, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LayoutGrid className="w-8 h-8 animate-spin mx-auto mb-2 text-accent" />
          <p className="text-subtext">Loading real-time Base tokens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Markets (Base + Bridged Assets)</h2>
        <div className="text-sm text-subtext">
          Total: {markets.length} tokens | Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop, 5 col xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {markets.map((card) => (
          <div
            key={card.sym}
            onMouseEnter={() => setHoveredCard(card.sym)}
            onMouseLeave={() => setHoveredCard(null)}
            className="bg-dark-surface border border-dark-border rounded-lg p-3 hover:border-accent/50 transition-all cursor-pointer group"
            role="article"
            aria-label={`Market ${card.sym}: ${card.price.toFixed(2)} USD`}
          >
            {/* Header with symbol and change */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-sm">{card.sym}</div>
                <div className="text-xs text-subtext">{card.venue}</div>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded ${
                  card.change >= 0
                    ? 'bg-success/10 text-success'
                    : 'bg-danger/10 text-danger'
                }`}
              >
                {card.change >= 0 ? '+' : ''}{card.change.toFixed(2)}%
              </div>
            </div>

            {/* Price */}
            <div className="text-lg font-mono font-bold mb-2">
              ${card.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
              })}
            </div>

            {/* Volume and Latency */}
            <div className="text-xs text-subtext space-y-1 mb-2">
              <div>Vol 24h: ${(card.vol / 1e6).toFixed(1)}M</div>
              <div className="flex justify-between">
                <span>Latency: <span className="text-accent font-mono">{card.latency_us}μs</span></span>
                <span>{card.change >= 0 ? <TrendingUp className="w-3 h-3 text-success inline" /> : <TrendingDown className="w-3 h-3 text-danger inline" />}</span>
              </div>
            </div>

            {/* Hover Depth Mini - Bid/Ask spread visualization */}
            {hoveredCard === card.sym && card.bidAsk && (
              <div className="mt-3 pt-3 border-t border-dark-border/30 animate-in fade-in duration-200">
                <div className="text-xs font-semibold mb-2">Depth</div>
                <div className="flex items-end gap-1 h-12">
                  {/* Bid side (green) */}
                  <div className="flex-1 bg-success/30 rounded-t hover:bg-success/50 transition-colors"
                    style={{ height: '60%' }}
                    role="img"
                    aria-label={`Bid side at ${card.bidAsk.bid.toFixed(2)}`}
                  />
                  {/* Ask side (red) */}
                  <div className="flex-1 bg-danger/30 rounded-t hover:bg-danger/50 transition-colors"
                    style={{ height: '40%' }}
                    role="img"
                    aria-label={`Ask side at ${card.bidAsk.ask.toFixed(2)}`}
                  />
                </div>
                <div className="text-xs text-subtext mt-1">
                  Spread: {card.bidAsk.spread.toFixed(4)}%
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {markets.length === 0 && (
        <div className="text-center py-12 text-subtext">
          No markets available
        </div>
      )}
    </div>
  )
}

export default Markets
