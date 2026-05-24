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

const START_NODE_ROW = 10;
const START_NODE_COL = 8;
const TARGET_NODE_ROW = 10;
const TARGET_NODE_COL = 38;
const NUM_ROWS = 21;
const NUM_COLS = 47;

export default function App() {
  const [grid, setGrid] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra");
  const [speed, setSpeed] = useState(10); // delay in ms, 1 = instant
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizingPhase, setVisualizingPhase] = useState("idle"); // 'idle', 'searching', 'pathfinding', 'completed', 'no-path'
  const [hasPath, setHasPath] = useState(false);

  // Start & Target positions
  const [startNodePos, setStartNodePos] = useState({ row: START_NODE_ROW, col: START_NODE_COL });
  const [targetNodePos, setTargetNodePos] = useState({ row: TARGET_NODE_ROW, col: TARGET_NODE_COL });

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
    resetGridState();
  }, []);

  const createInitialGrid = (start = startNodePos, target = targetNodePos) => {
    const initialGrid = [];
    for (let r = 0; r < NUM_ROWS; r++) {
      const currentRow = [];
      for (let c = 0; c < NUM_COLS; c++) {
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

  const resetGridState = () => {
    clearAllTimeouts();
    const initialGrid = createInitialGrid(
      { row: START_NODE_ROW, col: START_NODE_COL },
      { row: TARGET_NODE_ROW, col: TARGET_NODE_COL }
    );
    setGrid(initialGrid);
    setStartNodePos({ row: START_NODE_ROW, col: START_NODE_COL });
    setTargetNodePos({ row: TARGET_NODE_ROW, col: TARGET_NODE_COL });
    setVisitedCount(0);
    setPathLength(0);
    setExecutionTime(null);
    setHasPath(false);
    setVisualizingPhase("idle");
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

    // Clear animations from DOM directly
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
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
    const resetGrid = clearPathOnly(grid);
    setGrid(resetGrid);

    // Sync baseline classnames in DOM (removes old path before starting animation)
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        const node = resetGrid[r][c];
        if (!node.isStart && !node.isTarget && !node.isWall) {
          const el = document.getElementById(`node-${r}-${c}`);
          if (el) el.className = "node node-hoverable";
        }
      }
    }

    const startNode = resetGrid[startNodePos.row][startNodePos.col];
    const targetNode = resetGrid[targetNodePos.row][targetNodePos.col];

    let visitedNodesInOrder = [];
    const t0 = performance.now();

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(resetGrid, startNode, targetNode);
        break;
      case "astar":
        visitedNodesInOrder = astar(resetGrid, startNode, targetNode);
        break;
      case "greedy":
        visitedNodesInOrder = greedy(resetGrid, startNode, targetNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(resetGrid, startNode, targetNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(resetGrid, startNode, targetNode);
        break;
      default:
        break;
    }

    const t1 = performance.now();
    const execTime = t1 - t0;

    const shortestPath = getNodesInShortestPathOrder(targetNode);

    // Instant Visualization (No animation timeouts)
    if (speed === 1) {
      const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;
      const finalGrid = resetGrid.map((row) =>
        row.map((node) => {
          const isVisitedNode = visitedNodesInOrder.includes(node);
          const isPathNode = pathFound && shortestPath.includes(node) && !node.isStart && !node.isTarget;
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
          animateShortestPath(shortestPath, resetGrid, visitedNodesInOrder, timeouts);
        }, i * speed);
        timeouts.push(timeout);
        break;
      }

      const timeout = setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isTarget) {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
          if (el) {
            el.className = `node node-visited node-visited-${selectedAlgorithm}`;
          }
        }
        const counterEl = document.getElementById("visited-counter");
        if (counterEl) counterEl.innerText = i + 1;
      }, i * speed);
      timeouts.push(timeout);
    }

    setAnimTimeouts(timeouts);
  };

  const animateShortestPath = (shortestPath, baseGrid, visitedNodesInOrder, timeouts) => {
    setVisualizingPhase("pathfinding");

    const startNode = baseGrid[startNodePos.row][startNodePos.col];
    const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;

    if (!pathFound) {
      setIsVisualizing(false);
      setVisualizingPhase("no-path");
      setVisitedCount(visitedNodesInOrder.length);
      setPathLength(0);

      const finalGrid = baseGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isVisited: visitedNodesInOrder.includes(node),
        }))
      );
      setGrid(finalGrid);
      setHasPath(true);
      return;
    }

    const pathSpeed = speed * 1.5 < 15 ? 15 : speed * 1.5;

    for (let i = 0; i < shortestPath.length; i++) {
      const timeout = setTimeout(() => {
        const node = shortestPath[i];
        if (!node.isStart && !node.isTarget) {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
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

          const finalGrid = baseGrid.map((row) =>
            row.map((node) => {
              const isVisitedNode = visitedNodesInOrder.includes(node);
              const isPathNode = shortestPath.includes(node) && !node.isStart && !node.isTarget;
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
    const resetGrid = clearPathOnly(grid);

    // Apply start/target nodes
    const updatedGrid = resetGrid.map((row) =>
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

    const startNode = updatedGrid[newStart.row][newStart.col];
    const targetNode = updatedGrid[newTarget.row][newTarget.col];

    let visitedNodesInOrder = [];
    const t0 = performance.now();

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(updatedGrid, startNode, targetNode);
        break;
      case "astar":
        visitedNodesInOrder = astar(updatedGrid, startNode, targetNode);
        break;
      case "greedy":
        visitedNodesInOrder = greedy(updatedGrid, startNode, targetNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(updatedGrid, startNode, targetNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(updatedGrid, startNode, targetNode);
        break;
      default:
        break;
    }

    const t1 = performance.now();
    const execTime = t1 - t0;

    const shortestPath = getNodesInShortestPathOrder(targetNode);
    const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;

    const finalGrid = updatedGrid.map((row) =>
      row.map((node) => {
        const isVisitedNode = visitedNodesInOrder.includes(node);
        const isPathNode = pathFound && shortestPath.includes(node) && !node.isStart && !node.isTarget;
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

  const recalculateInstantWithAlgo = (algo) => {
    const resetGrid = clearPathOnly(grid);
    const startNode = resetGrid[startNodePos.row][startNodePos.col];
    const targetNode = resetGrid[targetNodePos.row][targetNodePos.col];

    let visitedNodesInOrder = [];
    const t0 = performance.now();

    switch (algo) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(resetGrid, startNode, targetNode);
        break;
      case "astar":
        visitedNodesInOrder = astar(resetGrid, startNode, targetNode);
        break;
      case "greedy":
        visitedNodesInOrder = greedy(resetGrid, startNode, targetNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(resetGrid, startNode, targetNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(resetGrid, startNode, targetNode);
        break;
      default:
        break;
    }

    const t1 = performance.now();
    const execTime = t1 - t0;

    const shortestPath = getNodesInShortestPathOrder(targetNode);
    const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;

    const finalGrid = resetGrid.map((row) =>
      row.map((node) => {
        const isVisitedNode = visitedNodesInOrder.includes(node);
        const isPathNode = pathFound && shortestPath.includes(node) && !node.isStart && !node.isTarget;
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
    const resetGrid = clearPathOnly(baseGrid);
    const startNode = resetGrid[start.row][start.col];
    const targetNode = resetGrid[target.row][target.col];

    let visitedNodesInOrder = [];
    const t0 = performance.now();

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(resetGrid, startNode, targetNode);
        break;
      case "astar":
        visitedNodesInOrder = astar(resetGrid, startNode, targetNode);
        break;
      case "greedy":
        visitedNodesInOrder = greedy(resetGrid, startNode, targetNode);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(resetGrid, startNode, targetNode);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(resetGrid, startNode, targetNode);
        break;
      default:
        break;
    }

    const t1 = performance.now();
    const execTime = t1 - t0;

    const shortestPath = getNodesInShortestPathOrder(targetNode);
    const pathFound = shortestPath.length > 1 && shortestPath[0] === startNode;

    const finalGrid = resetGrid.map((row) =>
      row.map((node) => {
        const isVisitedNode = visitedNodesInOrder.includes(node);
        const isPathNode = pathFound && shortestPath.includes(node) && !node.isStart && !node.isTarget;
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
        onClearGrid={resetGridState}
        onClearPath={handleClearPath}
        hasPath={hasPath}
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
