import React from "react";
import { GitBranch, RefreshCw, Trash2, Play, Pause, ChevronRight } from "lucide-react";

export default function Header({
  selectedAlgorithm,
  setSelectedAlgorithm,
  isVisualizing,
  speed,
  setSpeed,
  onVisualize,
  onClearGrid,
  onClearPath,
  hasPath,
  gridSize,
  onChangeGridSize,
}) {
  const algorithms = [
    { id: "dijkstra", name: "Dijkstra's Algorithm", desc: "Guarantees shortest path. Explores outward equally." },
    { id: "astar", name: "A* Search", desc: "Guarantees shortest path. Uses heuristics to target destination." },
    { id: "greedy", name: "Greedy Best-First Search", desc: "Does NOT guarantee shortest path. Moves strictly towards destination." },
    { id: "bfs", name: "Breadth-First Search", desc: "Guarantees shortest path. Great for unweighted grids." },
    { id: "dfs", name: "Depth-First Search", desc: "Does NOT guarantee shortest path. Explores deep paths first." },
  ];

  const currentAlgo = algorithms.find((a) => a.id === selectedAlgorithm) || algorithms[0];

  return (
    <header className="glass-panel" style={{ padding: "1.2rem 2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
        <div style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))", padding: "0.6rem", borderRadius: "12px", boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)" }}>
          <GitBranch size={24} style={{ color: "white" }} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", letterSpacing: "-0.02em", margin: 0, background: "linear-gradient(to right, #ffffff, #9ca3af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Pathweaver
          </h1>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Interactive Pathfinding Visualizer</p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
        {/* Selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>Algorithm</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isVisualizing}
          >
            {algorithms.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        {/* Grid Size Selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>Grid Size</label>
          <select
            value={gridSize}
            onChange={(e) => onChangeGridSize(e.target.value)}
            disabled={isVisualizing}
          >
            <option value="small">Small (15 x 29)</option>
            <option value="medium">Medium (21 x 47)</option>
            <option value="large">Large (25 x 57)</option>
          </select>
        </div>

        {/* Speed Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "140px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
            <span>Speed</span>
            <span style={{ color: "var(--accent-blue)", fontFamily: "var(--font-mono)" }}>
              {speed === 100 ? "Instant" : speed >= 80 ? "Fast" : speed >= 40 ? "Medium" : "Slow"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isVisualizing}
            style={{ width: "100%" }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "1rem" }}>
          <button
            className="primary"
            onClick={onVisualize}
            disabled={isVisualizing}
            style={{ padding: "0.6rem 1.4rem" }}
          >
            <Play size={16} fill="white" />
            Visualize
          </button>
          
          <button
            onClick={onClearPath}
            disabled={!hasPath && !isVisualizing}
            title="Clear path visualization (Resets visualization if running)"
          >
            <RefreshCw size={16} />
            Clear Path
          </button>

          <button
            className="danger"
            onClick={onClearGrid}
            title="Clear walls and path (Resets grid and halts animation)"
          >
            <Trash2 size={16} />
            Reset Grid
          </button>
        </div>
      </div>
    </header>
  );
}
