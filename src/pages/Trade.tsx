import Card from '../components/Card'

export default function Trade() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Trade</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Ticket</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Symbol</label>
                <input
                  type="text"
                  placeholder="BTC/USDC"
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Side</label>
                  <select className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text">
                    <option>Buy</option>
                    <option>Sell</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Type</label>
                  <select className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text">
                    <option>Market</option>
                    <option>Limit</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Size</label>
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text"
                />
              </div>
              <button className="w-full bg-accent text-dark-bg font-semibold py-2 rounded hover:bg-accent/90 transition">
                Submit Order
              </button>
            </form>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
            <p className="text-dark-text/70">No open positions</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
