import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useStore } from '../../lib/store';
import Card from '../Card';
export const RyAISummariesPanel = () => {
    const { mesh, ai } = useStore();
    const [selectedSummary, setSelectedSummary] = useState(null);
    const [filterTopic, setFilterTopic] = useState('all');
    const summaries = (mesh.ai_summaries || []).filter((s) => {
        if (filterTopic === 'all')
            return true;
        return s.summary.toLowerCase().includes(filterTopic);
    });
    if (summaries.length === 0) {
        return null;
    }
    const getTopicColor = (summary) => {
        const lower = summary.toLowerCase();
        if (lower.includes('risk') || lower.includes('danger') || lower.includes('liquidation'))
            return 'text-danger';
        if (lower.includes('opportunity') || lower.includes('gain') || lower.includes('profit'))
            return 'text-success';
        if (lower.includes('market') || lower.includes('volatility'))
            return 'text-warn';
        return 'text-dark-text/70';
    };
    const getSentimentScore = (summary) => {
        const lower = summary.toLowerCase();
        const positive = (lower.match(/gain|profit|rise|up|bullish|strong|excellent/gi) || []).length;
        const negative = (lower.match(/risk|loss|fall|down|bearish|weak|danger/gi) || []).length;
        return positive - negative;
    };
    return (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "AI Research Summaries" }), _jsx("div", { className: "flex space-x-2 mb-4", children: ['all', 'market', 'risk', 'opportunity'].map((topic) => (_jsx("button", { onClick: () => setFilterTopic(topic), className: `px-3 py-1 rounded text-xs font-semibold transition ${filterTopic === topic
                            ? 'bg-accent text-dark-bg'
                            : 'bg-dark-border/50 text-dark-text/70 hover:bg-dark-border'}`, children: topic.charAt(0).toUpperCase() + topic.slice(1) }, topic))) }), _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: summaries.length > 0 ? (summaries.map((s) => {
                        const sentiment = getSentimentScore(s.summary);
                        const isSelected = selectedSummary === s.sym;
                        return (_jsxs("div", { onClick: () => setSelectedSummary(isSelected ? null : s.sym), className: `p-4 rounded border cursor-pointer transition ${isSelected
                                ? 'border-accent bg-accent/10'
                                : 'border-dark-border/50 hover:border-dark-border'}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "font-bold text-dark-text", children: s.sym }), _jsx("span", { className: "text-xs px-2 py-1 rounded bg-dark-bg", children: "Market Data" })] }) }), _jsxs("span", { className: `text-xs font-semibold ${getTopicColor(s.summary)}`, children: [sentiment > 0 ? '📈' : sentiment < 0 ? '📉' : '➡️', " ", Math.abs(sentiment)] })] }), _jsx("p", { className: "text-sm text-dark-text/80 mb-3", children: s.summary }), isSelected && (_jsxs("div", { className: "mt-4 pt-4 border-t border-dark-border/30 space-y-3", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-dark-text/70 mb-2", children: "Confidence Score" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "flex-1 h-2 bg-dark-border rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition ${sentiment > 0 ? 'bg-success' : sentiment < 0 ? 'bg-danger' : 'bg-warn'}`, style: { width: `${Math.min(100, 50 + Math.abs(sentiment) * 10)}%` } }) }), _jsxs("span", { className: "text-xs font-mono", children: [(50 + Math.abs(sentiment) * 5).toFixed(0), "%"] })] })] }), _jsx("button", { className: "w-full px-3 py-2 rounded text-xs font-semibold bg-accent text-dark-bg hover:bg-accent/90 transition", children: "View Full Analysis" })] }))] }, s.sym));
                    })) : (_jsx("div", { className: "text-center py-8 text-dark-text/70 text-sm", children: "No AI summaries available for selected filter" })) }), _jsxs("div", { className: "mt-6 pt-4 border-t border-dark-border grid grid-cols-3 gap-3 text-xs", children: [_jsxs("div", { children: [_jsx("div", { className: "text-dark-text/70 mb-1", children: "Total Summaries" }), _jsx("div", { className: "text-lg font-bold text-dark-text", children: summaries.length })] }), _jsxs("div", { children: [_jsx("div", { className: "text-dark-text/70 mb-1", children: "Avg Confidence" }), _jsxs("div", { className: "text-lg font-bold text-dark-text", children: [summaries.length > 0
                                            ? (summaries.reduce((sum, s) => sum + (50 + Math.abs(getSentimentScore(s.summary)) * 5), 0) /
                                                summaries.length).toFixed(0)
                                            : '0', "%"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-dark-text/70 mb-1", children: "Sentiment" }), _jsx("div", { className: `text-lg font-bold ${summaries.length > 0 && summaries.reduce((s, sum) => s + getSentimentScore(sum.summary), 0) > 0 ? 'text-success' : 'text-danger'}`, children: summaries.length > 0
                                        ? (summaries.reduce((s, sum) => s + getSentimentScore(sum.summary), 0) > 0 ? 'Bullish' : 'Bearish')
                                        : 'N/A' })] })] })] }) }));
};
