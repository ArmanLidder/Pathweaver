import React from "react";
import { BarChart2, BookOpen, Clock, Activity, Zap } from "lucide-react";

export default function Sidebar({
  selectedAlgorithm,
  visitedCount,
  pathLength,
  executionTime,
  isVisualizing,
  visualizingPhase, // 'idle', 'searching', 'pathfinding', 'completed', 'no-path'
}) {
  const algoDetails = {
    dijkstra: {
      name: "Dijkstra's Algorithm",
      timeComp: "O((V + E) log V)",
      spaceComp: "O(V)",
      guarantees: "Yes (shortest path)",
      weighted: "Weighted (uniform v1)",
      desc: "An unweighted traversal of Dijkstra's algorithm explores cells in uniform expanding concentric rings. It acts exactly like BFS but uses distances to determine the traversal priority.",
      pseudocode: [
        { text: "1. set all distances to Infinity, start = 0", step: "init" },
        { text: "2. while unvisited nodes remain:", step: "search" },
        { text: "3.   get unvisited node u with min distance", step: "search" },
        { text: "4.   if distance[u] == Infinity, break (trapped)", step: "search" },
        { text: "5.   mark u as visited", step: "search" },
        { text: "6.   for each unvisited neighbor v of u:", step: "search" },
        { text: "7.     distance[v] = min(distance[v], dist[u] + 1)", step: "search" },
        { text: "8.     parent[v] = u", step: "search" },
        { text: "9.   if u == target, backtrack path", step: "path" }
      ]
    },
    astar: {
      name: "A* Search",
      timeComp: "O(E log V)",
      spaceComp: "O(V)",
      guarantees: "Yes (shortest path)",
      weighted: "Weighted (uniform v1)",
      desc: "One of the most popular pathfinding algorithms. It uses a heuristic (Manhattan distance in our grid) to prioritize nodes that are geographically closer to the target node.",
      pseudocode: [
        { text: "1. add start node to openSet, gCost = 0", step: "init" },
        { text: "2. while openSet is not empty:", step: "search" },
        { text: "3.   current = node in openSet with min fCost", step: "search" },
        { text: "4.   if current == target, backtrack path", step: "path" },
        { text: "5.   remove current from openSet; add to closedSet", step: "search" },
        { text: "6.   for each neighbor of current:", step: "search" },
        { text: "7.     tentative_g = current.gCost + 1", step: "search" },
        { text: "8.     if tentative_g < neighbor.gCost:", step: "search" },
        { text: "9.       update neighbor parent, gCost, hCost, fCost", step: "search" }
      ]
    },
    greedy: {
      name: "Greedy Best-First Search",
      timeComp: "O(E log V)",
      spaceComp: "O(V)",
      guarantees: "No",
      weighted: "Weighted (uniform v1)",
      desc: "Greedy BFS is a faster, heuristic-only version of A*. It strictly explores nodes that look closest to the target, completely ignoring distance traveled. It is prone to getting stuck in obstacles.",
      pseudocode: [
        { text: "1. add start to openSet, hCost = distance(start, target)", step: "init" },
        { text: "2. while openSet is not empty:", step: "search" },
        { text: "3.   current = node in openSet with min hCost", step: "search" },
        { text: "4.   if current == target, backtrack path", step: "path" },
        { text: "5.   remove current from openSet; mark visited", step: "search" },
        { text: "6.   for each neighbor of current:", step: "search" },
        { text: "7.     if neighbor is unvisited and not in openSet:", step: "search" },
        { text: "8.       neighbor.parent = current", step: "search" },
        { text: "9.       add neighbor to openSet", step: "search" }
      ]
    },
    bfs: {
      name: "Breadth-First Search",
      timeComp: "O(V + E)",
      spaceComp: "O(V)",
      guarantees: "Yes (shortest path)",
      weighted: "Unweighted only",
      desc: "BFS explores neighbors level-by-level. It uses a FIFO queue. In an unweighted grid, it guarantees finding the shortest path because it visits nodes in increasing order of distance.",
      pseudocode: [
        { text: "1. enqueue start to Queue; mark as visited", step: "init" },
        { text: "2. while Queue is not empty:", step: "search" },
        { text: "3.   current = dequeue from Queue", step: "search" },
        { text: "4.   if current == target, backtrack path", step: "path" },
        { text: "5.   for each neighbor of current:", step: "search" },
        { text: "6.     if neighbor is unvisited and not wall:", step: "search" },
        { text: "7.       mark neighbor as visited", step: "search" },
        { text: "8.       neighbor.parent = current", step: "search" },
        { text: "9.       enqueue neighbor to Queue", step: "search" }
      ]
    },
    dfs: {
      name: "Depth-First Search",
      timeComp: "O(V + E)",
      spaceComp: "O(V)",
      guarantees: "No",
      weighted: "Unweighted only",
      desc: "DFS explores as deep as possible before backtracking. It uses a LIFO stack. It is a poor algorithm for pathfinding because it usually wanders around the entire grid before finding the target.",
      pseudocode: [
        { text: "1. push start node to Stack", step: "init" },
        { text: "2. while Stack is not empty:", step: "search" },
        { text: "3.   current = pop from Stack", step: "search" },
        { text: "4.   if current == target, backtrack path", step: "path" },
        { text: "5.   if current is unvisited:", step: "search" },
        { text: "6.     mark current as visited", step: "search" },
        { text: "7.     for each neighbor of current:", step: "search" },
        { text: "8.       neighbor.parent = current", step: "search" },
        { text: "9.       push neighbor to Stack", step: "search" }
      ]
    }
  };

  const details = algoDetails[selectedAlgorithm] || algoDetails.dijkstra;

  // Map visualizing phase to pseudocode highlighted steps
  const activeStep = 
    visualizingPhase === "searching" 
      ? "search" 
      : visualizingPhase === "pathfinding" 
      ? "path" 
      : visualizingPhase === "idle" 
      ? "init" 
      : "";

  return (
    <aside className="sidebar">
      {/* Metrics Card */}
      <section className="glass-panel" style={{ display: "flex", flexDirection: "column" }}>
        <div className="card-header">
          <h2 className="card-title">
            <BarChart2 size={18} style={{ color: "var(--accent-blue)" }} />
            Live Dashboard
          </h2>
          {isVisualizing && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: "600" }}>
              <Activity size={12} className="animate-pulse" />
              Running
            </span>
          )}
        </div>
        <div className="card-body">
          <div className="stats-grid">
            <div className="stat-item">
              <span id="visited-counter" className="stat-value">{visitedCount}</span>
              <span className="stat-label">Visited Nodes</span>
            </div>
            <div className="stat-item">
              <span id="path-counter" className="stat-value" style={{ color: pathLength > 0 ? "var(--accent-gold)" : "var(--text-primary)" }}>
                {pathLength || "-"}
              </span>
              <span className="stat-label">Path Length</span>
            </div>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "0.8rem 1rem", borderRadius: "12px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={14} /> Execution Time:
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: "600" }}>
              {executionTime !== null ? `${executionTime.toFixed(1)}ms` : "0.0ms"}
            </span>
          </div>
        </div>
      </section>

      {/* Info Card */}
      <section className="glass-panel" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div className="card-header">
          <h2 className="card-title">
            <BookOpen size={18} style={{ color: "var(--accent-purple)" }} />
            {details.name}
          </h2>
        </div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
            {details.desc}
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <td style={{ padding: "0.5rem 0", color: "var(--text-secondary)" }}>Time Complexity:</td>
                <td style={{ padding: "0.5rem 0", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: "500" }}>
                  {details.timeComp}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <td style={{ padding: "0.5rem 0", color: "var(--text-secondary)" }}>Space Complexity:</td>
                <td style={{ padding: "0.5rem 0", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: "500" }}>
                  {details.spaceComp}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0", color: "var(--text-secondary)" }}>Guarantees Shortest:</td>
                <td style={{ padding: "0.5rem 0", textAlign: "right", fontWeight: "600", color: details.guarantees.startsWith("Yes") ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                  {details.guarantees}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Pseudocode Visualizer */}
          <div className="code-companion">
            <div style={{ padding: "0.5rem 0.8rem", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Zap size={12} /> Live Trace
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {details.pseudocode.map((line, idx) => (
                <div
                  key={idx}
                  className={`code-line ${line.step === activeStep ? "active" : ""}`}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
