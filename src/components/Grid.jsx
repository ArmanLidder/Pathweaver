import React from "react";
import Node from "./Node";

export default function Grid({
  grid,
  selectedAlgorithm,
  isVisualizing,
  isInstant,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  const numRows = grid.length;
  const numCols = grid[0] ? grid[0].length : 0;

  return (
    <div className="grid-container" onMouseLeave={onMouseUp}>
      <div
        className={`grid ${isInstant ? "grid-instant" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${numCols}, 25px)`,
          gridTemplateRows: `repeat(${numRows}, 25px)`,
          pointerEvents: isVisualizing ? "none" : "auto",
        }}
      >
        {grid.map((row, rowIdx) => {
          return (
            <React.Fragment key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isStart, isTarget, isWall, isVisited, isShortestPath } = node;
                return (
                  <Node
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isTarget={isTarget}
                    isWall={isWall}
                    isVisited={isVisited}
                    isShortestPath={isShortestPath}
                    selectedAlgorithm={selectedAlgorithm}
                    onMouseDown={onMouseDown}
                    onMouseEnter={onMouseEnter}
                    onMouseUp={onMouseUp}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
