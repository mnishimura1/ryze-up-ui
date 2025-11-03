#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-/Users/mnishimura1/ryze-pro-ui-fresh}"
UI_HINTS=("src" ".")

cd "$REPO" 2>/dev/null || { echo "repo not found: $REPO"; exit 1; }

components=(
"Trade Tab|RyDepthCanvas"
"Trade Tab|RyTape"
"Trade Tab|RyPositions"
"Trade Tab|RyOrders"
"Trade Tab|RyTicket"
"Trade Tab|TradeTab"
"Smart Swap|RyPairPicker"
"Smart Swap|RyRoutePreview"
"Smart Swap|RyImpactMinReceive"
"Smart Swap|RyRouteChips"
"Research|RyProofTimeline"
"Research|RyReceiptExplorer"
"Research|RyWinRateDashboards"
"Research|RySourceBadges"
"Research|RyVarianceSpark"
"Research|RyComplianceExport"
"Research|RySharpePanel"
"Research|RyDrawdownPanel"
"Research|RyEquityCurve"
"Research|RySignalAttribution"
"Research|RyLatencySpreadPlot"
"Research|RyEdgeHeatmap"
"Research|RyAlphaDecay"
"Research|RySlippageStats"
"Verify|KYCStatus"
"SSP|RyHealthGauges"
"SSP|RyADLEvents"
"SSP|RySolvencyInvariantsDashboard"
"SSP|RyRiskWeightedMetrics"
"SSP|RyAggregationViz"
"SSP|RyComponentBreakdown"
"SSP|RyDynamicFeePanel"
"SSP|RyqBandSelector"
"SSP|RyBandCalibrationForm"
"SSP|RyImpactFunctionSimulator"
"SSP|RySkewPenaltyVisualizer"
"SSP|RySuppressionWRRCalc"
"SSP|RySessionKeyDisplay"
"SSP|RySessionizedWorkflowDiagram"
"Polish|RyAgentConsole"
"Polish|RyOpticalToggle"
"Polish|RyGAAIImmersiveOverlay"
"Polish|RyHighContrastToggle"
"Config|lighthouse-budget.json"
)

find_ui_root() {
  for d in "${UI_HINTS[@]}"; do
    [ -e "$d/package.json" ] 2>/dev/null && { echo "$d"; return; }
  done
  echo "."
}
UI_ROOT="$(find_ui_root)"

scan_one() {
  local token="$1"
  local name="$2"
  if [[ "$name" == *.json ]]; then
    grep -r --ignore-case "$name" "$UI_ROOT" 2>/dev/null >/dev/null && return 0
    [ -f "$UI_ROOT/$name" ] && return 0
    return 1
  fi
  grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "export.*$name\|const.*$name\|function.*$name\|$name\.tsx\|$name\.ts" "$UI_ROOT" 2>/dev/null | grep -v node_modules >/dev/null && return 0
  return 1
}

out="MISSING_COMPONENTS_CHECKLIST.md"
echo "# RYZE-UP Missing Components Checklist" > "$out"
echo "" >> "$out"
echo "**Repo:** $REPO" >> "$out"
echo "**Generated:** $(date)" >> "$out"
echo "" >> "$out"
printf "| Area | Component | Status |\n|---|---|---|\n" >> "$out"

missing=0
present=0
while IFS= read -r line; do
  area="${line%%|*}"
  comp="${line##*|}"
  if scan_one "$area" "$comp"; then
    printf "| %s | %s | ✅ |\n" "$area" "$comp" >> "$out"
    present=$((present+1))
  else
    printf "| %s | %s | ❌ |\n" "$area" "$comp" >> "$out"
    missing=$((missing+1))
  fi
done < <(printf "%s\n" "${components[@]}")

total=$((missing+present))
pct=$((present * 100 / total))

echo "" >> "$out"
echo "## Summary" >> "$out"
echo "" >> "$out"
echo "- **Present:** $present/$total (${pct}%)" >> "$out"
echo "- **Missing:** $missing/$total ($((100-pct))%)" >> "$out"

cat "$out"
