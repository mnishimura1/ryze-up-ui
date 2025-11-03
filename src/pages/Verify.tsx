import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { api } from '../lib/api'
import { useFetchResearch } from '../hooks/useFetch'
import { useStore } from '../lib/store'

interface VerificationData {
  kyc_status: 'pending' | 'approved' | 'rejected'
  kyc_level: 'level_0' | 'level_1' | 'level_2' | 'level_3'
  verified_email: boolean
  verified_phone: boolean
  verified_identity: boolean
  daily_limit: number
  monthly_limit: number
  last_kyc_update: string
}

interface AuditEntry {
  timestamp: string
  action: string
  description: string
  ip_address: string
}

export default function Verify() {
  const { loading: oracleLoading } = useFetchResearch()
  const { mesh } = useStore()
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null)
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [data, audit] = await Promise.all([
          api.get<VerificationData>('/v1/verification'),
          api.get<AuditEntry[]>('/v1/audit-log'),
        ])
        setVerificationData(data)
        setAuditLog(audit)
      } catch (err) {
        console.error('Failed to fetch verification data:', err)
        // Fallback mock data
        setVerificationData({
          kyc_status: 'approved',
          kyc_level: 'level_3',
          verified_email: true,
          verified_phone: true,
          verified_identity: true,
          daily_limit: 100000,
          monthly_limit: 500000,
          last_kyc_update: new Date(Date.now() - 2592000000).toISOString(),
        })
        setAuditLog([
          {
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            action: 'login',
            description: 'User logged in',
            ip_address: '192.168.1.1',
          },
          {
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            action: 'trade',
            description: 'Executed trade BTC/USDC',
            ip_address: '192.168.1.1',
          },
          {
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            action: 'kyc_approved',
            description: 'KYC verification approved (Level 3)',
            ip_address: '192.168.1.1',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getKycBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-400/20 text-green-400'
      case 'pending':
        return 'bg-yellow-400/20 text-yellow-400'
      case 'rejected':
        return 'bg-red-400/20 text-red-400'
      default:
        return 'bg-dark-border text-dark-text'
    }
  }

  const getLevelDescription = (level: string) => {
    const descriptions: Record<string, string> = {
      level_0: 'No verification',
      level_1: 'Email verified',
      level_2: 'Identity verified',
      level_3: 'Full KYC approved',
    }
    return descriptions[level] || 'Unknown'
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString()
  }

  if (loading || !verificationData) {
    return (
      <div className="p-8">
        <div className="text-dark-text/70">Loading verification data...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Verification & Oracle Proofs</h1>

      {mesh.ai_summaries && mesh.ai_summaries.length > 0 && (
        <Card>
          <div className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Oracle Consensus</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mesh.ai_summaries.map((summary, idx) => (
                <div key={idx} className="p-3 rounded bg-dark-bg border border-dark-border">
                  <p className="text-sm font-semibold text-accent">{summary.sym}</p>
                  <p className="text-xs text-dark-text/70 mt-1">{summary.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* KYC Status */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">KYC Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-dark-text/70 text-sm mb-2">Verification Status</p>
                <div className={`inline-block px-3 py-1 rounded font-semibold text-sm ${getKycBadgeColor(verificationData.kyc_status)}`}>
                  {verificationData.kyc_status.charAt(0).toUpperCase() +
                    verificationData.kyc_status.slice(1)}
                </div>
              </div>

              <div>
                <p className="text-dark-text/70 text-sm mb-2">Verification Level</p>
                <p className="text-lg font-semibold">
                  {getLevelDescription(verificationData.kyc_level)}
                </p>
              </div>

              <div>
                <p className="text-dark-text/70 text-sm mb-3">Verified Items</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        verificationData.verified_email ? 'bg-green-400' : 'bg-dark-border'
                      }`}
                    >
                      {verificationData.verified_email ? '✓' : ''}
                    </div>
                    <span className="text-sm">Email Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        verificationData.verified_phone ? 'bg-green-400' : 'bg-dark-border'
                      }`}
                    >
                      {verificationData.verified_phone ? '✓' : ''}
                    </div>
                    <span className="text-sm">Phone Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                        verificationData.verified_identity ? 'bg-green-400' : 'bg-dark-border'
                      }`}
                    >
                      {verificationData.verified_identity ? '✓' : ''}
                    </div>
                    <span className="text-sm">Identity Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Trading Limits */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Trading Limits</h2>
            <div className="space-y-4">
              <div>
                <p className="text-dark-text/70 text-sm mb-2">Daily Limit</p>
                <p className="text-2xl font-bold">
                  ${verificationData.daily_limit.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-dark-text/70 text-sm mb-2">Monthly Limit</p>
                <p className="text-2xl font-bold">
                  ${verificationData.monthly_limit.toLocaleString()}
                </p>
              </div>

              <div className="pt-2">
                <p className="text-dark-text/70 text-xs">
                  Last updated:{' '}
                  {new Date(verificationData.last_kyc_update).toLocaleDateString()}
                </p>
              </div>

              <button className="w-full bg-accent text-dark-bg font-semibold py-2 rounded hover:bg-accent/90 transition mt-4">
                Update Verification
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Audit Log */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Audit Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-2 px-2">Timestamp</th>
                  <th className="text-left py-2 px-2">Action</th>
                  <th className="text-left py-2 px-2">Description</th>
                  <th className="text-left py-2 px-2">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-2 text-dark-text/70">
                      No audit entries
                    </td>
                  </tr>
                ) : (
                  auditLog.map((entry, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-dark-border hover:bg-dark-bg transition"
                    >
                      <td className="py-3 px-2 font-mono text-xs">
                        {formatDate(entry.timestamp)}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 bg-dark-bg rounded text-xs font-semibold uppercase">
                          {entry.action}
                        </span>
                      </td>
                      <td className="py-3 px-2">{entry.description}</td>
                      <td className="py-3 px-2 font-mono text-xs text-dark-text/70">
                        {entry.ip_address}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
