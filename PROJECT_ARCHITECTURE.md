# Architecture & DSA Integration

This platform is uniquely built from scratch without reliance on Spring Boot, Hibernate, or MySQL. 

## Architectural Layers
1. **API Layer (`/api`)**: A lightweight, multi-threaded `HttpServer` handling CORS and RESTful JSON serialization.
2. **Controller/Service Layer (`/services`)**: Enforces business logic (e.g. `LogisticsService.java` orchestrating driver assignments based on graph shortest-paths).
3. **Data Structure Layer (`/datastructures`)**: In-memory caching and indexing using Advanced Trees to ensure O(log N) lookup times.
4. **Storage Layer (`/storage`)**: `FileManager.java` handling disk I/O, converting POJOs to delimited string rows safely.

## Core Data Structures Utilized
- **AVL Tree**: Self-balancing Binary Search tree utilized for `ProductName` indexing. Maintains strict balancing (O(log N)) during heavy insertions.
- **Binary Search Tree (BST)**: Utilized for `ProductID` indexing.
- **B-Tree**: Disk-friendly wide tree utilized for `Orders`. Nodes split intelligently mimicking modern Database engines.
- **Segment Tree**: Used in the `Analytics` module to calculate Range Minimum/Maximum Queries (e.g. "What is the lowest stock item across Warehouses 1 through 5?").
- **Fenwick Tree (Binary Indexed Tree)**: Used for prefix sum aggregations (e.g. calculating total revenue up to a specific date).
- **Adjacency List Graph**: Maps the entire Supply Chain Network.
- **Min-Heap Priority Queue**: Powers the graph traversal logic.

## Core Algorithms
- **Dijkstra's Algorithm**: Powers the routing engine to automatically assign the lowest-cost path to drivers between warehouses.
- **Simple Moving Average (SMA)**: Drives the AI/Forecasting module.
