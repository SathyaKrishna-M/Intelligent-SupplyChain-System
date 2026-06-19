# Implementation Plan: Supply Chain Simulation Center

## Goal
Build a premium, highly interactive Supply Chain Simulation Center at `/simulation`. This page will visually demonstrate the end-to-end lifecycle of the supply chain workflow (Inventory -> Purchasing -> Approval -> Fulfillment -> Delivery), while explicitly highlighting which Data Structures and Algorithms (DSA) are utilized at each stage.

## Proposed Architecture

### 1. New Route & Navigation
- **`AppRouter.jsx`**: We will add a new `<Route path="/simulation" element={<SimulationCenter />} />` accessible by all roles (or specifically ADMIN/Logistics).
- **`Sidebar.jsx`**: We will add a new menu item for "Simulation Center" featuring an animated "Play" or "Cpu" icon to draw attention to this being the demo center.

### 2. `SimulationCenter.jsx` (Main Page)
This will be a premium dark-mode, glassmorphic command center.
- **Header**: Title, Scenario Selector (Low Stock, High Demand, etc.), and Global Metrics (Total Distance, Processed Orders, Elapsed Time).
- **Control Panel**: Run, Pause, Resume, Reset, and Speed Selectors (1x, 2x, 5x).
- **State Machine Engine**: A React `useEffect` interval loop that steps through the 9 simulation stages sequentially when "Run" is clicked, obeying the chosen speed multiplier.
- **Central Visualization**: A unified layout displaying the timeline and updating global metrics.

### 3. `SimulationStep.jsx` (Reusable Component)
A highly polished, Framer Motion-powered card for each stage.
- **Visuals**: Displays the step Title, Description, Icon, and Timestamp.
- **States**: 
  - `future`: Grayed out, minimal opacity.
  - `active`: Glowing Blue Pulse border, highlighting algorithm in use.
  - `completed`: Solid Green border, checkmark icon.
- **DSA Callout**: A distinct side-badge identifying the algorithm (e.g., *AVL Tree* for Inventory, *Dijkstra* for Shortest Path) that illuminates when the step is active.

### 4. Simulation Stages (The Workflow)
The state machine will progress through:
1. **Inventory Check** (AVL Tree)
2. **Low Stock Detection** (Priority Queue)
3. **Purchase Request**
4. **Supplier Approval**
5. **Order Creation** (B-Tree)
6. **Shipment Creation** 
7. **Driver Assignment** 
8. **Route Optimization** (Graph & Dijkstra)
9. **Delivery & Analytics Sync** (Fenwick/Segment Trees)

## Verification Plan
1. **Visual Fidelity**: Validate that glassmorphism, glows, and Framer Motion animations match premium SaaS standards.
2. **Responsive Design**: Verify the grid transforms cleanly to single-column layouts on mobile and tablet.
3. **State Machine**: Test Play, Pause, Speed Selection, and Reset to ensure the simulation loop is robust and free of memory leaks.

> [!TIP]
> Since this is a pure frontend demonstration page, it will not require modifying or interfering with the live backend APIs or actual database logic. It will act as an interactive "digital twin" sandbox for presentation purposes.

Please review this plan. Once approved, I will begin building out these premium UI components!
