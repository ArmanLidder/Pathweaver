# Pathweaver

A minimalist, high-performance pathfinding algorithm visualizer built with React and Vite. It provides a typographic, distraction-free playground to explore, test, and compare the behavior of classic search algorithms on a configurable 2D grid.

**Live Deployment**: [https://ArmanLidder.github.io/Pathweaver/](https://ArmanLidder.github.io/Pathweaver/)

---

## Features

*   **Interactive Node Manipulation**: Drag and drop the Start and Target terminals. If a path is already solved, dragging the terminals instantly updates and recalculates the path around obstacles.
*   **Obstacle Painting**: Click and drag on empty cells to paint walls. Toggle between draw and erase modes.
*   **Random Maze Generator**: Generates a randomized obstacle layout with ~30% wall density instantly, clearing previous search paths and preserving terminal pins.
*   **Variable Grid Sizes**: Switch dynamically between Small (15 x 29), Medium (21 x 47), and Large (25 x 57) layouts.
*   **Speed Control**: Adjust traversal velocity from slow-mo (120ms delay per step) up to instant calculation (0ms delay).
*   **Unweighted Pathfinding**:
    *   **Dijkstra's Algorithm**: Concentric ring relaxation. Guarantees the shortest path.
    *   **A* Search**: Heuristic-guided search utilizing Manhattan distance. Guarantees the shortest path.
    *   **Greedy Best-First Search**: Heuristic-only pathfinder. Faster but does not guarantee the shortest path.
    *   **Breadth-First Search (BFS)**: Level-by-level search queue. Guarantees the shortest path.
    *   **Depth-First Search (DFS)**: Deep branch search stack. Does not guarantee the shortest path.
*   **Live Metrics Dashboard**: Track explored node count, path length, and execution time (in milliseconds) in real-time.

---

## Getting Started

### Prerequisites

Ensure Node.js (version 18 or higher) is installed on your machine.

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/ArmanLidder/Pathweaver.git
   cd Pathweaver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server locally:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the address displayed in the console (usually `http://localhost:5173`).

---

## Build & Production

To bundle the application into static production assets:
```bash
npm run build
```
This compiles the code into the `dist/` directory, optimized and ready for hosting on static hosting platforms.

---

## Folder Structure

```
pathweaver/
├── src/
│   ├── algorithms/       # Core pathfinders (dijkstra, astar, bfs, etc.)
│   ├── components/       # UI elements (Header, Sidebar, Grid, Node, Legend)
│   ├── App.jsx           # Root container managing layout and state
│   ├── main.jsx          # Vite React mount entrypoint
│   └── index.css         # Minimalist Zinc-dark styling and animations
├── index.html            # Main HTML document template
├── package.json          # Dependency configurations and scripts
└── vite.config.js        # Vite bundling and server settings
```
