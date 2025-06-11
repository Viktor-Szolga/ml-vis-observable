import * as d3 from "d3";
import { blocks, residualConnections, legendData } from "../data/blocks.js";

export function darkenColor(hex, factor) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0,2),16);
  const g = parseInt(hex.substring(2,4),16);
  const b = parseInt(hex.substring(4,6),16);
  const rD = Math.floor(r * factor);
  const gD = Math.floor(g * factor);
  const bD = Math.floor(b * factor);
  return "#" + [rD,gD,bD].map(x => x.toString(16).padStart(2, "0")).join("");
}

export function createCNNDiagram(selectedBlockId, onBlockClick) {
  const svg = d3.create("svg")
      .attr("viewBox", "0 0 1200 400")
      .style("width", "100%")
      .style("height", "auto");

  const blockGroups = svg.selectAll("g.layer")
    .data(blocks)
    .join("g")
      .classed("cnn-block", true)
      .on("click", (event, d) => {
        const newId = (selectedBlockId === d.id) ? null : d.id;
        onBlockClick(newId);
      });

  // Faces (front face)
  blockGroups.append("polygon")
      .attr("points", d => `${d.x},${d.y} ${d.x + d.w},${d.y} ${d.x + d.w},${d.y + d.h} ${d.x},${d.y + d.h}`)
      .attr("fill", d => d.color || "#3498db");

  // Top face
  blockGroups.append("polygon")
      .attr("points", d => `${d.x},${d.y} ${d.x + d.d},${d.y - d.d * 0.75} ${d.x + d.w + d.d},${d.y - d.d * 0.75} ${d.x + d.w},${d.y}`)
      .attr("fill", d => darkenColor(d.color || "#3498db", 0.8));

  // Right face
  blockGroups.append("polygon")
      .attr("points", d => `${d.x + d.w},${d.y} ${d.x + d.w + d.d},${d.y - d.d * 0.75} ${d.x + d.w + d.d},${d.y + d.h - d.d * 0.75} ${d.x + d.w},${d.y + d.h}`)
      .attr("fill", d => darkenColor(d.color || "#3498db", 0.6));

  // Highlight selected block
  blockGroups.selectAll("polygon")
      .attr("stroke", d => (d.id === selectedBlockId) ? "#000" : "none")
      .attr("stroke-width", 2);

  // Arrow marker
  svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#333");

  // Sequential connections
  for (let i = 0; i < blocks.length - 1; i++) {
    const from = blocks[i];
    const to = blocks[i + 1];
    const x1 = from.x + from.w + from.d/2;
    const y1 = from.y + from.h / 2 - from.d/4;
    const x2 = to.x;
    const y2 = y1;

    svg.append("line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2 - 7)
      .attr("y2", y2)
      .attr("stroke", "#333")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");
  }

  // Residual connections
  residualConnections.forEach(({ from, to }) => {
    const fromBlock = blocks.find(b => b.id === from);
    const toBlock = blocks.find(b => b.id === to);

    if (!fromBlock || !toBlock) return;

    const x1 = fromBlock.x + fromBlock.w + fromBlock.d / 2 + 23;
    const y1 = fromBlock.y + fromBlock.h / 2 - fromBlock.d / 4;
    const x2 = toBlock.x - 5 - 22;
    const y2 = toBlock.y + toBlock.h / 2 - toBlock.d / 4 - 5;

    // Use a curved path for skip connection
    const curve = d3.path();
    curve.moveTo(x1, y1);
    
    const midX = (x1 + x2) / 2;
    const peakY = Math.min(y1, y2) - 300;
    
    curve.quadraticCurveTo(midX, peakY, x2, y2);

    svg.append("path")
      .attr("d", curve.toString())
      .attr("stroke", "#333")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrow)");
  });

  // Add hidden text elements for hover
  const labels = blockGroups.append("text")
      .text(d => d.name)
      .attr("x", (d) => d.x + d.w * 2.5)
      .attr("y", (d) => d.y + d.h + 15)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "14")
      .attr("font-family", "sans-serif")
      .style("pointer-events", "none")
      .style("visibility", "hidden");

  // Show/hide text on hover
  blockGroups
    .on("mouseenter", function() {
      d3.select(this).select("text").style("visibility", "visible");
    })
    .on("mouseleave", function() {
      d3.select(this).select("text").style("visibility", "hidden");
    });

  // Legend
  const legend = svg.append("g")
    .attr("transform", "translate(1100, 5)");

  legend.selectAll("rect")
    .data(legendData)
    .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => d.color)
      .attr("stroke", "#000");

  legend.selectAll("text")
    .data(legendData)
    .join("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12)
      .text(d => d.name)
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .attr("fill", "#000");

  return svg.node();
}