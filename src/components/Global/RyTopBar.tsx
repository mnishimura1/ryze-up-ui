import React, { useState } from 'react';
import { useStore } from '../../lib/store';

export const RyTopBar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [product, setProduct] = useState('Spot');
  const { markets, safety } = useStore();
  const products = ['Spot', 'Perps', 'SSP', 'Vaults'];
  const tokens = Object.keys(markets.cards || {});

  return (
    <header className="bg-panel border-b border-border p-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold text-accent">RYZE-UP</div>
        <select value={product} onChange={(e) => setProduct(e.target.value)} className="px-2 py-1 rounded bg-subtext/10 text-sm">
          {products.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="relative flex-1 max-w-xs mx-8">
        <button onClick={() => setSearchOpen(!searchOpen)} className="w-full px-3 py-2 rounded bg-subtext/10 text-sm text-left text-subtext">
          ⌘K Search...
        </button>
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-panel border border-border rounded shadow-lg z-50">
            <input autoFocus placeholder="Search symbols..." className="w-full px-3 py-2 border-b border-border outline-none" />
            <div className="max-h-48 overflow-y-auto">
              {tokens.slice(0, 10).map(sym => (
                <div key={sym} className="px-3 py-2 hover:bg-subtext/10 cursor-pointer text-sm flex justify-between">
                  <span>{sym}</span>
                  <span className="text-subtext">${markets.cards[sym]?.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <span className={`flex items-center space-x-1 ${safety.matching ? 'text-success' : 'text-danger'}`}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: safety.matching ? 'var(--success)' : 'var(--danger)' }} />
          <span>{safety.matching ? 'Online' : 'Offline'}</span>
        </span>
        <span>p50: 50μs</span>
        <span>p95: 120μs</span>
        <button className="px-2 py-1 rounded bg-subtext/10">Settings</button>
      </div>
    </header>
  );
};
