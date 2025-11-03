#!/usr/bin/env bash
set -euo pipefail

# ---------- CONFIG ----------
REPO="${REPO:-/Users/mnishimura1/ryze-pro-ui-fresh}"
CLAUDE2_LOCAL_ROOT="${CLAUDE2_LOCAL_ROOT:-$HOME/ClaudeCode2}"
UI_HINTS=("src" ".")
OUT_MD="${OUT_MD:-MISSING_COMPONENTS_CHECKLIST.md}"

# Components inventory
read -r -d '' COMPONENTS <<"EOF"
Trade Tab|RyDepthCanvas
Trade Tab|RyTape
Trade Tab|RyPositions
Trade Tab|RyOrders
Trade Tab|RyTicket
Trade Tab|TradeTab
Smart Swap|RyPairPicker
Smart Swap|RyRoutePreview
Smart Swap|RyImpactMinReceive
Smart Swap|RyRouteChips
Research|RyProofTimeline
Research|RyReceiptExplorer
Research|RyWinRateDashboards
Research|RySourceBadges
Research|RyVarianceSpark
Research|RyComplianceExport
Research|RySharpePanel
Research|RyDrawdownPanel
Research|RyEquityCurve
Research|RySignalAttribution
Research|RyLatencySpreadPlot
Research|RyEdgeHeatmap
Research|RyAlphaDecay
Research|RySlippageStats
Verify|KYCStatus
SSP|RyHealthGauges
SSP|RyADLEvents
SSP|RySolvencyInvariantsDashboard
SSP|RyRiskWeightedMetrics
SSP|RyAggregationViz
SSP|RyComponentBreakdown
SSP|RyDynamicFeePanel
SSP|RyqBandSelector
SSP|RyBandCalibrationForm
SSP|RyImpactFunctionSimulator
SSP|RySkewPenaltyVisualizer
SSP|RySuppressionWRRCalc
SSP|RySessionKeyDisplay
SSP|RySessionizedWorkflowDiagram
Polish|RyAgentConsole
Polish|RyOpticalToggle
Polish|RyGAAIImmersiveOverlay
Polish|RyHighContrastToggle
Config|lighthouse-budget.json
EOF

# ---------- FUNCTIONS ----------
find_ui_root() {
  for d in "${UI_HINTS[@]}"; do
    [ -f "$REPO/$d/package.json" ] 2>/dev/null && { echo "$REPO/$d"; return 0; }
  done
  echo "$REPO"
}

scan_one() {
  local ui="$1" comp="$2"
  # json file case
  if [[ "$comp" == *.json ]]; then
    [ -f "$ui/$comp" ] && return 0
    grep -r --include="*.json" --include="*.ts" --include="*.tsx" "$comp" "$ui" 2>/dev/null >/dev/null && return 0
    return 1
  fi
  # Search for component definition
  find "$ui" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec grep -l "${comp}" {} \; 2>/dev/null >/dev/null && return 0
  return 1
}

emit_checklist() {
  local ui="$1"
  local out="$2"
  echo "# RYZE-UP Missing Components Checklist" > "$out"
  echo "" >> "$out"
  echo "**Repo:** $ui" >> "$out"
  echo "**Generated:** $(date)" >> "$out"
  echo "" >> "$out"
  printf "| Area | Component | Status |\n|---|---|---|\n" >> "$out"
  local miss=0 have=0
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    local area="${line%%|*}"; local comp="${line##*|}"
    if scan_one "$ui" "$comp"; then
      printf "| %s | %s | ✅ |\n" "$area" "$comp" >> "$out"; have=$((have+1))
    else
      printf "| %s | %s | ❌ |\n" "$area" "$comp" >> "$out"; miss=$((miss+1))
    fi
  done <<< "$COMPONENTS"
  local total=$((miss+have))
  local pct=$((have * 100 / total))
  echo "" >> "$out"
  echo "## Summary" >> "$out"
  echo "" >> "$out"
  echo "- **Present:** $have/$total (${pct}%)" >> "$out"
  echo "- **Missing:** $miss/$total ($((100-pct))%)" >> "$out"
  echo "" >> "$out"
  printf "%s\n" "$miss"
}

# ---------- MAIN ----------
[ -d "$REPO" ] || { echo "repo not found: $REPO"; exit 1; }

UI_ROOT="$(find_ui_root)"
echo "Scanning: $UI_ROOT"
emit_checklist "$UI_ROOT" "$OUT_MD"
cat "$OUT_MD"
