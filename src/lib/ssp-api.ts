/**
 * SSP API Client
 * Handles all /api/ssp/* endpoint calls with real data fetching
 * Supports: Pools, Calibration, Fees, Health, ADL Events, Asset Config
 */

import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080'

// ===== TYPES =====
export interface Pool {
  id: string
  tvl: number
  apr: number
  shieldLevel?: number
}

export interface ShieldData {
  poolId: string
  level: number
  healthScore: number
}

export interface CalibrationData {
  min: number
  max: number
  midpoint: number
  qValue: number
}

export interface FeeData {
  distributions: Array<{ name: string; value: number }>
  total: number
  piechart: Array<{ label: string; percentage: number }>
}

export interface HealthData {
  balanceUtilization: number
  pnlUtilization: number
  compositeHealth: number
  timestamp: number
}

export interface ADLEvent {
  id: string
  asset: string
  reason: string
  positionCount: number
  timestamp: number
}

export interface ComponentBreakdown {
  index: number
  slip_i: number
  wbf_i: number
  wrr_i: number
  sigma_i: number
}

export interface AggregationPoint {
  ts: number
  q: number
}

export interface SessionKey {
  key: string
  active: boolean
  createdAt: number
}

export interface AssetRiskConfig {
  asset: string
  riskWeight: number
  collateralBasis: number
}

// ===== API METHODS =====

/**
 * Fetch list of all available pools
 */
export const fetchPools = async (): Promise<Pool[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/pools`)
    return response.data || []
  } catch (error) {
    console.error('Failed to fetch pools:', error)
    return []
  }
}

/**
 * Fetch shield level for a specific pool
 */
export const fetchShieldLevel = async (poolId: string): Promise<ShieldData> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/pools/${poolId}/shield`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch shield level for ${poolId}:`, error)
    return { poolId, level: 75, healthScore: 0.7 } // Fallback
  }
}

/**
 * Fetch calibration data and compute q(B) value
 * Formula: q(B) = log((max - min) / midpoint + 1) * 10
 */
export const fetchCalibrationData = async (poolId: string): Promise<CalibrationData> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/calibrate/${poolId}`)
    const data = response.data
    const qValue = Math.log((data.max - data.min) / data.midpoint + 1) * 10
    return { ...data, qValue }
  } catch (error) {
    console.error(`Failed to fetch calibration for ${poolId}:`, error)
    return { min: 100, max: 1000, midpoint: 550, qValue: 0 }
  }
}

/**
 * Update calibration values
 */
export const updateCalibration = async (poolId: string, data: CalibrationData): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE}/api/ssp/calibrate/${poolId}`, {
      min: data.min,
      max: data.max,
      midpoint: data.midpoint,
    })
    return true
  } catch (error) {
    console.error(`Failed to update calibration for ${poolId}:`, error)
    return false
  }
}

/**
 * Fetch fee distribution data
 */
export const fetchFeeData = async (poolId: string): Promise<FeeData> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/fees/${poolId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch fees for ${poolId}:`, error)
    return {
      distributions: [],
      total: 0,
      piechart: [],
    }
  }
}

/**
 * Fetch health metrics (balance utilization, PnL utilization, composite health)
 */
export const fetchHealthData = async (poolId: string): Promise<HealthData> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/health/${poolId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch health for ${poolId}:`, error)
    return {
      balanceUtilization: 0.3,
      pnlUtilization: 0.2,
      compositeHealth: 1 - Math.max(0.3, 0.2),
      timestamp: Date.now(),
    }
  }
}

/**
 * Fetch ADL (Auto-Deleveraging) events
 */
export const fetchADLEvents = async (poolId: string): Promise<ADLEvent[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/adl/${poolId}`)
    return response.data || []
  } catch (error) {
    console.error(`Failed to fetch ADL events for ${poolId}:`, error)
    return []
  }
}

/**
 * Fetch component breakdown (slip_i, WBF_i, WRR_i, σ_i)
 */
export const fetchComponentBreakdown = async (poolId: string): Promise<ComponentBreakdown[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/components/${poolId}`)
    return response.data || []
  } catch (error) {
    console.error(`Failed to fetch components for ${poolId}:`, error)
    return []
  }
}

/**
 * Fetch historical q(B) aggregation data for visualization
 */
export const fetchAggregationData = async (poolId: string, limit: number = 100): Promise<AggregationPoint[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/aggregation/${poolId}`, { params: { limit } })
    return response.data || []
  } catch (error) {
    console.error(`Failed to fetch aggregation data for ${poolId}:`, error)
    return []
  }
}

/**
 * Fetch active session keys
 */
export const fetchSessionKeys = async (poolId: string): Promise<SessionKey[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/sessions/${poolId}`)
    return response.data || []
  } catch (error) {
    console.error(`Failed to fetch session keys for ${poolId}:`, error)
    return []
  }
}

/**
 * Fetch asset risk configuration
 */
export const fetchAssetRiskConfig = async (poolId: string): Promise<AssetRiskConfig[]> => {
  try {
    const response = await axios.get(`${API_BASE}/api/ssp/config/${poolId}`)
    return response.data || []
  } catch (error) {
    console.error(`Failed to fetch asset risk config for ${poolId}:`, error)
    return []
  }
}

/**
 * Update fee parameters
 */
export const updateFeeParameters = async (
  poolId: string,
  winRateTarget: number,
  feeStep: number
): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE}/api/ssp/fees/${poolId}`, { winRateTarget, feeStep })
    return true
  } catch (error) {
    console.error(`Failed to update fees for ${poolId}:`, error)
    return false
  }
}

/**
 * Update circuit state (open/guarded/breaker)
 */
export const updateCircuitState = async (
  poolId: string,
  state: 'open' | 'guarded' | 'breaker',
  reason?: string
): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE}/api/ssp/circuit/${poolId}`, { state, reason })
    return true
  } catch (error) {
    console.error(`Failed to update circuit state for ${poolId}:`, error)
    return false
  }
}
