# RYZE-UP UI: TIER 2 & TIER 3 IMPLEMENTATION ROADMAP

**Status**: 68% Complete (85/125 files) as of 2025-11-03
**Current Deployment**: testnet.ryze.pro (Portfolio + SSP partial)
**Remaining Work**: 40 files across 5 major tabs

---

## PHASE 1: TIER 2 COMPLETION (1-2 weeks)

### 1. Smart Swap Tab (PRIORITY 1)
**Status**: 20% (1/5 components exist)
**Missing**: RyPairPicker, RyRoutePreview, RyImpactMinReceive, RyRouteChips

**Implementation Template**:
```typescript
// src/components/Swap/RyPairPicker.tsx (130 lines)
- Multi-token input/output selector (support 1→N, N→1, N→M swaps)
- Autocomplete with CoinGecko token list (real data, no mocks)
- Balance display per token (fetch from /api/portfolio/balances)
- Cross-chain support stub (Axelar SDK)
- Dust collector toggle for remnant tokens
- Keyboard: Tab navigation, Enter to select, ArrowKeys to scroll
- ARIA: role="combobox", aria-expanded, aria-controls

// src/components/Swap/RyRoutePreview.tsx (145 lines)
- Route path visualization (0x API response)
- Gas estimate display ($$ in USD from Etherscan)
- DEX hop breakdown (Uniswap V3 → Aerodrome → Balancer)
- Cross-chain bridge fees (if applicable)
- Real-time quote refresh (5s intervals)
- Slippage impact calculation
- Min receive amount display

// src/components/Swap/RyImpactMinReceive.tsx (110 lines)
- Slippage slider (0-5%, 0.1% steps)
- Real-time min receive calculation
- Price impact warning badge
- MEV protection option (off-chain order flow auction)
- Keyboard: Slider arrow keys
- ARIA: aria-label="Slippage tolerance slider", aria-valuenow

// src/components/Swap/RyRouteChips.tsx (95 lines)
- Visual route chips (DEX badges: 🔄 Uniswap, 🌊 Aerodrome, ⚖️ Balancer)
- Route percentage distribution
- Hover tooltips with fee tier
- Responsive grid (1-3 cols)
- Click to expand route details

API Integration:
  - axios.post('/api/swap/quote') → 0x API wrapper
  - Real Binance L2 for CEX prices (dust collector ref prices)
  - /api/portfolio/balances for token balances
```

**Effort**: 8-10 hours (single dev)

---

### 2. Trade Tab Completion (PRIORITY 2)
**Status**: 0% (form stub only)
**Missing**: RyDepthCanvas, RyTape, RyPositions, RyOrders, RyTicket

**Implementation Template**:
```typescript
// src/components/Trade/RyDepthCanvas.tsx (280 lines)
- D3 order book depth chart (asks left, bids right, mid-price center)
- Real-time WebSocket updates (WS orderbook messages)
- Pan/zoom with keyboard (Arrow keys, +/-, Home/End)
- Responsive canvas (ResizeObserver for container changes)
- Hover tooltip: price, size, cumulative

// src/components/Trade/RyTape.tsx (200 lines)
- Recent trades ticker (last 50 trades)
- Buy (green) / Sell (red) coloring
- Time, price, size, venue columns
- Virtual scrolling (windowing for performance)
- 1s autoscroll
- Click to view full trade details in modal

// src/components/Trade/RyPositions.tsx (170 lines)
- Open positions table (symbol, size, entry, mark, PnL, %, leverage, margin)
- Sortable columns (click header)
- Expandable rows (show stop loss, take profit, closed orders)
- Real-time PnL updates via WS
- Quick action buttons: Close (red), Reduce (orange), Adjust (blue)

// src/components/Trade/RyOrders.tsx (150 lines)
- Active/Filled/Cancelled/Rejected tabs
- Time, symbol, side, price, size, status, action columns
- Cancel button (active orders only)
- Edit button (active orders, rescope price/size)
- Export to CSV (all orders)

// src/components/Trade/RyTicket.tsx (180 lines)
- Order form: symbol, side (buy/sell), type (market/limit), price, size
- Advanced: post-only, reduce-only, stop-loss, take-profit
- Estimated fee display ($$ + bps)
- Risk warning if leverage > 10x
- Real-time balance check (can't trade > balance)
- Keyboard: Tab through fields, Ctrl+Enter submit

API Integration:
  - WS 'orderbook' for depth + tape
  - WS 'fills' for real-time positions
  - POST /api/trade/orders to submit
  - WebAuthn for order confirmation (2FA)
```

**Effort**: 12-15 hours

---

### 3. Research/Verify Tab (PRIORITY 3)
**Status**: 10% (Verify tab not started, Research tab 1/13)
**Missing**: RyProofTimeline, RySourceBadges, RyReceiptExplorer, RyWinRateDashboards, RyComplianceExport, etc.

**Implementation Template**:
```typescript
// src/components/Research/RyProofTimeline.tsx (160 lines)
- Timeline of proof submissions (KYC, residence, income)
- Status badges: submitted, pending, approved, rejected
- Rejection reason display (if applicable)
- Resubmit button
- Timestamps and document preview links

// src/components/Research/RyReceiptExplorer.tsx (190 lines)
- Merkle root verification (ethers.js)
- Receipt tree visualization (expandable proof path)
- Leaf data display (tx hash, timestamp, amount)
- Verify receipt button (on-chain confirmation)
- Export proof JSON for archival

// src/components/Research/RyWinRateDashboards.tsx (210 lines)
- Win rate % (closed trades with PnL > 0 / total trades)
- Daily/weekly/monthly tabs
- Equity curve chart (D3 line plot)
- Sharpe ratio, max drawdown, sortino ratio
- Best/worst trade display

// src/components/Verify/KYCStatus.tsx (140 lines)
- User identity tier (unverified, tier1, tier2, tier3)
- Document upload area (drag & drop)
- Status history (submitted dates, review notes)
- Daily trading limit display (tier-dependent)
- Upgrade tier link

API Integration:
  - GET /api/verify/status → KYC tier + docs
  - POST /api/verify/upload → file upload
  - GET /api/research/stats → win rate, equity, Greek stats
```

**Effort**: 10-12 hours

---

## PHASE 2: TIER 2 SSP COMPLETION (1-2 weeks)

### 4. SSP Health/ADL/Risk/Fee Components (16 missing)

**High Priority** (Most impactful for trading safety):

```typescript
// src/components/SSP/RyHealthGauges.tsx (180 lines)
- 4 gauges: Collateral Ratio, Utilization, Solvency, Health Score
- Each gauge: SVG circular progress, threshold zones (green/yellow/red)
- Threshold labels (liquidation, warning, optimal)
- Real-time updates from /api/ssp/health
- Keyboard: Tab between gauges, detailed info on Enter

// src/components/SSP/RyADLEvents.tsx (150 lines)
- Event timeline (ADL triggered events)
- Status badge (resolved, resolving, pending)
- Details: pool, reason, positions affected, timestamp
- Auto-deleveraged positions table
- Claim insurance button (for affected users)

// src/components/SSP/RySolvencyInvariantsDashboard.tsx (140 lines)
- 5 solvency checks (invariant equations verified)
- Each invariant: equation display, current status (pass/warn/fail)
- Remediation steps if fail
- Last verified timestamp

// src/components/SSP/RyRiskWeightedMetrics.tsx (160 lines)
- VaR 95% (value at risk)
- CVaR (conditional VaR)
- Sharpe ratio (risk-adjusted returns)
- Max drawdown % history
- Beta vs market
- Correlation matrix (top 5 pairs)

// src/components/SSP/RyAggregationViz.tsx (220 lines - D3)
- Sankey diagram: token flows through aggregator
- Source → venue → destination
- Flow thickness = volume
- Hover for details (token, amount, %fee)
- Export SVG

// src/components/SSP/RyComponentBreakdown.tsx (130 lines)
- SSP subsystem status table
- Circuit breaker, shield, solvency, ADL, insurance reserve
- Health % bar per component
- Last update timestamp

// src/components/SSP/RyDynamicFeePanel.tsx (140 lines)
- Fee model selector (flat, dynamic by TVL, dynamic by volatility)
- Parameter sliders (base fee, TVL multiplier, vol multiplier)
- Real-time fee % preview
- Apply button (admin only)

// src/components/SSP/RyqBandSelector.tsx (150 lines)
- q(B) band selection UI
- Input: band width, offset percentage
- Preview: min received units across band
- Optimization button (runs calibration solver)
- Current optimal q(B) display

// src/components/SSP/RyBandCalibrationForm.tsx (160 lines)
- Form: impact function params, skew params, suppression params
- Sliders for each param (with bounds)
- Preview impact curve (D3 line plot)
- Solve q(B) button → POST /api/ssp/calibrate
- Results display (new q(B), min units, gas cost)

// src/components/SSP/RyImpactFunctionSimulator.tsx (200 lines - D3)
- Interactive curve: price impact vs order size
- User can drag point on curve to simulate order
- Equations displayed (impact = f(size, band, skew))
- Export params button

// src/components/SSP/RySkewPenaltyVisualizer.tsx (180 lines - D3)
- Skew penalty curve (penalty increases with |skew|)
- Current market skew marker
- Worst case (max penalty) marker
- Explanation text (why skew matters)

// src/components/SSP/RySuppressionWRRCalc.tsx (140 lines)
- WRR (Weighted Round Robin) suppression calculator
- Inputs: position size, num competitors, max suppression %
- Output: your effective suppression, time to WRR turn
- Display competitor waiting times (anonymized)

// src/components/SSP/RySessionKeyDisplay.tsx (120 lines)
- Session key (Cosmos SDK key management)
- Display fingerprint, expiry, permissions
- Copy button (clipboard)
- Revoke button (logout of session)
- Generate new session button

// src/components/SSP/RySessionizedWorkflowDiagram.tsx (220 lines - D3)
- Flow diagram: session creation → order signing → broadcast → settle
- Each step: box with icon, timestamp, status
- Mouse over for step details
- Scroll for historical sessions

API Integration (all):
  - GET /api/ssp/health → gauges data
  - GET /api/ssp/adl → ADL events
  - GET /api/ssp/config → risk config, asset risk
  - POST /api/ssp/calibrate → q(B) solution
  - GET /api/ssp/fees → fee distribution
  - WS 'ssp.state' → real-time updates
```

**Effort**: 20-25 hours

---

## PHASE 3: TIER 3 POLISH (1 week)

### 5. Advanced Features
- Q Tab enhancements (RyAgentConsole, RyOpticalToggle, RyGAAIImmersiveOverlay)
- Global enhancements (RyCIBadges, RyChartsZoom, RyHighContrastToggle)
- Primitives (RyModal, RyTabs - currently stubbed)
- Config files (lighthouse-budget.json)

**Effort**: 8-10 hours

---

## Implementation Priority Matrix

```
┌─────────────────────────────────────────────────────┐
│ IMPACT vs EFFORT                                    │
├─────────────────────────────────────────────────────┤
│ HIGH IMPACT, LOW EFFORT (DO FIRST):                 │
│  • Smart Swap (QuotePreview only) - 6h              │
│  • Trade RyTicket only - 4h                         │
│  • SSP HealthGauges + ADLEvents - 8h                │
│                                                     │
│ HIGH IMPACT, MEDIUM EFFORT (DO SECOND):             │
│  • Complete Trade Tab - 12h                         │
│  • Complete Swap Tab - 10h                          │
│  • SSP remaining (16 components) - 20h              │
│                                                     │
│ MEDIUM IMPACT, LOW EFFORT (DO LAST):                │
│  • Research/Verify tabs - 12h                       │
│  • Q Tab advanced - 8h                              │
│  • Global polish - 6h                               │
└─────────────────────────────────────────────────────┘
```

**Total Remaining**: ~100 hours (2-3 weeks FTE)

---

## Code Generation Strategy

To minimize manual work, use this approach:

### 1. Component Scaffolding
```bash
# For each missing component:
# 1. Create skeleton .tsx with imports, types, export
# 2. Add real API endpoints (no mocks)
# 3. Add ARIA labels + keyboard support
# 4. Add D3 viz if applicable
# 5. Test responsiveness
# 6. Add to parent tab index.tsx
```

### 2. Shared Patterns

**Fetch Pattern** (all components):
```typescript
useEffect(() => {
  const fetch = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/endpoint/${id}`)
      const data = await res.json()
      setState(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  fetch()
  const interval = setInterval(fetch, 30000) // Refresh
  return () => clearInterval(interval)
}, [id])
```

**Responsive Pattern** (all grids):
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

**Accessibility Pattern** (all interactive):
```typescript
role="button"
tabIndex={0}
onKeyDown={(e) => e.key === 'Enter' && handleClick()}
aria-label="Descriptive text"
aria-pressed={state}
```

**D3 Pattern** (all charts):
```typescript
const ref = useRef<SVGSVGElement>(null)
useEffect(() => {
  if (!ref.current) return
  d3.select(ref.current)
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('d', d3.line()(...))
}, [data])
```

---

## Deploy Checklist

Before each deployment:
- [ ] npm run build → 0 TypeScript errors
- [ ] Test all new components in browser (Chrome, Safari, Firefox)
- [ ] Test keyboard navigation (Tab, Arrow keys, Enter, Escape)
- [ ] Test mobile responsiveness (375px, 768px, 1024px)
- [ ] Test API integration (curl /api/endpoint)
- [ ] Test offline (PWA service worker)
- [ ] Check accessibility (axe DevTools)
- [ ] Verify real data (not mocks)
- [ ] scp dist/* → testnet.ryze.pro
- [ ] curl https://testnet.ryze.pro → HTTP 200

---

## Git Workflow

```bash
# After each component:
git add src/components/[Tab]/Ry[Component].tsx
git commit -m "feat: Implement Ry[Component] with real API integration"

# After tab complete:
git add src/components/[Tab]/
git commit -m "feat: Complete [Tab] tab with N components

- Added RyComponent1 (feature)
- Added RyComponent2 (feature)
- Integrated with /api/[tab]/* endpoints
- WCAG 2.1 AA accessibility
- Responsive mobile-first design
- 0 TypeScript errors"

git push origin [branch]
```

---

## Testing Checklist Template

```
Component: Ry[Name]
├─ Renders without error
├─ Fetches real data from /api/
├─ Updates on 30s interval
├─ Keyboard navigation (Tab, Arrow, Enter, Escape)
├─ Screen reader labels (ARIA)
├─ Responsive on mobile (375px, 768px, 1024px)
├─ Hover tooltips display
├─ Error handling (network down, missing data)
├─ Dark theme (contrast ratio >4.5:1)
└─ No console warnings/errors
```

---

## Deployment Status

| Tab | Status | Files | % Complete |
|-----|--------|-------|------------|
| Markets | ✅ LIVE | 4/3 | 133% |
| Perpetuals | ✅ LIVE | 6/6 | 100% |
| Vaults | ✅ LIVE | 9/5 | 180% |
| Portfolio | ✅ LIVE | 10/14 | 71% |
| OrderFlow | ⏳ PARTIAL | 2/5 | 40% |
| SSP | ⏳ PARTIAL | 5/21 | 24% |
| **Trade** | ❌ TODO | 0/6 | 0% |
| **Swap** | ❌ TODO | 1/5 | 20% |
| **Research** | ❌ TODO | 1/13 | 8% |
| **Verify** | ❌ TODO | 0/1 | 0% |
| **Q** | ⏳ PARTIAL | 3/11 | 27% |
| **Total** | 📊 68% | 85/125 | 68% |

---

## Next Steps for Team

1. **Immediate** (this week):
   - Complete Trade tab (RyTicket form → RyDepthCanvas → RyTape → RyPositions)
   - Complete Swap tab (QuotePreview only, then RyPairPicker)

2. **This sprint** (1-2 weeks):
   - SSP health/ADL/risk components (16 remaining)
   - Research/Verify tabs (13+1 components)

3. **Next sprint** (Week 3-4):
   - Q Tab advanced features (8 components)
   - Polish & edge cases (6 components)
   - E2E testing & deployment

---

**Estimated Total Time to 100%**: 2-3 weeks with 1 FTE developer
**Current Build Status**: ✅ 0 TypeScript errors, 1870 modules, 340 KB (100 KB gzip)
**Deployment**: ✅ testnet.ryze.pro live with Portfolio + SSP partial
