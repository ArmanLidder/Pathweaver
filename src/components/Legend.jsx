export default function Legend({ selectedAlgorithm }) {
  const algoColors = {
    dijkstra: "rgba(59, 130, 246, 0.12)",
    astar: "rgba(245, 158, 11, 0.12)",
    greedy: "rgba(236, 72, 153, 0.12)",
    bfs: "rgba(6, 182, 212, 0.12)",
    dfs: "rgba(239, 68, 68, 0.09)",
  };

  const algoBorders = {
    dijkstra: "rgba(59, 130, 246, 0.2)",
    astar: "rgba(245, 158, 11, 0.2)",
    greedy: "rgba(236, 72, 153, 0.2)",
    bfs: "rgba(6, 182, 212, 0.2)",
    dfs: "rgba(239, 68, 68, 0.15)",
  };

  const activeColor = algoColors[selectedAlgorithm] || algoColors.dijkstra;
  const activeBorder = algoBorders[selectedAlgorithm] || algoBorders.dijkstra;

  return (
    <div className="legend-container">
      <div className="legend-item">
        <div className="legend-box" style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid var(--border-color)" }}>
          <div className="node-start-icon" style={{ width: "4px", height: "4px" }} />
        </div>
        <span>Start</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid var(--border-color)" }}>
          <div className="node-target-icon" style={{ width: "4px", height: "4px" }} />
        </div>
        <span>Target</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ background: "#27272a" }} />
        <span>Wall</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ border: "1px solid var(--border-color)" }} />
        <span>Unvisited</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ background: activeColor, border: `1px solid ${activeBorder}` }} />
        <span>Visited</span>
      </div>

      <div className="legend-item">
        <div className="legend-box" style={{ background: "var(--accent-amber)" }} />
        <span>Shortest Path</span>
      </div>
    </div>
  );
}
