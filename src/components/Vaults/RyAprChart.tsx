import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../lib/store';
import { RyCard } from '../primitives/RyCard';

interface RyAprChartProps {
  strategyId?: string;
  width?: number;
  height?: number;
}

interface AprData {
  period: string;
  apr: number;
}

export const RyAprChart: React.FC<RyAprChartProps> = ({ strategyId = 'strat-1', width = 400, height = 200 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { vaults } = useStore();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const data: AprData[] = vaults.metrics?.[strategyId]?.apr_history || [
      { period: '7d', apr: 12.5 },
      { period: '30d', apr: 11.8 },
      { period: '90d', apr: 13.2 }
    ];

    if (data.length < 2) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand<string>()
      .domain(data.map(d => d.period))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.apr) || 0, d3.max(data, d => d.apr) || 20])
      .range([innerHeight, 0]);

    // Bars
    svg.selectAll('rect.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: AprData) => xScale(d.period) || 0)
      .attr('y', (d: AprData) => yScale(d.apr))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: AprData) => innerHeight - yScale(d.apr))
      .attr('fill', 'var(--accent)')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Labels
    svg.selectAll('text.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d: AprData) => (xScale(d.period) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d: AprData) => yScale(d.apr) - 5)
      .attr('text-anchor', 'middle')
      .text((d: AprData) => `${d.apr}%`)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .style('font-size', '12px');

    // Axes
    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top + innerHeight})`)
      .call(d3.axisBottom(xScale) as any);

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale) as any);
  }, [vaults.metrics?.[strategyId]?.apr_history, strategyId, width, height]);

  return (
    <RyCard>
      <h4 className="font-semibold mb-2">APR Curve</h4>
      <svg ref={svgRef} width={width} height={height} className="w-full h-auto" />
    </RyCard>
  );
};
