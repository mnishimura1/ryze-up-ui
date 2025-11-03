# Ryze Pro UI - Fresh Build

A completely rebuilt, clean, maintainable trading UI for the Ryze Pro platform. Built with React 18, Vite 5, TypeScript, and Tailwind CSS.

## ✨ Features

- **8 Full-Featured Pages**: Markets, Trade, Swap, Perpetuals, Portfolio, OrderFlow, Verify, Admin
- **Dark Theme**: Professional dark UI with consistent color scheme
- **Real-time Integration**: WebSocket support for live price feeds
- **API-Driven**: Centralized API client with automatic fallback to mock data
- **Responsive Design**: Works seamlessly on desktop and tablet
- **Admin CSS Editor**: Real-time CSS editing and deployment interface
- **Production-Ready**: TypeScript strict mode, zero warnings, optimized bundle

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Development (hot reload on http://localhost:5173)
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm typecheck
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx        # Top navigation bar
│   ├── Sidebar.tsx       # Left navigation sidebar
│   └── Card.tsx          # Reusable card component
├── pages/
│   ├── Markets.tsx       # Market data display
│   ├── Trade.tsx         # Order entry & positions
│   ├── Swap.tsx          # Token swap interface
│   ├── Perpetuals.tsx    # Perpetual futures
│   ├── Portfolio.tsx     # Holdings & balance
│   ├── OrderFlow.tsx     # Trade history & activity
│   ├── Verify.tsx        # KYC & audit logs
│   └── Admin.tsx         # Admin controls & CSS editor
├── lib/
│   └── api.ts            # Centralized API client
├── App.tsx               # Main application shell
├── main.tsx              # React entry point
├── index.css             # Global styles
└── vite-env.d.ts         # Vite environment types
```

## 🎨 Theming

The UI uses a dark theme defined in `tailwind.config.js`:

- **Background**: `#0a0e27` (dark-bg)
- **Surface**: `#111428` (dark-surface)
- **Border**: `#1e223c` (dark-border)
- **Accent**: `#22d3ee` (cyan)
- **Text**: `#f0f4f8` (dark-text)

All colors are available as Tailwind utilities: `bg-dark-bg`, `bg-dark-surface`, `border-dark-border`, `bg-accent`, `text-dark-text`

## 🔌 API Integration

### API Client (`src/lib/api.ts`)

```typescript
import { api } from '@/lib/api'

// GET request
const markets = await api.get<Market[]>('/v1/markets')

// POST request
const order = await api.post<Order>('/v1/orders', {
  symbol: 'ETH/USDC',
  side: 'buy',
  quantity: 1.0,
  type: 'market'
})

// WebSocket connection
api.connectWS((event) => {
  const data = JSON.parse(event.data)
  console.log('Live update:', data)
})
```

### Environment Variables

Create a `.env.local` file to override API endpoints:

```env
VITE_API_BASE=https://api.ryze.pro
VITE_WS_URL=wss://api.ryze.pro/ws
```

Default fallback: `https://api.ryze.pro` for API, `wss://api.ryze.pro/ws` for WebSocket

### Mock Data Fallback

If the API returns an error, the app automatically falls back to mock data for development. This allows development without a running backend.

## 📊 Pages Overview

### Markets
- Real-time market data display
- Grid of available trading pairs
- Price, 24h change, and volume information
- Live price updates via WebSocket

### Trade
- Order entry form (Buy/Sell, Market/Limit, Size)
- Open positions display
- Order submission and management

### Swap
- Token swap interface
- From/To token selection
- Swap amount calculation
- Instant execution

### Perpetuals
- Perpetual futures positions
- Entry price, current price, PnL tracking
- Open orders management

### Portfolio
- Total balance and performance metrics
- Holdings table with allocation breakdown
- 24h return tracking

### OrderFlow
- Recent trades list with status tracking
- Activity feed (orders, fills, cancellations)
- Trade history with timestamps

### Verify
- KYC verification status and level
- Identity verification checklist
- Trading limits based on verification level
- Audit log with login history

### Admin
- Real-time CSS editor for UI customization
- Publish and revert CSS changes
- System information and status
- Quick admin actions

## 🛠️ Development

### Adding a New Page

1. Create `src/pages/MyPage.tsx`:
```typescript
import Card from '../components/Card'

export default function MyPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Page</h1>
      <Card>
        {/* Content */}
      </Card>
    </div>
  )
}
```

2. Update `src/App.tsx`:
```typescript
import MyPage from './pages/MyPage'

export type PageType = '...' | 'mypage'

const navItems: NavItem[] = [
  // ...
  { id: 'mypage', label: 'My Page', icon: <Icon className="w-4 h-4" /> },
]

// In renderPage():
case 'mypage':
  return <MyPage />
```

### Styling with Tailwind

Use Tailwind utility classes directly in components. No CSS files needed:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
  <Card>
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Title</h2>
      <p className="text-dark-text/70 text-sm">Description</p>
    </div>
  </Card>
</div>
```

### API Integration in Pages

```typescript
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function MyPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await api.get('/v1/endpoint')
        setData(result)
      } catch (err) {
        setError(err.message)
        // Fallback to mock data
        setData(getMockData())
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error && !data) return <div>Error: {error}</div>

  return <div>{/* Render data */}</div>
}
```

## 📦 Build Output

Production build creates optimized assets:

```
dist/
├── index.html              # 0.44 kB (gzipped: 0.29 kB)
└── assets/
    ├── index-*.css         # 11.72 kB (gzipped: 2.95 kB)
    └── index-*.js          # 170.71 kB (gzipped: 51.89 kB)
```

Total bundle size: ~183 kB (gzipped: ~55 kB)

## ✅ Quality Gates

- **TypeScript**: Strict mode, zero errors
- **Build**: Vite production build with optimizations
- **Bundle**: Tree-shaking and code splitting enabled
- **Performance**: Responsive, <100ms page transitions

## 🔐 Environment Setup

No secrets are stored in the codebase. All API keys and credentials should be set via environment variables:

```bash
# .env.local (never commit this file)
VITE_API_BASE=https://your-api.com
VITE_WS_URL=wss://your-api.com/ws
```

## 📝 Version Info

- **Version**: 1.0.0
- **Built**: 2025-10-30
- **Tech Stack**: React 18.3.1, Vite 5.4.21, TypeScript 5.9.3, Tailwind 3.4.18
- **Node**: 20+
- **pnpm**: 9.7.0

## 🚀 Deployment

The application is ready for production deployment:

```bash
# Build production bundle
pnpm build

# Deploy the `dist/` folder to your hosting (Netlify, Vercel, S3, etc.)
```

## 📄 License

Part of Ryze Pro Enterprise Trading Platform
