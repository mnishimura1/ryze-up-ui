import React, { useState } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  depth: {
    bids: Array<[number, number]>;
    asks: Array<[number, number]>;
  };
  venues: string[];
  latency: number;
}

interface Props {
  market: MarketData;
}

export const RyMarketCardEnhanced: React.FC<Props> = ({ market }) => {
  const [showDepth, setShowDepth] = useState(false);

  const totalBidVolume = market.depth.bids.reduce((sum, [_, vol]) => sum + vol, 0);
  const totalAskVolume = market.depth.asks.reduce((sum, [_, vol]) => sum + vol, 0);

  const maxVolume = Math.max(totalBidVolume, totalAskVolume, 1);

  return (
    <div
      className="p-4 rounded border border-dark-border bg-dark-panel hover:border-accent transition cursor-pointer"
      onMouseEnter={() => setShowDepth(true)}
      onMouseLeave={() => setShowDepth(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-dark-text">{market.symbol}</div>
          <div className="text-2xl font-bold text-accent">${market.price.toFixed(2)}</div>
        </div>
        <div className={`text-sm font-semibold ${market.change24h > 0 ? 'text-success' : 'text-danger'}`}>
          {market.change24h > 0 ? '+' : ''}{market.change24h.toFixed(2)}%
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-dark-text/70">
        <div>
          <div className="text-dark-text/50">Vol 24h</div>
          <div className="font-mono">${(market.volume24h / 1e6).toFixed(2)}M</div>
        </div>
        <div>
          <div className="text-dark-text/50">Latency</div>
          <div className="font-mono text-success">{market.latency}ms</div>
        </div>
      </div>

      {/* Venue Badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {market.venues.slice(0, 3).map((venue) => (
          <span key={venue} className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent font-semibold">
            {venue}
          </span>
        ))}
        {market.venues.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded bg-dark-border text-dark-text/70 font-semibold">
            +{market.venues.length - 3}
          </span>
        )}
      </div>

      {/* Depth Mini (Hover) */}
      {showDepth && (
        <div className="p-3 bg-dark-bg rounded border border-accent/30 space-y-2 text-xs">
          <div className="font-semibold text-dark-text mb-2">Order Book Depth</div>

          {/* Bids */}
          <div>
            <div className="text-success mb-1">Bids: ${totalBidVolume.toFixed(2)}</div>
            {market.depth.bids.slice(0, 3).map((bid, idx) => (
              <div key={idx} className="flex justify-between text-dark-text/70">
                <span className="font-mono">${bid[0].toFixed(2)}</span>
                <div className="flex-1 mx-2 h-1 bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{ width: `${(bid[1] / maxVolume) * 100}%` }}
                  />
                </div>
                <span className="font-mono w-12 text-right">{bid[1].toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Asks */}
          <div>
            <div className="text-danger mb-1">Asks: ${totalAskVolume.toFixed(2)}</div>
            {market.depth.asks.slice(0, 3).map((ask, idx) => (
              <div key={idx} className="flex justify-between text-dark-text/70">
                <span className="font-mono">${ask[0].toFixed(2)}</span>
                <div className="flex-1 mx-2 h-1 bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-danger"
                    style={{ width: `${(ask[1] / maxVolume) * 100}%` }}
                  />
                </div>
                <span className="font-mono w-12 text-right">{ask[1].toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Spread */}
          <div className="pt-2 border-t border-dark-border flex justify-between">
            <span className="text-dark-text/70">Spread:</span>
            <span className="font-mono font-semibold">
              {((market.depth.asks[0][0] - market.depth.bids[0][0]) / market.price * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
