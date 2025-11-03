export type Symbol = string;

export interface Position {
  sym: Symbol;
  size: number;
  entryPx: number;
}

export interface RyMarketCardProps {
  sym: Symbol;
  price: number;
  change: number; // percentage
  vol: number;   // 24h volume
  latency_us: number;
  venue: 'Base' | 'Bridged';
}
