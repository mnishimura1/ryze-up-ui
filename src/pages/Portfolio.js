import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PortfolioTab } from '../components/Portfolio';
import { useFetchPortfolio } from '../hooks/useFetch';
export default function Portfolio() {
    const { loading } = useFetchPortfolio();
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center py-16", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-slate-400 mb-4", children: "Loading portfolio..." }), _jsx("div", { className: "inline-block animate-spin", children: "\u23F3" })] }) }));
    }
    return (_jsx("div", { className: "p-8 max-w-7xl mx-auto", children: _jsx(PortfolioTab, {}) }));
}
