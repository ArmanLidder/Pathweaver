import React from "react";

export default function Legend({ selectedAlgorithm }) {
  const algoColors = {
    dijkstra: "rgba(99, 102, 241, 0.4)",
    astar: "rgba(245, 158, 11, 0.4)",
    greedy: "rgba(236, 72, 153, 0.4)",
    bfs: "rgba(6, 182, 212, 0.4)",
    dfs: "rgba(239, 68, 68, 0.4)",
  };

  const activeColor = algoColors[selectedAlgorithm] || algoColors.dijkstra;

  return (
    <div className="legend-container">
      <div className="legend-item">
        <div className="legend-box" style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg-secondary)" }}>
          <div className="node-start-icon" style={{ width: "10px", height: "10px" }} />
        </div>
        <span>Start Node</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg-secondary)" }}>
          <div className="node-target-icon" style={{ width: "10px", height: "10px" }} />
        </div>
        <span>Target Node</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ background: "linear-gradient(135deg, #1e293b, #334155)", borderColor: "#0f172a" }} />
        <span>Wall Node</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ background: "var(--bg-secondary)" }} />
        <span>Unvisited Node</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ background: activeColor, borderColor: "rgba(255,255,255,0.1)" }} />
        <span>Visited Node</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ background: "linear-gradient(135deg, var(--accent-gold), #fb923c, var(--accent-purple))" }} />
        <span>Shortest Path</span>
      </div>
    </div>
  );
}
