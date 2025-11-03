# RYZE-UP UI Implementation Checklist
**Status**: 41% Complete (51/125 files)
**Generated**: 2025-11-03
**Target**: 100% complete for production

---

## ✅ DONE - Don't Touch These

### Pages (9/9 - 100%)
- [x] Markets.tsx - Real CoinGecko data, responsive grid
- [x] Perpetuals.tsx - Greeks, funding, risk
- [x] Portfolio.tsx - Balances, positions, history
- [x] Vaults.tsx - Strategies, APR, health
- [x] OrderFlow.tsx - Heatmap canvas, latency, imbalance
- [x] Trade.tsx - Order form (stub, execution missing)
- [x] Swap.tsx - Swap form (stub, routing missing)
- [x] Q.tsx - Agent console, voice modal, gaze overlay
- [x] Verify.tsx - KYC flow with proofs

### Core Infrastructure (5/6)
- [x] package.json - npm deps, scripts, build config
- [x] vite.config.ts - Vite plugins, API routing, env vars
- [x] tsconfig.json - TypeScript strict mode
- [x] postcss.config.js - Tailwind, RTL, contrast
- [x] tailwind.config.js - Design tokens, breakpoints
- [ ] lighthouse-budget.json - **MISSING**: TTI/JS/CSS budgets

### PWA & Entry (7/8)
- [x] index.html - PWA meta, viewport, theme color
- [x] public/sw.js - Service Worker (cache, fetch, sync, push)
- [x] public/manifest.json - App name, icons, display mode
- [x] src/main.tsx - ReactDOM render
- [x] src/App.tsx - Tab routing, page switching
- [x] src/types.ts - TypeScript interfaces
- [x] src/lib/store.ts - Zustand slices (all PRD data)
- [ ] src/styles/globals.css - **MISSING**: CSS base
- [ ] src/styles/tokens.css - **MISSING**: CSS vars

### Components Complete (45 components, 100%)
- [x] Markets (4 components)
- [x] Perpetuals (6 components)
- [x] Vaults (9 components)
- [x] OrderFlow (toolbar + ordering)
- [x] Q (3 advanced components)
- [x] Global (7 enhancers)
- [x] Primitives (Card, Modal)

### Authentication & Features (5/11 core hooks)
- [x] useWebAuthn - WebAuthn MFA hook
- [x] useFetch - Data fetching (CoinGecko, DeFiLlama, Binance)
- [x] Components: RyInstallPrompt, RyOfflineBanner, RyAccessibilityEnhancer
- [ ] **MISSING**: useIndexedDB, useBackgroundSync, useWS (3 critical hooks)

---

## ❌ TODO - Build These Next

### TIER 1: CRITICAL (1-2 weeks) - Do These First

#### 1. Core Hooks (3 files) - BLOCKS EVERYTHING ELSE
```typescript
// src/hooks/useIndexedDB.ts (200 lines)
// - IndexedDB store creation
// - CRUD operations for state persistence
// - Offline fallback mechanism
// - Quota management, schema versioning

// src/hooks/useBackgroundSync.ts (250 lines)
// - Queue management for offline actions
// - Retry logic with exponential backoff
// - postMessage to Service Worker
// - Conflict resolution

// src/hooks/useWS.ts (400 lines)
// - WebSocket connection management
// - MsgPack encoding/decoding
// - Topic subscription (markets/books/fills/orders/perps/ssp/portfolio/mesh/flow/ai/slicing/parity/refunds/epl/health/units/vaults/adl/win_rate/session)
// - Reconnection with exponential backoff
// - Fallback to polling
```

#### 2. CSS Token Files (2 files)
```css
/* src/styles/tokens.css */
:root {
  /* Colors */
  --color-primary: #00C8E8;
  --color-success: #10B981;
  --color-danger: #EF4444;
  --color-warn: #F59E0B;

  /* Theme */
  --bg-dark: #0F172A;
  --bg-surface: #1E293B;
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;

  /* Spacing, Shadows, Radius, etc */
}

/* src/styles/globals.css */
* { /* Resets */ }
body { /* Theme application */ }
/* Dark mode, contrast, reduced-motion */
```

#### 3. Trade Tab (6 files) - ORDER EXECUTION
```
src/components/Trade/
├── RyDepthCanvas.tsx (300 lines) - D3 order book depth chart
├── RyTape.tsx (250 lines) - Real-time trades tape/tape chart
├── RyPositions.tsx (200 lines) - Open positions with PnL
├── RyOrders.tsx (200 lines) - Active/filled/cancelled orders
├── RyTicket.tsx (already exists - order form)
└── TradeTab.tsx (400 lines) - Layout: ticket (left) | depth+tape (center) | positions (right) | risk footer
```

#### 4. Swap Tab (4 files) - SWAP AGGREGATION
```
src/components/Swap/
├── RyPairPicker.tsx (200 lines) - Token autocomplete (balances shown)
├── RyRoutePreview.tsx (250 lines) - Route path, hops, gas estimate
├── RyImpactMinReceive.tsx (150 lines) - Slippage/min receive controls
├── RyRouteChips.tsx (100 lines) - Route/DEX badges
```

---

### TIER 2: HIGH (2-3 weeks) - Advanced Features

#### 5. Authentication & Compliance (2 files)
```
src/lib/biometricAuth.ts (300 lines)
- WebAuthn.register() / .auth()
- Base64 encoding/decoding
- Credential storage
- MFA challenge/response

src/lib/taxExport.ts (250 lines)
- 1099-DA CSV generation
- CoinGecko price lookups
- Cost basis calculations
- Export to Blob/CSV
```

#### 6. SSP Tab (20 files) - MASSIVE - Advanced Trading UI
```
src/components/SSP/
├── RyShieldDial.tsx - SVG auto-adjust dial (impact slider)
├── RyPoolList.tsx - Pool selector with TVL/APR
├── RyCircuitBanner.tsx - Circuit breaker toggle
├── RyAggregationViz.tsx - D3 aggregation metrics (window/EWMA)
├── RyComponentBreakdown.tsx - Fee component table
├── RyFeeDistributionPie.tsx - D3 pie chart of fees
├── RyDynamicFeePanel.tsx - Fee slider with live preview
├── RyqBandSelector.tsx - q(B) band selector buttons
├── RyBandCalibrationForm.tsx - Band calibration controls
├── RyImpactFunctionSimulator.tsx - Interactive impact sim
├── RySkewPenaltyVisualizer.tsx - D3 skew/penalty visualization
├── RySuppressionWRRCalc.tsx - Suppression & WRR calculations
├── RySessionKeyDisplay.tsx - Session key management UI
├── RySessionizedWorkflowDiagram.tsx - Flowchart of workflow
├── RyHealthGauges.tsx (move from Vaults - share)
├── RyADLEvents.tsx (move from Vaults - share)
├── RyAssetRiskConfig.tsx (move from Vaults - share)
├── RySolvencyInvariantsDashboard.tsx (move from Vaults - share)
├── RyRiskWeightedMetrics.tsx (move from Vaults - share)
└── SSPSpot.tsx (400 lines) - Full tab layout
```

#### 7. Portfolio Tab (12 files) - PORTFOLIO MANAGEMENT
```
src/components/Portfolio/
├── RyBalances.tsx - Token balances table with icons
├── RyPositions.tsx - Open positions with PnL/Greeks
├── RyHistory.tsx - Transaction history with export
├── RyUnitsDashboard.tsx - Units/gauge emissions/decay sim
├── RyEpochConfigurator.tsx - Epoch configuration form
├── RyDecaySimulator.tsx - Interactive decay simulator
├── RyBatchRefundMetrics.tsx - Refund metrics/tracking
├── RyTaxExportButton.tsx - 1099-DA export button
├── RyRefundClaimer.tsx - Merkle proof refund claimer
├── RyGaugeWeightsEditor.tsx - Gauge weights editor
├── RyTokenRotation.tsx - Token rotation/expiry UI
└── PortfolioTab.tsx - Full tab layout
```

#### 8. Research Tab (12 files) - RESEARCH TOOLS
```
src/components/Research/
├── RyProofTimeline.tsx - Proof verification timeline
├── RySourceBadges.tsx - Data source indicator badges
├── RyVarianceSpark.tsx - Variance sparkline charts
├── RyReceiptExplorer.tsx - Receipt/quote explorer
├── RyWinRateDashboards.tsx - Win rate analytics
├── RyVenueAdapterStatus.tsx - Venue adapter uptime/status
├── RyLeaderboards.tsx - Leaderboards/rankings
├── RyComplianceExport.tsx - PDF compliance report export
├── RyQuoteBundleViewer.tsx - Quote bundle viewer/verification
├── RyVerifiableReceiptVerifier.tsx - Merkle receipt verification
├── RyInstitutionalAuditLogs.tsx - Audit logs table/pagination
└── ResearchTab.tsx - Full tab layout
```

---

### TIER 3: MEDIUM (1-2 weeks) - Enhancement

#### 9. Q Tab Improvements (8 files)
```
src/components/Q/
├── RyAgentConsole.tsx - Improve chat console (context window)
├── RyActionButtons.tsx - Quick action buttons
├── RyOpticalToggle.tsx - Optical flow mode toggle
├── RyGAAIImmersiveOverlay.tsx - GAAI immersive bubbles/adaptive
├── RyLatencyResilienceTester.tsx - Improve (WS drop simulation)
├── RyKeyboardAccessibilityTester.tsx - Improve (keyboard test suite)
└── QTab.tsx - Full tab layout (improve routing)
```

#### 10. Utilities (3 files)
```
src/lib/aggregationViz.ts (300 lines)
- D3 window chart
- EWMA calculation
- Interactive tooltips

src/lib/quoteBundleViewer.ts (200 lines)
- ethers Merkle verification
- Quote bundle parsing
- Tree visualization

src/lib/complianceExport.ts (250 lines)
- PDF generation (jsPDF)
- Audit log formatting
- Institutional headers
```

#### 11. OrderFlow Enhancements (3 files)
```
src/components/OrderFlow/
├── RyHeatCanvas.tsx - Reusable heatmap component
├── RyLatencyStrip.tsx - Latency visualization strip
└── RyImbalanceCard.tsx - Imbalance gauge card
```

---

### TIER 4: LOW (1 week) - Polish

#### 12. Global Enhancements (3 files)
```
src/components/Global/
├── RyChartsZoom.tsx - D3 zoom utilities (wheel, shift-drag, dbl-click)
├── RyDragPanels.tsx - Drag & drop panel resizing
└── RyCIBadges.tsx - CI badges (Lighthouse, axe, lint status)
```

#### 13. Primitives (1 file)
```
src/components/primitives/
└── RyTabs.tsx - Radix tabs wrapper with keyboard nav (1-0 jump)
```

#### 14. Config (1 file)
```
lighthouse-budget.json
{
  "bundles": [{
    "name": "ryze-pro",
    "budget": [
      { "type": "js", "size": "200KB" },
      { "type": "css", "size": "50KB" },
      { "metric": "interactive", "value": 1500 }
    ]
  }]
}
```

---

## How to Execute

### Week 1: TIER 1 (Get to 55%)
```bash
# Monday-Wednesday: Hooks & Styles
touch src/hooks/useIndexedDB.ts
touch src/hooks/useBackgroundSync.ts
touch src/hooks/useWS.ts
touch src/styles/globals.css
touch src/styles/tokens.css

# Thursday-Friday: Trade & Swap
mkdir -p src/components/Trade src/components/Swap
# Create 10 component files

npm run build  # Verify 0 errors
git add . && git commit -m "feat: Add core hooks, styles, Trade/Swap tabs (55%)"
```

### Week 2-3: TIER 2 (Get to 80%)
```bash
# Monday-Tuesday: Auth & Utils
touch src/lib/biometricAuth.ts
touch src/lib/taxExport.ts

# Wednesday: SSP (20 files)
mkdir -p src/components/SSP
# Create 20 component files

# Thursday-Friday: Portfolio (12 files) + Research (12 files)
mkdir -p src/components/Portfolio src/components/Research
# Create 24 component files

npm run build
git commit -m "feat: Add SSP/Portfolio/Research tabs with advanced UI (80%)"
```

### Week 4: TIER 3-4 (Get to 100%)
```bash
# Monday-Tuesday: Q improvements (8 files)
# Wednesday: Utilities (3 files)
# Thursday: OrderFlow enhancements (3 files)
# Friday: Global + Primitives + Config (5 files)

npm run build
npm run test
git commit -m "feat: Complete RYZE-UP v6.1 UI (100% specification)"
```

---

## Verification Checklist

After each tier, verify:
```bash
# Build
npm run build
# Check: 0 TypeScript errors

# Bundle size
npm run build | grep -E "(gzip|assets)"
# Check: Total < 300KB gzip

# Test
npm run test
# Check: All tests pass

# Accessibility
npx lighthouse https://testnet.ryze.pro/
# Check: Accessibility > 90

# Deploy
npm run deploy
# Check: All pages load, no 404s
```

---

## File Creation Template

For each component, follow this template:

```typescript
import React from 'react'

interface Props {
  // Props
}

export const RyComponentName: React.FC<Props> = ({ /* destructure */ }) => {
  // Logic

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
      {/* JSX */}
    </div>
  )
}
```

---

## Success Criteria

✅ **41% → 55%**: TIER 1 complete
- All 9 pages have working tab components
- Core hooks (IndexedDB, BackgroundSync, WebSocket) functional
- Trade & Swap tabs have execution UI
- CSS tokens applied globally

✅ **55% → 80%**: TIER 2 complete
- SSP tab fully functional (advanced risk management)
- Portfolio management complete
- Research tools operational
- 70+ components total

✅ **80% → 100%**: TIER 3-4 complete
- Advanced Q features (voice, gaze, GAAI)
- All D3 visualizations working
- Drag panels, zoom, CI badges
- 125+ components, production-ready

---

## Current Status

```
████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 41%

51 of 125 files implemented
- ✅ 9 pages wired
- ✅ 45 components built
- ❌ 79 files to build (6-8 weeks)

BLOCKERS:
  1. No WebSocket (all data polling)
  2. No order execution (Trade/Swap empty)
  3. No SSP UI (1/21 components)
  4. No Portfolio management (2/14 components)
  5. No Research tools (1/13 components)
```

---

## See Also

- `WHAT_YOU_ARE_MISSING.md` - Visual summary of gaps
- `GAP_ANALYSIS_20251103.md` - Detailed analysis per component
- `src/App.tsx` - All 9 pages wired and routable
- `npm run build` - Verify current state
