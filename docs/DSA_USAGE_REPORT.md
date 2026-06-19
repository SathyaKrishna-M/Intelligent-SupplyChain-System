# DSA Integrity Audit

## Graph & Dijkstra
- **Status**: ACTUALLY USED
- **Path**: `Graph.java` implements adjacency lists. Used heavily in `LogisticsService` and Cytoscape visualization. Fixes applied to directed vs undirected edges verify its use.

## Binary Search Tree (BST)
- **Status**: PARTIALLY USED / ARTIFICIALLY USED
- **Analysis**: Check implementations like `InventoryBalancingService`. Often used to sort warehouses, but standard `Collections.sort()` would have sufficed. Included for academic showcase.

## AVL Tree
- **Status**: UNUSED / ARTIFICIALLY USED
- **Analysis**: Often found in `PurchaseRequestService` or similar, used redundantly to store duplicate IDs that are already in HashMaps.

## Segment Tree / Fenwick Tree
- **Status**: UNUSED
- **Analysis**: No active code paths utilize Range Query aggregations for sales, relying instead on linear `Stream.filter()` in `AnalyticsHandler`.
