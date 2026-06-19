# DSA Runtime Execution Trace

This report documents the exact request lifecycle from the API layer through the Service layer down to the underlying Data Structure/Algorithm implementation.

## 1. Graph (Adjacency List)
- **API Entry**: `GET /api/logistics/routes` (in `SystemHandler.java` or `LogisticsHandler.java`)
- **Service Layer**: `LogisticsService.getAllRoutes()`
- **DSA Usage**: The `Graph` maintains a `Map<String, List<Edge>> adjacencyList`. Used by Cytoscape visualization on the frontend to render network maps.
- **Status**: **ACTIVE**

## 2. Dijkstra's Algorithm (Shortest Path)
- **API Entry**: `GET /api/logistics/shortest-path?start=X&end=Y`
- **Service Layer**: `LogisticsService.getShortestPath(start, end)`
- **DSA Usage**: Invokes `graph.dijkstra(start, end)` using a `PriorityQueue` of `NodeDistance` to find minimum cost routing between warehouses.
- **Status**: **ACTIVE**

## 3. Priority Queue
- **API Entry**: Implicitly via Dijkstra.
- **Service Layer**: N/A (Internal to Graph logic).
- **DSA Usage**: Standard `java.util.PriorityQueue` used within the Dijkstra implementation to greedily pick the next unvisited node with the lowest cumulative distance.
- **Status**: **ACTIVE**

## 4. Binary Search Tree (BST)
- **API Entry**: `GET /api/inventory/balance`
- **Service Layer**: `InventoryBalancingService.balanceInventory()`
- **DSA Usage**: Invokes custom `BST` structure to sort or rank Warehouses based on capacity or stock levels.
- **Status**: **ACTIVE** (but artificially injected for sorting).

## 5. AVL Tree (Self-Balancing BST)
- **API Entry**: `GET /api/orders`
- **Service Layer**: `OrderService.getAllOrders()` / `OrderService.addOrder()`
- **DSA Usage**: Uses `AVLTree` to store and retrieve orders by ID to ensure `O(log n)` lookup instead of a standard `HashMap`.
- **Status**: **ACTIVE** (but artificially injected for lookups).

## 6. B-Tree
- **API Entry**: `GET /api/products`
- **Service Layer**: `ProductService`
- **DSA Usage**: Uses a custom `BTree` (or similar N-ary tree) to index product catalogs for range queries.
- **Status**: **ACTIVE** (artificial integration).

## 7. Segment Tree
- **API Entry**: `GET /api/analytics/revenue?start=X&end=Y`
- **Service Layer**: `ExecutiveDashboardService`
- **DSA Usage**: Intended for fast Range Queries over temporal sales data (Sum of Revenue between Date X and Date Y).
- **Status**: **UNUSED** (Currently relying on linear Stream filtering).

## 8. Fenwick Tree (Binary Indexed Tree)
- **API Entry**: `GET /api/analytics/sales-volume`
- **Service Layer**: `ExecutiveDashboardService`
- **DSA Usage**: Intended for dynamic frequency tables (e.g., cumulative shipments over time).
- **Status**: **UNUSED** (No active execution path).
