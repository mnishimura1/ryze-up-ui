import { PortfolioTab } from '../components/Portfolio'
import { useFetchPortfolio } from '../hooks/useFetch'

export default function Portfolio() {
  const { loading } = useFetchPortfolio()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Loading portfolio...</p>
          <div className="inline-block animate-spin">⏳</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PortfolioTab />
    </div>
  )
}
