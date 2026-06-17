# API Documentation

The Java Backend runs on `http://localhost:8080/api`.

## Endpoints

### Authentication
- `POST /auth/login`: Accepts JSON `{username, password}`. Returns User details and Role.
- `POST /auth/register`: Accepts JSON `{id, username, password, role}`.

### Telemetry & System
- `GET /system/health`: Returns API Status, JVM memory usage, and DSA node counts.
- `POST /system/seed`: Triggers the massive Demo Data Generator.
- `GET /system/audit`: Returns the last 20 actions from `audit.log`.
- `GET /search?q={query}`: Unified global search across Products, Orders, Suppliers, and Warehouses.

### Inventory
- `GET /products`: Returns all items traversed `In-Order` from the BST.
- `POST /products`: Inserts a new product into both BST and AVL trees.
- `DELETE /products/{id}`: Removes from trees and updates storage file.

### Logistics
- `GET /shipments`: Returns active shipments.
- `GET /routes`: Returns all available graph edges.
- `GET /warehouses`: Returns all node locations.

### Analytics
- `GET /analytics`: Serves aggregated metrics calculated via Fenwick and Segment trees.
- `GET /dashboard`: Specialized endpoint serving high-level KPIs for the React Executive view.
