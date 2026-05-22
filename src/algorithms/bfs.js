import { getUnvisitedNeighbors } from "./dijkstra";

export function bfs(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    if (currentNode === targetNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}
