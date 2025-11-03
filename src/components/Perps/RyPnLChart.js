import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';
export const RyPnLChart = ({ sym, width = 400, height = 200 }) => {
    const svgRef = useRef(null);
    const { perps } = useStore();
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear
        const data = perps.pnlHistory?.[sym] || [
            { ts: Date.now() - 3600000, pnl: -100 }, // Stub: 1hr history
            { ts: Date.now() - 1800000, pnl: 50 },
            { ts: Date.now(), pnl: 200 }
        ];
        if (data.length < 2)
            return;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const extent = d3.extent(data, (d) => new Date(d.ts));
        const xScale = d3.scaleTime()
            .domain(extent)
            .range([0, innerWidth]);
        const yScale = d3.scaleLinear()
            .domain([d3.min(data, (d) => d.pnl) || 0, d3.max(data, (d) => d.pnl) || 100])
            .range([innerHeight, 0]);
        const line = d3.line()
            .x((d) => xScale(new Date(d.ts)))
            .y((d) => yScale(d.pnl))
            .curve(d3.curveMonotoneX);
        svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'var(--accent)')
            .attr('stroke-width', 2)
            .attr('d', line);
        // Axes
        svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top + innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(3));
        svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(yScale).ticks(5));
        // Labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height)
            .attr('text-anchor', 'middle')
            .text('Time');
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', margin.left / 2)
            .attr('text-anchor', 'middle')
            .text('PnL ($)');
    }, [perps.pnlHistory?.[sym], sym, width, height]);
    return (_jsxs(RyCard, { children: [_jsx("h4", { className: "font-semibold mb-2", children: "PnL Timeline" }), _jsx("svg", { ref: svgRef, width: width, height: height, className: "w-full h-auto" })] }));
};
