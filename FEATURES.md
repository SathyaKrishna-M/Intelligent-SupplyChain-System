# Feature Matrix

The Intelligent Supply Chain OS supports strict Role-Based Access Control (RBAC).

## Roles
- **ADMIN**: Has god-mode access to all modules, telemetry, and logging.
- **WAREHOUSE_MANAGER**: Can only manage Inventory and view Procurement Orders.
- **LOGISTICS_MANAGER**: Can only view Shipments and the Graph routing network.
- **SUPPLIER**: Can only view the Supplier directory and their assigned orders.

## Feature Breakdown

### Dashboard
- **Recent Activity Feed**: Pulls live from backend `audit.log`.
- **KPI Metrics**: Total Revenue, Products, Active Shipments.

### Global Search
- Context-aware instant search that parses through Products, Orders, Warehouses, and Suppliers from any screen via the top navigation bar.

### Exporting & Reporting
- One-click CSV and TXT exports for all data grids (Inventory, Orders, Warehouses, Suppliers).

### Notifications
- **Low Stock Alerts**: Automatically triggers warning banners and notifications if any product drops below 50 units.
- **Pending Orders**: Flags orders awaiting dispatch.

### Telemetry (Admin Only)
- **Demo Seeding**: Inject massive realistic datasets with one click.
- **System Health**: Monitor JVM Memory Usage, Server Uptime, and API Status.
