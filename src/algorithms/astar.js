import { getUnvisitedNeighbors } from "./dijkstra";

export function astar(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  startNode.gCost = 0;
  startNode.hCost = getManhattanDistance(startNode, targetNode);
  startNode.fCost = startNode.gCost + startNode.hCost;

  const openSet = [startNode];
  const closedSet = new Set();

  while (openSet.length > 0) {
    // Find node with lowest fCost (and hCost as a tiebreaker)
    openSet.sort((nodeA, nodeB) => {
      if (nodeA.fCost === nodeB.fCost) {
        return nodeA.hCost - nodeB.hCost;
      }
      return nodeA.fCost - nodeB.fCost;
    });

    const currentNode = openSet.shift();
    
    if (currentNode.isWall) continue;
    
    // Mark as visited/closed
    currentNode.isVisited = true;
    closedSet.add(currentNode);
    visitedNodesInOrder.push(currentNode);

    // If we've reached the target, we are done
    if (currentNode === targetNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeGCost = currentNode.gCost + 1;

      if (tentativeGCost < neighbor.gCost) {
        neighbor.previousNode = currentNode;
        neighbor.gCost = tentativeGCost;
        neighbor.hCost = getManhattanDistance(neighbor, targetNode);
        neighbor.fCost = neighbor.gCost + neighbor.hCost;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

function getManhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}
