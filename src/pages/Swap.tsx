import Card from '../components/Card'

export default function Swap() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Swap</h1>
      <div className="max-w-md mx-auto">
        <Card>
          <div className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-2">From</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="flex-1 bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text"
                  />
                  <select className="bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text">
                    <option>USDC</option>
                    <option>ETH</option>
                    <option>BTC</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button className="p-2 bg-dark-bg rounded hover:bg-dark-border transition">
                  ⇅
                </button>
              </div>

              <div>
                <label className="block text-sm mb-2">To</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="flex-1 bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text"
                  />
                  <select className="bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text">
                    <option>ETH</option>
                    <option>USDC</option>
                    <option>BTC</option>
                  </select>
                </div>
              </div>

              <button className="w-full bg-accent text-dark-bg font-semibold py-2 rounded hover:bg-accent/90 transition">
                Swap
              </button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
