import React from "react";

const Node = React.memo(({
  row,
  col,
  isStart,
  isTarget,
  isWall,
  isVisited,
  isShortestPath,
  selectedAlgorithm,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  let extraClassName = "";
  if (isTarget) extraClassName = "node-target";
  else if (isStart) extraClassName = "node-start";
  else if (isWall) extraClassName = "node-wall";
  else if (isShortestPath) extraClassName = "node-shortest-path";
  else if (isVisited) extraClassName = `node-visited node-visited-${selectedAlgorithm}`;

  const isInteractive = !isStart && !isTarget;

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName} ${isInteractive ? "node-hoverable" : ""}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    >
      {isStart && <div className="node-start-icon" />}
      {isTarget && <div className="node-target-icon" />}
    </div>
  );
});

Node.displayName = "Node";

export default Node;
