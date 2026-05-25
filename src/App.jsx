import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Grid from "./components/Grid";
import Sidebar from "./components/Sidebar";
import Legend from "./components/Legend";

import { dijkstra, getNodesInShortestPathOrder } from "./algorithms/dijkstra";
import { astar } from "./algorithms/astar";
import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";
import { greedy } from "./algorithms/greedy";



const getDelayFromSpeed = (speedValue) => {
  if (speedValue === 100) return 0; // instant
  if (speedValue >= 90) return 2;   // very fast
  if (speedValue >= 75) return 5;   // fast
  if (speedValue >= 50) return 15;  // medium-fast
  if (speedValue >= 30) return 30;  // medium
  if (speedValue >= 15) return 60;  // slow
  return 120;                       // very slow
};

export default function App() {
  const [grid, setGrid] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra");
  const [speed, setSpeed] = useState(80); // Speed level 1-100 (default 80 = Fast)
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizingPhase, setVisualizingPhase] = useState("idle"); // 'idle', 'searching', 'pathfinding', 'completed', 'no-path'
  const [hasPath, setHasPath] = useState(false);

  // Start & Target positions
  const [startNodePos, setStartNodePos] = useState({ row: 10, col: 8 });
  const [targetNodePos, setTargetNodePos] = useState({ row: 10, col: 38 });

  // Grid Size configuration states
  const [gridSize, setGridSize] = useState("medium");
  const [numRows, setNumRows] = useState(21);
  const [numCols, setNumCols] = useState(47);

  // Stats
  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [executionTime, setExecutionTime] = useState(null);

  // Mouse Interaction States
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingTarget, setIsDraggingTarget] = useState(false);
  const [drawMode, setDrawMode] = useState(null); // 'draw', 'erase', or null

  // Timeouts reference to clear on reset
  const [animTimeouts, setAnimTimeouts] = useState([]);

  // Initialize grid on mount
  useEffect(() => {
    resetGridState(21, 47);
  }, []);

  const createInitialGrid = (start = startNodePos, target = targetNodePos, rows = numRows, cols = numCols) => {
    const initialGrid = [];
    for (let r = 0; r < rows; r++) {
      const currentRow = [];
      for (let c = 0; c < cols; c++) {
        currentRow.push({
          row: r,
          col: c,
          isStart: r === start.row && c === start.col,
          isTarget: r === target.row && c === target.col,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
          gCost: Infinity,
          hCost: Infinity,
          fCost: Infinity,
          isShortestPath: false,
        });
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  };

  const resetGridState = (rows = numRows, cols = numCols) => {
    clearAllTimeouts();
    const startRow = Math.floor(rows / 2);
    const startCol = Math.floor(cols / 4);
    const targetRow = Math.floor(rows / 2);
    const targetCol = Math.floor(cols * 0.75);

    const initialGrid = createInitialGrid(
      { row: startRow, col: startCol },
      { row: targetRow, col: targetCol },
      rows,
      cols
    );
    setGrid(initialGrid);
    setStartNodePos({ row: startRow, col: startCol });
    setTargetNodePos({ row: targetRow, col: targetCol });
    setVisitedCount(0);
    setPathLength(0);
    setExecutionTime(null);
    setHasPath(false);
    setVisualizingPhase("idle");
    setIsVisualizing(false);
  };

  const handleGridSizeChange = (size) => {
    setGridSize(size);
    let rows = 21;
    let cols = 47;
    if (size === "small") {
      rows = 15;
      cols = 29;
    } else if (size === "large") {
      rows = 25;
      cols = 57;
    }
    setNumRows(rows);
    setNumCols(cols);
    resetGridState(rows, cols);
  };

  const clearPathOnly = (currentGrid) => {
    return currentGrid.map((row) =>
      row.map((node) => ({
        ...node,
        distance: Infinity,
        isVisited: false,
        isShortestPath: false,
        previousNode: null,
        gCost: Infinity,
        hCost: Infinity,
        fCost: Infinity,
      }))
    );
  };

  const clearAllTimeouts = () => {
    animTimeouts.forEach((timeout) => clearTimeout(timeout));
    setAnimTimeouts([]);
  };

  const handleClearPath = () => {
    clearAllTimeouts();
    const clearedGrid = clearPathOnly(grid);
    setGrid(clearedGrid);
    setVisitedCount(0);
    setPathLength(0);
    setExecutionTime(null);
    setHasPath(false);
    setVisualizingPhase("idle");
    setIsVisualizing(false);

    // Clear animations from DOM directly
    const rows = grid.length;
    const cols = grid[0] ? grid[0].length : 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const node = grid[r][c];
        if (!node.isStart && !node.isTarget && !node.isWall) {
          const el = document.getElementById(`node-${r}-${c}`);
          if (el) el.className = "node node-hoverable";
        }
      }
    }
  };

  const handleAlgorithmChange = (algo) => {
    setSelectedAlgorithm(algo);
    if (hasPath) {
      recalculateInstantWithAlgo(algo);
    }
  };

  // Run the selected pathfinder
  const visualizeAlgorithm = () => {
    if (isVisualizing) return;

    clearAllTimeouts();
    const clearedGrid = clearPathOnly(grid);
    
    // Create a deep copy of the grid for the pathfinder to mutate
    const gridClone = clearedGrid.map((row) => row.map((node) => ({ ...node })));

    // Sync baseline classnames in DOM (removes old path before starting animation)
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const node = clearedGrid[r][c];
        if (!node.isStart && !node.isTarget && !node.isWall) {
          const el = document.getElementById(`node-${r}-${c}`);
          if (el) el.className = "node node-hoverable";
        }
      }
    }

    setGrid(clearedGrid);

    const startNode = gridClone[startNodePos.row][startNodePos.col];
    const targetNode = gridClone[targetNodePos.row][targetNodePos.col];

    let visitedNodesInOrder = [];
    const t0 = performance.now();

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(gridClone, startNode, targetNode);
        break;
      case "astar":
        visitedNodesInOrder = astar(gridClone, startNode, targetNode);
        break;
      case "greedy":
        visitedNodesInOrder = greedy(gridClone, startNode, targetNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(gridClone, startNode, targetNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(gridClone, startNode, targetNode);
        break;
      default:
        break;
    }

    const t1 = performance.now();
    const execTime = t1 - t0;

    const shortestPath = getNodesInShortestPathOrder(targetNode);
    const delay = getDelayFromSpeed(speed);

    // Instant Visualization (No animation timeouts)
    if (delay === 0) {
      const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;
      const finalGrid = clearedGrid.map((row, r) =>
        row.map((node, c) => {
          const cloneNode = gridClone[r][c];
          const isVisitedNode = cloneNode.isVisited;
          const isPathNode = pathFound && shortestPath.includes(cloneNode) && !cloneNode.isStart && !cloneNode.isTarget;
          return {
            ...node,
            isVisited: isVisitedNode,
            isShortestPath: isPathNode,
          };
        })
      );
      setGrid(finalGrid);
      setVisitedCount(visitedNodesInOrder.length);
      setPathLength(pathFound ? shortestPath.length : 0);
      setExecutionTime(execTime);
      setHasPath(true);
      setVisualizingPhase(pathFound ? "completed" : "no-path");
      return;
    }

    // Delayed Visualization Loop
    setIsVisualizing(true);
    setVisualizingPhase("searching");
    setVisitedCount(0);
    setPathLength(0);
    setExecutionTime(execTime);

    const timeouts = [];

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        const timeout = setTimeout(() => {
          animateShortestPath(shortestPath, clearedGrid, gridClone, visitedNodesInOrder, timeouts);
        }, i * delay);
        timeouts.push(timeout);
        break;
      }

      const timeout = setTimeout(() => {
        const cloneNode = visitedNodesInOrder[i];
        if (!cloneNode.isStart && !cloneNode.isTarget) {
          const el = document.getElementById(`node-${cloneNode.row}-${cloneNode.col}`);
          if (el) {
            el.className = `node node-visited node-visited-${selectedAlgorithm}`;
          }
        }
        const counterEl = document.getElementById("visited-counter");
        if (counterEl) counterEl.innerText = i + 1;
      }, i * delay);
      timeouts.push(timeout);
    }

    setAnimTimeouts(timeouts);
  };

  const animateShortestPath = (shortestPath, baseGrid, gridClone, visitedNodesInOrder, timeouts) => {
    setVisualizingPhase("pathfinding");

    const startNode = gridClone[startNodePos.row][startNodePos.col];
    const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;

    if (!pathFound) {
      setIsVisualizing(false);
      setVisualizingPhase("no-path");
      setVisitedCount(visitedNodesInOrder.length);
      setPathLength(0);

      const finalGrid = baseGrid.map((row, r) =>
        row.map((node, c) => ({
          ...node,
          isVisited: gridClone[r][c].isVisited,
        }))
      );
      setGrid(finalGrid);
      setHasPath(true);
      return;
    }

    const delay = getDelayFromSpeed(speed);
    const pathSpeed = delay * 1.5 < 15 ? 15 : delay * 1.5;

    for (let i = 0; i < shortestPath.length; i++) {
      const timeout = setTimeout(() => {
        const cloneNode = shortestPath[i];
        if (!cloneNode.isStart && !cloneNode.isTarget) {
          const el = document.getElementById(`node-${cloneNode.row}-${cloneNode.col}`);
          if (el) {
            el.className = "node node-shortest-path";
          }
        }
        const pathCounterEl = document.getElementById("path-counter");
        if (pathCounterEl) pathCounterEl.innerText = i + 1;

        if (i === shortestPath.length - 1) {
          setIsVisualizing(false);
          setVisualizingPhase("completed");
          setHasPath(true);
          setVisitedCount(visitedNodesInOrder.length);
          setPathLength(shortestPath.length);

          const finalGrid = baseGrid.map((row, r) =>
            row.map((node, c) => {
              const cloneNode = gridClone[r][c];
              const isVisitedNode = cloneNode.isVisited;
              const isPathNode = shortestPath.includes(cloneNode) && !cloneNode.isStart && !cloneNode.isTarget;
              return {
                ...node,
                isVisited: isVisitedNode,
                isShortestPath: isPathNode,
              };
            })
          );
          setGrid(finalGrid);
        }
      }, i * pathSpeed);
      timeouts.push(timeout);
    }
  };

  // Instant recalculation on dragging or changing algo
  const recalculateInstant = (newStart, newTarget) => {
    const clearedGrid = clearPathOnly(grid);

    // Apply start/target nodes and clone
    const gridClone = clearedGrid.map((row) =>
      row.map((node) => {
        const isStart = node.row === newStart.row && node.col === newStart.col;
        const isTarget = node.row === newTarget.row && node.col === newTarget.col;
        return {
          ...node,
          isStart,
          isTarget,
          isWall: (isStart || isTarget) ? false : node.isWall,
        };
      })
    );

    const startNode = gridClone[newStart.row][newStart.col];
    const targetNode = gridClone[newTarget.row][newTarget.col];

    let visitedNodesInOrder = [];
    const t0 = performance.now();

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(gridClone, startNode, targetNode);
        break;
      case "astar":
        visitedNodesInOrder = astar(gridClone, startNode, targetNode);
        break;
      case "greedy":
        visitedNodesInOrder = greedy(gridClone, startNode, targetNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(gridClone, startNode, targetNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(gridClone, startNode, targetNode);
        break;
      default:
        break;
    }

    const t1 = performance.now();
    const execTime = t1 - t0;

    const shortestPath = getNodesInShortestPathOrder(targetNode);
    const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;

    const finalGrid = clearedGrid.map((row, r) =>
      row.map((node, c) => {
        const cloneNode = gridClone[r][c];
        const isVisitedNode = cloneNode.isVisited;
        const isPathNode = pathFound && shortestPath.includes(cloneNode) && !cloneNode.isStart && !cloneNode.isTarget;
        return {
          ...node,
          isStart: cloneNode.isStart,
          isTarget: cloneNode.isTarget,
          isWall: cloneNode.isWall,
          isVisited: isVisitedNode,
          isShortestPath: isPathNode,
        };
      })
    );

    setGrid(finalGrid);
    setVisitedCount(visitedNodesInOrder.length);
    setPathLength(pathFound ? shortestPath.length : 0);
    setExecutionTime(execTime);
    setVisualizingPhase(pathFound ? "completed" : "no-path");
  };

  const recalculateInstantWithAlgo = (algo) => {
    const clearedGrid = clearPathOnly(grid);
    const gridClone = clearedGrid.map((row) => row.map((node) => ({ ...node })));

    const startNode = gridClone[startNodePos.row][startNodePos.col];
    const targetNode = gridClone[targetNodePos.row][targetNodePos.col];

    let visitedNodesInOrder = [];
    const t0 = performance.now();

    switch (algo) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(gridClone, startNode, targetNode);
        break;
      case "astar":
        visitedNodesInOrder = astar(gridClone, startNode, targetNode);
        break;
      case "greedy":
        visitedNodesInOrder = greedy(gridClone, startNode, targetNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(gridClone, startNode, targetNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(gridClone, startNode, targetNode);
        break;
      default:
        break;
    }

    const t1 = performance.now();
    const execTime = t1 - t0;

    const shortestPath = getNodesInShortestPathOrder(targetNode);
    const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;

    const finalGrid = clearedGrid.map((row, r) =>
      row.map((node, c) => {
        const cloneNode = gridClone[r][c];
        const isVisitedNode = cloneNode.isVisited;
        const isPathNode = pathFound && shortestPath.includes(cloneNode) && !cloneNode.isStart && !cloneNode.isTarget;
        return {
          ...node,
          isVisited: isVisitedNode,
          isShortestPath: isPathNode,
        };
      })
    );

    setGrid(finalGrid);
    setVisitedCount(visitedNodesInOrder.length);
    setPathLength(pathFound ? shortestPath.length : 0);
    setExecutionTime(execTime);
    setVisualizingPhase(pathFound ? "completed" : "no-path");
  };

  const recalculateInstantWithGrid = (baseGrid, start, target) => {
    const clearedGrid = clearPathOnly(baseGrid);
    const gridClone = clearedGrid.map((row) => row.map((node) => ({ ...node })));

    const startNode = gridClone[start.row][start.col];
    const targetNode = gridClone[target.row][target.col];

    let visitedNodesInOrder = [];
    const t0 = performance.now();

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(gridClone, startNode, targetNode);
        break;
      case "astar":
        visitedNodesInOrder = astar(gridClone, startNode, targetNode);
        break;
      case "greedy":
        visitedNodesInOrder = greedy(gridClone, startNode, targetNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(gridClone, startNode, targetNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(gridClone, startNode, targetNode);
        break;
      default:
        break;
    }

    const t1 = performance.now();
    const execTime = t1 - t0;

    const shortestPath = getNodesInShortestPathOrder(targetNode);
    const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;

    const finalGrid = clearedGrid.map((row, r) =>
      row.map((node, c) => {
        const cloneNode = gridClone[r][c];
        const isVisitedNode = cloneNode.isVisited;
        const isPathNode = pathFound && shortestPath.includes(cloneNode) && !cloneNode.isStart && !cloneNode.isTarget;
        return {
          ...node,
          isVisited: isVisitedNode,
          isShortestPath: isPathNode,
        };
      })
    );

    setGrid(finalGrid);
    setVisitedCount(visitedNodesInOrder.length);
    setPathLength(pathFound ? shortestPath.length : 0);
    setExecutionTime(execTime);
    setVisualizingPhase(pathFound ? "completed" : "no-path");
  };

  // Node mouse action bindings
  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;

    const node = grid[row][col];
    if (node.isStart) {
      setIsDraggingStart(true);
    } else if (node.isTarget) {
      setIsDraggingTarget(true);
    } else {
      setIsMouseDown(true);
      const newMode = node.isWall ? "erase" : "draw";
      setDrawMode(newMode);
      setWallState(row, col, newMode === "draw");
    }
  };

  const handleMouseEnter = (row, col) => {
    if (isVisualizing) return;

    if (isDraggingStart) {
      const node = grid[row][col];
      if (node.isTarget || node.isWall) return;

      setStartNodePos({ row, col });

      if (hasPath) {
        recalculateInstant({ row, col }, targetNodePos);
      } else {
        setGrid((prev) =>
          prev.map((r) =>
            r.map((n) => ({
              ...n,
              isStart: n.row === row && n.col === col,
            }))
          )
        );
      }
    } else if (isDraggingTarget) {
      const node = grid[row][col];
      if (node.isStart || node.isWall) return;

      setTargetNodePos({ row, col });

      if (hasPath) {
        recalculateInstant(startNodePos, { row, col });
      } else {
        setGrid((prev) =>
          prev.map((r) =>
            r.map((n) => ({
              ...n,
              isTarget: n.row === row && n.col === col,
            }))
          )
        );
      }
    } else if (isMouseDown && drawMode) {
      const node = grid[row][col];
      if (node.isStart || node.isTarget) return;
      setWallState(row, col, drawMode === "draw");
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsDraggingStart(false);
    setIsDraggingTarget(false);
    setDrawMode(null);
  };

  const setWallState = (row, col, shouldBeWall) => {
    // Avoid redundant state updates and recalculations
    const node = grid[row][col];
    if (node.isWall === shouldBeWall) return;

    const updatedGrid = grid.map((r) =>
      r.map((n) => {
        if (n.row === row && n.col === col) {
          if (shouldBeWall && (n.isStart || n.isTarget)) return n;
          return { ...n, isWall: shouldBeWall };
        }
        return n;
      })
    );

    if (hasPath) {
      recalculateInstantWithGrid(updatedGrid, startNodePos, targetNodePos);
    } else {
      setGrid(updatedGrid);
    }
  };

  return (
    <div className="app-container">
      <Header
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={handleAlgorithmChange}
        isVisualizing={isVisualizing}
        speed={speed}
        setSpeed={setSpeed}
        onVisualize={visualizeAlgorithm}
        onClearGrid={() => resetGridState(numRows, numCols)}
        onClearPath={handleClearPath}
        hasPath={hasPath}
        gridSize={gridSize}
        onChangeGridSize={handleGridSizeChange}
      />

      <main className="main-content">
        <section className="grid-panel glass-panel">
          <div className="card-header">
            <h2 className="card-title">Grid Explorer</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Drag pins to re-position. Click/drag on empty cells to paint obstacles.
            </span>
          </div>
          
          {grid.length > 0 && (
            <Grid
              grid={grid}
              selectedAlgorithm={selectedAlgorithm}
              isVisualizing={isVisualizing}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          )}

          <Legend selectedAlgorithm={selectedAlgorithm} />
        </section>

        <Sidebar
          selectedAlgorithm={selectedAlgorithm}
          visitedCount={visitedCount}
          pathLength={pathLength}
          executionTime={executionTime}
          isVisualizing={isVisualizing}
          visualizingPhase={visualizingPhase}
        />
      </main>
    </div>
  );
}
