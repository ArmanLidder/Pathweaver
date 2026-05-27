import { Play, Shuffle, RefreshCw, Trash2 } from "lucide-react";

export default function Header({
  selectedAlgorithm,
  setSelectedAlgorithm,
  isVisualizing,
  speed,
  setSpeed,
  onVisualize,
  onClearGrid,
  onClearPath,
  onGenerateMaze,
  hasPath,
  gridSize,
  onChangeGridSize,
}) {
  const algorithms = [
    { id: "dijkstra", name: "Dijkstra" },
    { id: "astar", name: "A* Search" },
    { id: "greedy", name: "Greedy BFS" },
    { id: "bfs", name: "BFS" },
    { id: "dfs", name: "DFS" },
  ];

  return (
    <header>
      {/* Brand Logo & Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1rem", fontWeight: "600", letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
          Pathweaver
        </span>
      </div>

      {/* Selectors and Settings */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
        {/* Algorithm dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "500" }}>Algorithm</span>
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

        {/* Grid Size dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "500" }}>Size</span>
          <select
            value={gridSize}
            onChange={(e) => onChangeGridSize(e.target.value)}
            disabled={isVisualizing}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Speed Slider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "500" }}>Speed</span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isVisualizing}
            style={{ width: "80px" }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          className="primary"
          onClick={onVisualize}
          disabled={isVisualizing}
        >
          <Play size={14} fill="currentColor" />
          Run
        </button>

        <button
          onClick={onGenerateMaze}
          disabled={isVisualizing}
          title="Generate random walls"
        >
          <Shuffle size={14} />
          Maze
        </button>
        
        <button
          onClick={onClearPath}
          disabled={!hasPath && !isVisualizing}
          title="Clear path output"
        >
          <RefreshCw size={14} />
          Clear Path
        </button>

        <button
          className="danger"
          onClick={onClearGrid}
          title="Reset grid"
        >
          <Trash2 size={14} />
          Reset
        </button>
      </div>
    </header>
  );
}
