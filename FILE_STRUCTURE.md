# Intelligent Supply Chain System - Project Structure

This document provides a comprehensive map of the core files in the SupplyChain repository and explains their primary use within the system.

## 📂 Root Directory
- `API_DOCUMENTATION.md` - Documentation of all REST API endpoints.
- `FEATURES.md` - List of system features and role-based access rules.
- `INSTALLATION.md` - Setup and execution instructions.
- `PROJECT_ARCHITECTURE.md` - Deep dive into the architectural design and Data Structures used.
- `README.md` - The primary entry point and high-level project overview.

---

## 🎨 Frontend (`frontend/`)
The frontend is a modern single-page application built with React, Vite, and Tailwind CSS.

### Core Configuration
- `index.html` - The HTML entry point for the React application.
- `package.json` - Node.js dependencies and build scripts.
- `vite.config.js` - Configuration for the Vite build tool and development server.
- `postcss.config.js` & `tailwind.config.js` - Styling engine configurations.

### Source Code (`frontend/src/`)
- `main.jsx` - Mounts the React application to the DOM.
- `index.css` - Global CSS styles and Tailwind base imports.

#### 🗂️ Pages (`frontend/src/pages/`)
The main views of the application, accessible via the sidebar navigation:
- `Login.jsx` & `Register.jsx` - Authentication flows.
- `ExecutiveDashboard.jsx` - The main landing page displaying system KPIs and audit logs.
- `Inventory.jsx` - Displays all products, low stock alerts, and allows CRUD operations.
- `Warehouses.jsx` - Manages storage locations and capacity.
- `Orders.jsx` - Handles customer orders and fulfillment statuses.
- `Suppliers.jsx` - Manages third-party vendors and their inventory.
- `Shipments.jsx` & `Logistics.jsx` - Tracks outgoing deliveries and visualizes the routing network.
- `Analytics.jsx` - Business intelligence dashboard powered by advanced data structures.
- `SystemHealth.jsx` - Telemetry, JVM memory, and API status monitoring.
- `Settings.jsx` - User preferences and system configuration.

#### 🗂️ Components & Layouts (`frontend/src/components/`, `frontend/src/layouts/`)
- `Sidebar.jsx` & `TopNav.jsx` - Global navigation menus.
- `DashboardLayout.jsx` - The structural wrapper for authenticated pages.
- `DataTable.jsx` - Reusable grid component for displaying tables of data.
- `Modal.jsx` - Reusable popup component for forms and alerts.

#### 🗂️ Context & Routing (`frontend/src/contexts/`, `frontend/src/router/`, `frontend/src/hooks/`)
- `AuthContext.jsx` & `useAuth.js` - Manages user login state and session tokens in `localStorage`.
- `AppRouter.jsx` - Defines all URL routes in the system.
- `ProtectedRoute.jsx` - A security guard that restricts page access based on user Roles (e.g. `ADMIN`, `SUPPLIER`).

#### 🗂️ Services & Utils (`frontend/src/services/`, `frontend/src/utils/`)
- `api.js` - Pre-configured Axios instance. Handles the base URL and automatically attaches `X-User-Id` headers and unwraps JSON responses.
- `export.js` - Utility functions for downloading data grids as CSV files.

---

## ⚙️ Backend (`src/`)
The backend is a pure-Java custom implementation using an embedded HTTP server and in-memory Data Structures, completely bypassing traditional SQL databases.

### Core Entry Point
- `Main.java` - Bootstraps the application, loads data from text files, rebuilds the data structures, and starts the HTTP API server.

### 🗂️ API Layer (`src/api/`)
Handles incoming HTTP requests (like Express.js or Spring Controllers):
- `ApiServer.java` - The custom embedded HTTP server running on port 8081. Handles CORS security.
- `*Handler.java` (e.g., `ProductHandler.java`, `AuthHandler.java`) - Route endpoints that parse HTTP methods (GET, POST), call services, and return JSON.
- `JsonUtil.java` - Utility to standardize all API responses into a `{ success, message, data }` format.

### 🗂️ Data Structures (`src/datastructures/`)
The proprietary algorithmic engine acting as the database:
- `AVLTree.java` & `BST.java` - Self-balancing trees for instantaneous Product and Warehouse lookups.
- `BTree.java` - A highly scalable tree designed for massive Order storage.
- `analytics/SegmentTree.java` & `analytics/FenwickTree.java` - Trees built for instantaneous range queries (e.g., calculating total revenue over a specific date range).
- `Graph.java` & `Dijkstra.java` - Network graphs used by Logistics to calculate the shortest delivery paths.

### 🗂️ Models & DTOs (`src/models/`, `src/dto/`)
- `models/*.java` (e.g., `Product.java`, `Order.java`, `Warehouse.java`) - Plain Java objects representing database entities.
- `dto/*.java` - Data Transfer Objects used to shape the JSON sent to the frontend.

### 🗂️ Services Layer (`src/services/`)
Business logic and algorithm orchestration:
- `ProductService.java` - Interfaces with the BST to manage inventory.
- `LogisticsService.java` - Interfaces with the Graph to calculate shipment routes.
- `AuthenticationService.java` - Manages user validation and roles.
- `LowStockMonitor.java` - A background service that checks inventory levels against thresholds.

### 🗂️ Data & Storage (`src/data/`, `src/storage/`, `src/logs/`)
- `data/*.txt` - Comma-separated flat files (like `products.txt`, `warehouses.txt`) serving as persistent disk storage. Loaded into memory on boot.
- `storage/FileManager.java` - Handles parsing and writing to the `.txt` data files.
- `logs/application.log` & `logs/audit.log` - Security and system event tracking.

### 🗂️ Validation (`src/validation/`)
- `*Validator.java` - Security classes that ensure incoming API data is not malformed before it enters the data structures.
