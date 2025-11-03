import { useFetchQ } from '../hooks/useFetch'
import { useStore } from '../lib/store'
import Card from '../components/Card'

export default function Q() {
  const { loading } = useFetchQ()
  const { safety, ai } = useStore()

  if (loading) return <div className="text-center py-4">Loading Q-Agent...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Q-Agent Assistant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-dark-text/70 text-sm mb-1">Agent Status</p>
                <p className={`text-2xl font-bold ${ai.ctx === 'Ready' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {ai.ctx}
                </p>
              </div>
              <div>
                <p className="text-dark-text/70 text-sm mb-1">Mode</p>
                <p className={`text-lg font-semibold ${safety.deploy ? 'text-green-400' : 'text-orange-400'}`}>
                  {safety.deploy ? 'Trading' : 'Suggest-Only'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Suggestions</h2>
              {ai.suggestions && ai.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {ai.suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 rounded border border-dark-border bg-dark-bg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm">{suggestion.text}</p>
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          suggestion.confidence > 0.7 ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'
                        }`}>
                          {(suggestion.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-dark-bg rounded-full h-1">
                        <div
                          className="bg-accent h-1 rounded-full transition"
                          style={{ width: `${suggestion.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-text/70 text-sm">No suggestions available</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {!safety.deploy && (
        <Card>
          <div className="p-4 text-center text-orange-400 mt-6">
            Sandbox Mode: Suggestions Only (No Execution)
          </div>
        </Card>
      )}
    </div>
  )
}
