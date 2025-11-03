import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';

interface Action {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'trade' | 'research' | 'portfolio' | 'control';
  confidence: number;
}

export const RyActionPalette: React.FC = () => {
  const { ai, safety } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get real actions from AI suggestions in store
  const actions: Action[] = (ai.suggestions || []).map((sugg: any, idx: number) => ({
    id: `action-${idx}`,
    name: typeof sugg === 'string' ? sugg : (sugg.text || sugg),
    description: `AI-suggested action`,
    icon: '🤖',
    category: 'trade',
    confidence: typeof sugg === 'object' ? (sugg.confidence || 0.8) : 0.8,
  }));

  if (actions.length === 0) {
    return null;
  }

  const filtered = actions.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectAction(filtered[selectedIdx]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handleSelectAction = (action: Action) => {
    if (!safety.deploy && action.category === 'trade') {
      return;
    }
    console.log(`Executing: ${action.name}`);
    setOpen(false);
    setSearch('');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      trade: 'text-success',
      research: 'text-warn',
      portfolio: 'text-info',
      control: 'text-danger',
    };
    return colors[category as keyof typeof colors] || 'text-dark-text/70';
  };

  return (
    <>
      {/* Trigger Button (Cmd+K) */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-lg bg-accent text-dark-bg font-semibold text-sm hover:bg-accent/90 transition shadow-lg"
        >
          ⌘K Action Palette
        </button>
      </div>

      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Palette */}
      {open && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 z-50 rounded-lg shadow-2xl overflow-hidden bg-dark-panel border border-dark-border">
          {/* Search Input */}
          <div className="p-4 border-b border-dark-border">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type action name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-sm outline-none focus:border-accent"
            />
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((action, idx) => {
                const isDisabled = !safety.deploy && action.category === 'trade';
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelectAction(action)}
                    disabled={isDisabled}
                    className={`w-full px-4 py-3 text-left border-b border-dark-border/50 transition ${
                      idx === selectedIdx && !isDisabled
                        ? 'bg-accent/20 border-accent'
                        : isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-dark-bg'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{action.icon}</span>
                          <span className="font-semibold text-dark-text">{action.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(action.category)}`}>
                            {action.category}
                          </span>
                        </div>
                        <p className="text-xs text-dark-text/70">{action.description}</p>
                      </div>
                      <div className="ml-3">
                        <span className="text-xs font-bold text-accent">
                          {(action.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-dark-text/70 text-sm">
                No actions match "{search}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-dark-border bg-dark-bg text-xs text-dark-text/70 space-y-1">
            <div className="flex justify-between">
              <span>↑↓ Navigate</span>
              <span>⏎ Execute</span>
              <span>ESC Close</span>
            </div>
            {!safety.deploy && (
              <div className="text-warn pt-2 border-t border-dark-border/50">
                ⚠️ Trade actions disabled (Sandbox Mode)
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
