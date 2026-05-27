# Pathweaver

Pathweaver is an elegant, high-performance, and minimalist pathfinding algorithm visualizer built with **React** and **Vite**. It provides a typographic, distraction-free playground to explore, test, and compare the behavior of classic search algorithms on a configurable 2D grid.

---

## ✨ Features

*   **Interactive Node Manipulation**: Drag and drop the **Start** and **Target** terminals in real-time. If a path is already solved, dragging the terminals instantly updates and bends the path around existing walls.
*   **Obstacle Painting**: Click and drag on empty cells to paint walls. Toggle between draw and erase modes smoothly.
*   **Random Maze Generator**: Generates a randomized obstacle layout with ~30% wall density instantly, clearing previous search paths and preserving terminal pins.
*   **Variable Grid Sizes**: Switch dynamically between **Small** (15 x 29), **Medium** (21 x 47), and **Large** (25 x 57) layouts.
*   **Speed Control**: Adjust traversal velocity from slow-mo (120ms delay per step) up to instant calculation (0ms delay).
*   **Unweighted Pathfinding**:
    *   **Dijkstra's Algorithm**: Concentric ring relaxation. Guarantees the shortest path.
    *   **A* Search**: Heuristic-guided search utilizing Manhattan distance. Guarantees the shortest path.
    *   **Greedy Best-First Search**: Heuristic-only pathfinder. Faster but does not guarantee the shortest path.
    *   **Breadth-First Search (BFS)**: Level-by-level search queue. Guarantees the shortest path.
    *   **Depth-First Search (DFS)**: Deep branch search stack. Does not guarantee the shortest path and is highly inefficient.
*   **Live Metrics Dashboard**: Track explored node count, path length, and execution time (in milliseconds) on the fly.

---

## 🎨 Design Philosophy

Pathweaver follows a premium, minimalist **Zinc-dark theme** (`#09090b` background / `#fafafa` typography), stripping away heavy glassmorphic borders and neon glows.
*   **Flat Aesthetics**: Cells are flat and borderless with thin `#18181b` grid lines.
*   **Fluid Transitions**: Node search waves animate using soft, flat color fades corresponding to each algorithm, avoiding aggressive scaling or blinking.
*   **Typographic Controls**: Dropdowns, ranges, and buttons are designed with high-contrast text alignments for a sleek developer-tool feel.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18 or higher is recommended).

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd pathweaver
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

## 🛠️ Build & Production

To bundle the application into static production assets:
```bash
npm run build
```
This compiles the code into the `dist/` directory, optimized and ready for zero-config hosting on platforms like Vercel, Netlify, or GitHub Pages.

---

## 📁 Folder Structure

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
