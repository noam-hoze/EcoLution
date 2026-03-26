
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Entity } from '../types';

interface LineageGraphProps {
  entities: Entity[];
}

export const LineageGraph: React.FC<LineageGraphProps> = ({ entities }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || entities.length === 0) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(entities as any)
      .force("link", d3.forceLink().id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const links: any[] = [];
    entities.forEach(entity => {
      entity.lineage.forEach(ancestorId => {
        links.push({ source: ancestorId, target: entity.id });
      });
    });

    const link = svg.append("g")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")
      .attr("stroke-width", 1)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg.append("g")
      .selectAll("g")
      .data(entities)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("circle")
      .attr("r", (d: any) => Math.sqrt(d.power) * 2 + 5)
      .attr("fill", (d: any) => d.isUser ? "#f97316" : "#ffffff")
      .attr("opacity", 0.8)
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .attr("fill", "#ffffff")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .text((d: any) => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [entities]);

  return (
    <div className="flex-1 relative overflow-hidden bg-black/40 backdrop-blur-xl">
      <div className="absolute top-6 left-8 z-10">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">Idea Lineage Graph</h2>
        <p className="text-[10px] text-white/30 mt-1">Visualizing the evolution of corporate organisms</p>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        className="w-full h-full"
      />
    </div>
  );
};
