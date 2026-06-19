# Intelligent Supply Chain & Inventory Optimization System
## Technical Project Documentation

---

## 1. Executive Summary

### Problem Statement
Modern supply chains struggle with fragmented data, inefficient logistics routing, and suboptimal inventory tracking. Traditional systems rely on sluggish relational database queries for real-time analytics, resulting in delayed decision-making, poor warehouse space utilization, and higher logistics costs.

### Project Objectives
To engineer a robust, full-stack Supply Chain Management system that leverages advanced Data Structures and Algorithms (DSA) in-memory to dramatically reduce query times and optimize operational efficiency.

### Key Features
- **Real-Time Inventory Management**: Instantaneous search, addition, and deletion of products.
- **Logistics Route Optimization**: Finding the shortest paths for warehouse-to-warehouse shipping.
- **Executive Analytics Dashboard**: $O(\log N)$ real-time computations for revenue, shipments, and inventory segments.
- **Priority Order Fulfillment**: Processing urgent delivery orders ahead of standard orders.
- **Role-Based Access Control**: Guarded routes for Admins, Warehouse Managers, and Suppliers.

### Target Users
- **Executives / Admins**: Real-time business intelligence and oversight.
- **Warehouse Managers**: Inventory tracking and reorder management.
- **Logistics Managers**: Shipment driver assignment and route monitoring.

### Business Benefits
- **Reduced Latency**: By keeping data in optimized in-memory DSAs, analytics queries are near-instant.
- **Cost Reduction**: Optimized driver routes reduce fuel costs and delivery times.
- **Improved Responsiveness**: Priority queuing ensures SLAs on critical orders are met.

---

## 2. System Architecture

The project utilizes a strict Layered Architecture to enforce separation of concerns, ensuring that the User Interface, HTTP networking, Business Logic, and Data Persistence are heavily decoupled.

```ascii
+-------------------------------------------------------------+
|                        FRONTEND (React)                     |
|  [ Pages ] <--> [ Components ] <--> [ Contexts / Hooks ]    |
|                          |                                  |
|                          v                                  |
|                 [ Axios API Service ]                       |
+--------------------------|----------------------------------+
                           | HTTP / JSON over REST
+--------------------------|----------------------------------+
|                        BACKEND (Java)                       |
|                          v                                  |
|                    [ API Layer ]                            |
|       (HttpServer, Handlers, Request Parsing)               |
|                          |                                  |
|                          v                                  |
|                  [ Service Layer ]                          |
|    (Business Logic, Validation, Analytics Computation)      |
|                          |                                  |
|                          v                                  |
|                 [ Data Structures Layer ]                   |
|     (BST, AVL, B-Tree, Graph, PriorityQueue, Trees)         |
|                          |                                  |
|                          v                                  |
|                  [ Storage Layer ]                          |
|         (FileManager, CSV/Text Persistence I/O)             |
+-------------------------------------------------------------+
```

### Complete Data Flow
1. **User Action**: The user clicks a button in the React UI (e.g., "Add Product").
2. **Frontend Request**: Axios serializes the request into JSON and sends a POST request.
3. **Backend API**: `ApiServer` intercepts the request and routes it to `ProductHandler`.
4. **Service Logic**: `ProductHandler` validates the payload and calls `ProductService.addProduct()`.
5. **Data Structure**: `ProductService` inserts the Product into the `ProductBST` (In-Memory).
6. **Storage**: `ProductService` delegates a save event to `FileManager` to append the product to `/data/products.txt`.
7. **Response**: A 201 Created JSON response bubbles back up to the Frontend to update the React State.

---

## 3. Directory Structure

### Backend Structure (`src/`)
- **`api/`**: Contains the `ApiServer` setup and HTTP Handlers (`ProductHandler`, `OrderHandler`, etc.). Responsible for interpreting HTTP methods and mapping them to services.
- **`services/`**: The core Business Logic layer. Orchestrates interactions between different data structures (e.g., `LogisticsService`, `ExecutiveDashboardService`).
- **`datastructures/`**: Custom-built Data Structures powering the application (Graphs, Trees, Queues).
- **`models/`**: POJO (Plain Old Java Object) classes defining the entity schemas (`Product`, `Order`, `Shipment`).
- **`storage/`**: Contains `FileManager.java`, responsible for reading/writing to the local filesystem.
- **`algorithms/`**: (Integrated within datastructures) Contains specific algorithmic logic like `Dijkstra.java`.

### Frontend Structure (`frontend/src/`)
- **`pages/`**: Top-level route components representing full screen views (`Dashboard.jsx`, `Inventory.jsx`, `Login.jsx`).
- **`components/`**: Reusable UI elements (`DataTable.jsx`, `Modal.jsx`, `charts/`).
- **`layouts/`**: Structural wrappers (`DashboardLayout.jsx`, `Sidebar.jsx`, `Topbar.jsx`).
- **`contexts/`**: React Context providers (`AuthContext.jsx` for global state).
- **`router/`**: Route definitions and `ProtectedRoutes` guarding.
- **`services/`**: Axios interceptors and network communication logic (`api.js`).

---

## 4. Backend Packages Explained

- **API Layer**: Implemented using pure Java `com.sun.net.httpserver.HttpServer`. 
  - **Handlers**: Each domain has its own handler (e.g., `SupplierHandler`, `AnalyticsHandler`). They parse URL parameters, read JSON request bodies using custom `JsonUtil`, invoke the Service layer, and return HTTP status codes.
- **Service Layer**: Houses the operational logic. For example, `LogisticsService` checks if a route exists before creating a shipment.
- **Models**: Defines the properties and enums representing business entities.
- **Storage**: `FileManager` reads the `/data` directory upon startup, parsing CSV/Text lines into Java Objects and feeding them into the Data Structures. 

---

## 5. Frontend React Architecture

The frontend is built on **React 18** and powered by the **Vite** bundler for rapid hot-module replacement and optimized production builds.

- **Routing & Protected Routes**: Uses `react-router-dom`. Routes are wrapped in a `<ProtectedRoute>` component that checks the `AuthContext`. If a user is not authenticated or lacks the required role (e.g., Supplier trying to access Admin dashboard), they are redirected.
- **Context API**: `AuthContext` manages the global user session, storing the JWT/User object and exposing `login()` and `logout()` functions to all components.
- **Axios**: Configured in `services/api.js` with base URLs and interceptors to automatically attach authentication headers.
- **Component Reuse**: Highly modular design. The `DataTable.jsx` component is reused across Inventory, Suppliers, Orders, and Shipments by simply passing different column configurations and data props.
- **Visualizations**: Incorporates `recharts` for Dashboards and `vis-network` for interactive Graph rendering.
- **Dark Mode**: Managed globally via Tailwind CSS `dark:` variant classes and state toggles.

---

## 6. Data Structures & Algorithms (DSA) Integration

The project bypasses traditional SQL databases in favor of custom in-memory Data Structures to guarantee maximum educational value and runtime efficiency.

### 1. Binary Search Tree (BST)
- **Purpose**: Fast lookup, insertion, and ordered traversal of products.
- **Location**: `datastructures.product.BST`
- **Operations Supported**: Insert, Search, Delete, In-Order Traversal.
- **Time Complexity**: $O(\log N)$ average case.
- **Where Used**: `ProductService` uses BST to manage the global inventory catalog.

### 2. AVL Tree
- **Purpose**: A self-balancing BST used to guarantee strict $O(\log N)$ performance, preventing the tree from degrading into a linked list.
- **Location**: `datastructures.supplier.AVLTree`
- **Operations Supported**: Insert with Left/Right Rotations, Search.
- **Where Used**: `SupplierService` uses the AVL Tree for rapid supplier lookups and ratings balancing.

### 3. B-Tree
- **Purpose**: Optimized for systems that read and write large blocks of data. Nodes can have multiple children.
- **Location**: `datastructures.warehouse.BTree`
- **Where Used**: `WarehouseService` uses the B-Tree to map block-level storage locations within a facility.

### 4. Graph & Dijkstra's Algorithm
- **Purpose**: To map the physical logistics network of Warehouses and find the shortest physical delivery paths.
- **Location**: `datastructures.logistics.Graph` & `Dijkstra.java`
- **Complexity**: $O((V + E) \log V)$ using a Priority Queue.
- **Where Used**: `LogisticsService`. When a Shipment is created between Warehouse A and Warehouse B, Dijkstra's algorithm calculates the shortest route based on distance weights.

### 5. Priority Queue
- **Purpose**: To order items based on priority rather than FIFO.
- **Location**: `datastructures.order.OrderPriorityQueue` (backed by a Min-Heap).
- **Complexity**: $O(\log N)$ for Enqueue/Dequeue.
- **Where Used**: `OrderService`. Urgent/Express orders are pushed to the top of the fulfillment queue ahead of Standard orders using a custom Comparator.

### 6. Fenwick Tree (Binary Indexed Tree)
- **Purpose**: Dynamically tracks cumulative sums across arrays.
- **Location**: `datastructures.analytics.FenwickTree`
- **Complexity**: $O(\log N)$ for updates and prefix sum queries.
- **Where Used**: `ExecutiveDashboardService`. Calculates real-time running totals for Revenue and total Logistics Shipments as new data streams in.

### 7. Segment Tree
- **Purpose**: Answers complex range queries (Min, Max, Sum) over array intervals.
- **Location**: `datastructures.analytics.SegmentTree`
- **Complexity**: $O(\log N)$ for range queries.
- **Where Used**: `ExecutiveDashboardService`. Calculates maximum warehouse stock blocks and targeted historical inventory ranges.

---

## 7. Storage System & Persistence

The application employs a **Repository-like Storage Pattern** via the `FileManager`.

- **Data Files**: Information is stored in plain text/CSV formats inside the `data/` directory (e.g., `products.txt`, `orders.txt`, `routes.txt`).
- **Startup Loading**: When `Main.java` starts, it initializes `FileManager`. The manager reads all files line-by-line, instantiates Java Model objects, and pushes them into the Services, effectively **rebuilding the Data Structures** from scratch on every boot.
- **Persistence Flow**: When a user adds a Product, the `ProductService` updates the in-memory BST, then immediately calls `fileManager.saveProducts(productList)` to overwrite or append to `products.txt`. This ensures the text files act as a persistent ledger.

---

## 8. API Endpoints Dictionary

| Endpoint | Method | Purpose | Response Format | Frontend Consumer |
|----------|--------|---------|-----------------|-------------------|
| `/api/auth/login` | POST | Authenticate user credentials | `{ token, user, role }` | `Login.jsx` |
| `/api/products` | GET | Retrieve paginated inventory | Array of `Product` | `Inventory.jsx` |
| `/api/products` | POST | Create new inventory item | `Product` object | `Inventory.jsx` |
| `/api/products/{id}`| PUT | Update inventory item | Success Message | `Inventory.jsx` |
| `/api/suppliers` | GET | Retrieve all suppliers | Array of `Supplier` | `Suppliers.jsx` |
| `/api/orders` | GET | Retrieve ordered priorities | Array of `Order` | `Orders.jsx` |
| `/api/orders/{id}`| PUT | Update order status | Success Message | `Orders.jsx` |
| `/api/shipments` | POST | Create routing shipment | `Shipment` object | `Shipments.jsx` |
| `/api/shipments/{id}`| PUT | Assign driver / Complete | Success Message | `Shipments.jsx` |
| `/api/stats/revenue` | GET | Fenwick Tree revenue stats | `{ trend, totalRevenue }`| `AnalyticsDashboard.jsx` |
| `/api/stats/inventory`| GET | Segment Tree range stats | `{ distribution, maxBlock }`| `AnalyticsDashboard.jsx` |
| `/api/stats/logistics`| GET | Fenwick Tree shipment stats | `{ statusBreakdown }` | `AnalyticsDashboard.jsx` |

---

## 9. Authentication & Role System

- **Login Flow**: User inputs credentials $\rightarrow$ Frontend posts to `/api/auth/login` $\rightarrow$ `AuthHandler` validates against `AuthenticationService` $\rightarrow$ Returns JWT/Session data.
- **Roles**:
  - **ADMIN**: Has complete system access.
  - **WAREHOUSE_MANAGER**: Limited to Inventory and Orders viewing.
  - **SUPPLIER**: Restricted dashboard access.
- **Enforcement**: Protected Routes in the React Router prevent unauthorized component rendering. The API layer currently uses simulated JWT structures.

---

## 10. Deployment Strategy

- **Backend**: Can be deployed on **Render** or a **Docker** container. It requires a Java 17+ environment and persistent volume mapping for the `data/` directory.
- **Frontend**: The Vite build (`npm run build`) generates static files (`dist/`) which can be seamlessly hosted on **Vercel**, **Netlify**, or **GitHub Pages**.
- **Environment Variables**: Managed via `.env` files. `VITE_API_URL` configures the React app to point to the correct Java backend host depending on the environment (Development vs. Production).

---

## 11. Design Patterns Used

- **MVC Concepts**: The Frontend acts as the View, Handlers act as the Controller, and Models/Data Structures act as the Model.
- **Singleton Pattern**: The `ApiServer` and HTTP Handlers utilize shared, single instances of Services (e.g., `ProductService`) initialized in `Main.java` and injected via Constructors.
- **Factory/Builder**: Used during object parsing in `FileManager` to construct complex entities from raw text.
- **Service Layer Pattern**: Deeply enforced. Handlers never touch Data Structures directly; they delegate all business logic to `Services`.

### Execution Flow Example: Updating a Product
`User clicks Edit` $\rightarrow$ `Inventory.jsx Modal Opens` $\rightarrow$ `User submits form` $\rightarrow$ `Axios PUT /api/products/123` $\rightarrow$ `ApiServer routes to ProductHandler` $\rightarrow$ `ProductHandler extracts JSON` $\rightarrow$ `ProductService.updateProduct()` $\rightarrow$ `BST.search(123)` $\rightarrow$ `Node is modified` $\rightarrow$ `FileManager overwrites products.txt` $\rightarrow$ `HTTP 200 OK` $\rightarrow$ `Inventory.jsx calls fetchProducts()` $\rightarrow$ `UI updates`.

---

## 12. Technology Stack

- **Backend**: Java 17, `com.sun.net.httpserver`, Custom DSAs.
- **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons, Framer Motion, Recharts, Vis-Network.
- **Storage**: Flat-file JSON/CSV/Text persistence.

---

## 13. Time Complexity Summary Table

| Data Structure / Algorithm | Core Operation | Best Case | Worst Case | Real-World Application in Project |
|----------------------------|----------------|-----------|------------|-----------------------------------|
| **Binary Search Tree** | Search / Insert | $O(\log N)$ | $O(N)$ | General Product ID lookups. |
| **AVL Tree** | Search / Insert | $O(\log N)$ | $O(\log N)$| Supplier indexing ensuring strict balance. |
| **B-Tree** | Disk/Block Read | $O(\log N)$ | $O(\log N)$| Warehouse node block management. |
| **Graph (Adjacency List)** | Traversal | $O(V + E)$ | $O(V^2)$ | Mapping physical logistics hubs. |
| **Dijkstra's Algorithm** | Shortest Path | $O(E \log V)$| $O(E \log V)$| Finding optimal delivery routes. |
| **Priority Queue (Heap)** | Enqueue / Dequeue| $O(\log N)$ | $O(\log N)$| Sorting urgent vs standard orders. |
| **Segment Tree** | Range Max/Min/Sum| $O(\log N)$ | $O(\log N)$| Querying max warehouse blocks over a timeframe. |
| **Fenwick Tree** | Prefix Sum / Update| $O(\log N)$ | $O(\log N)$| Live tracking of cumulative revenue. |

---

## 14. Conclusion & Business Impact

The Intelligent Supply Chain System represents a highly robust, academically rigorous fusion of practical software engineering and theoretical computer science. By migrating relational analytics and routing logic out of traditional slow databases and into optimized, tightly-packed **in-memory Data Structures**, the system achieves unparalleled latency reductions. 

**Future Enhancements** could include wrapping the `FileManager` logic behind a proper SQL/NoSQL interface for horizontal scaling, adding WebSocket support for real-time live graph updates, and expanding the Machine Learning forecasting models.

**Prepared For**: Faculty Evaluation, Technical Documentation, and Project Viva Preparations.
