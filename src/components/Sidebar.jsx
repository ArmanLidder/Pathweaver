import { Activity } from "lucide-react";

export default function Sidebar({
  selectedAlgorithm,
  visitedCount,
  pathLength,
  executionTime,
  isVisualizing,
}) {
  const algoDetails = {
    dijkstra: {
      name: "Dijkstra's",
      timeComp: "O((V + E) log V)",
      spaceComp: "O(V)",
      guarantees: "Yes",
      desc: "Explores nodes in uniform expanding concentric rings. Guarantees the shortest path.",
    },
    astar: {
      name: "A* Search",
      timeComp: "O(E log V)",
      spaceComp: "O(V)",
      guarantees: "Yes",
      desc: "Uses heuristics (Manhattan distance) to guide search towards the target. Guarantees the shortest path.",
    },
    greedy: {
      name: "Greedy BFS",
      timeComp: "O(E log V)",
      spaceComp: "O(V)",
      guarantees: "No",
      desc: "Heuristic-only search prioritizing nodes closest to target. Faster but does not guarantee the shortest path.",
    },
    bfs: {
      name: "Breadth-First",
      timeComp: "O(V + E)",
      spaceComp: "O(V)",
      guarantees: "Yes",
      desc: "Explores neighbor by neighbor. Guarantees finding the shortest path on unweighted grids.",
    },
    dfs: {
      name: "Depth-First",
      timeComp: "O(V + E)",
      spaceComp: "O(V)",
      guarantees: "No",
      desc: "Explores deep paths first. Does not guarantee the shortest path and is highly inefficient.",
    },
  };

  const details = algoDetails[selectedAlgorithm] || algoDetails.dijkstra;

  return (
    <aside className="sidebar">
      {/* Metrics Section */}
      <section className="sidebar-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="section-title">Metrics</h2>
          {isVisualizing && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--accent-blue)", fontWeight: "500" }}>
              <Activity size={10} style={{ animation: "pulse 1.5s infinite" }} />
              Running
            </span>
          )}
        </div>
        <div className="stats-list">
          <div className="stat-row">
            <span className="stat-label">Visited Nodes</span>
            <span id="visited-counter" className="stat-value">{visitedCount}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Path Length</span>
            <span id="path-counter" className="stat-value">
              {pathLength || "—"}
            </span>
          </div>
          <div className="stat-row" style={{ borderBottom: "none" }}>
            <span className="stat-label">Execution Time</span>
            <span className="stat-value">
              {executionTime !== null ? `${executionTime.toFixed(1)}ms` : "0.0ms"}
            </span>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="sidebar-section" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 className="section-title">Properties</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontSize: "1rem", fontWeight: "500", color: "var(--text-primary)" }}>
            {details.name}
          </span>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            {details.desc}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Time Complexity</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{details.timeComp}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Space Complexity</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{details.spaceComp}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Guarantees Shortest</span>
            <span style={{ 
              fontWeight: "500", 
              color: details.guarantees === "Yes" ? "var(--accent-emerald)" : "var(--accent-rose)" 
            }}>
              {details.guarantees}
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
}
