import { getUnvisitedNeighbors } from "./dijkstra";

export function dfs(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];

  while (stack.length > 0) {
    const currentNode = stack.pop();

    if (currentNode.isWall) continue;
    if (currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === targetNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}
