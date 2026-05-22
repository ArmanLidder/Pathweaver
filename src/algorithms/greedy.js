import { getUnvisitedNeighbors } from "./dijkstra";

export function greedy(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  startNode.hCost = getManhattanDistance(startNode, targetNode);

  const openSet = [startNode];
  const closedSet = new Set();

  while (openSet.length > 0) {
    // Sort openSet purely by hCost (distance to target)
    openSet.sort((nodeA, nodeB) => nodeA.hCost - nodeB.hCost);

    const currentNode = openSet.shift();

    if (currentNode.isWall) continue;
    
    currentNode.isVisited = true;
    closedSet.add(currentNode);
    visitedNodesInOrder.push(currentNode);

    if (currentNode === targetNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) continue;

      if (!openSet.includes(neighbor)) {
        neighbor.previousNode = currentNode;
        neighbor.hCost = getManhattanDistance(neighbor, targetNode);
        openSet.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}

function getManhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}
