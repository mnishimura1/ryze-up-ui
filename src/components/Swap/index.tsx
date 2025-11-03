import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

export default function Swap() {
  const [tokenA, setTokenA] = useState('ETH');
  const [tokenB, setTokenB] = useState('USDC');
  const [amountA, setAmountA] = useState(1);
  const [slippage, setSlippage] = useState(0.5);
  const { portfolio, safety } = useStore();

  const balanceA = portfolio.balances?.find(b => b.symbol === tokenA)?.usdValue || 0;
  const balanceB = portfolio.balances?.find(b => b.symbol === tokenB)?.usdValue || 0;
  const estimatedOutput = amountA * 2500 * (1 - slippage / 100);
  const priceImpact = slippage;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Swap</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pair Picker */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Swap Tokens</h2>

            <div className="mb-4">
              <label className="text-sm text-dark-text/70 mb-2 block">From</label>
              <select value={tokenA} onChange={(e) => setTokenA(e.target.value)} className="w-full px-3 py-2 border border-dark-border rounded">
                <option>ETH</option>
                <option>BTC</option>
                <option>USDC</option>
              </select>
              <div className="text-xs text-dark-text/70 mt-2">Balance: {balanceA.toFixed(4)}</div>
            </div>

            <div className="mb-4">
              <input type="number" value={amountA} onChange={(e) => setAmountA(+e.target.value)} placeholder="Amount" className="w-full px-3 py-2 border border-dark-border rounded" />
            </div>

            <button className="w-full py-2 bg-accent text-dark-bg rounded mb-4">↔ Swap</button>

            <div className="mb-4">
              <label className="text-sm text-dark-text/70 mb-2 block">To</label>
              <select value={tokenB} onChange={(e) => setTokenB(e.target.value)} className="w-full px-3 py-2 border border-dark-border rounded">
                <option>USDC</option>
                <option>ETH</option>
                <option>BTC</option>
              </select>
              <div className="text-xs text-dark-text/70 mt-2">Balance: {balanceB.toFixed(4)}</div>
            </div>
          </div>
        </Card>

        {/* Route & Impact */}
        <div className="space-y-4">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Route Preview</h3>
              <div className="text-sm mb-3">{tokenA} → Uniswap V3 → {tokenB}</div>
              <div className="text-xs text-dark-text/70 mb-3">Gas: ~150,000 units</div>

              <h4 className="text-sm font-semibold mb-3">Price Impact & Slippage</h4>
              <input type="range" min="0" max="5" step="0.1" value={slippage} onChange={(e) => setSlippage(+e.target.value)} className="w-full mb-2" />
              <div className="text-xs">Slippage: {slippage}%</div>
              <div className="text-xs text-dark-text/70 mt-2">Price Impact: {priceImpact}%</div>

              {priceImpact > 5 && <div className="text-xs text-red-400 mt-2">⚠️ High impact (&gt;5%)</div>}

              <div className="mt-4 p-3 bg-dark-bg rounded text-sm">
                <div>Output: ~{estimatedOutput.toFixed(2)} {tokenB}</div>
                <div className="text-xs text-dark-text/70 mt-1">Min Receive: {(estimatedOutput * 0.995).toFixed(2)} {tokenB}</div>
              </div>

              <button className={`w-full py-2 rounded mt-4 text-white font-semibold ${safety.routing ? 'bg-accent' : 'bg-dark-border opacity-50 cursor-not-allowed'}`} disabled={!safety.routing}>
                {safety.routing ? 'Approve & Swap' : 'Routing Disabled'}
              </button>

              {!safety.routing && <div className="text-danger text-center py-1 bg-danger/10 rounded mt-2 text-xs">Routing Disabled (Sandbox Mode)</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
