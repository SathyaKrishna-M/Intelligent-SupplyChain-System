# Dependency Map

## Backend Architecture
Main -> ApiServer -> Handlers -> Services -> Models -> FileManager/Graph

### Potential Circular Dependencies
- **ActivityHandler** <-> **ApiServer**
- **ActivityHandler** <-> **ActivityHandler**
- **AnalyticsHandler** <-> **ApiServer**
- **AnalyticsHandler** <-> **AnalyticsHandler**
- **ApiServer** <-> **ActivityHandler**
- **ApiServer** <-> **NotificationHandler**
- **ApiServer** <-> **AuthHandler**
- **ApiServer** <-> **ProductHandler**
- **ApiServer** <-> **WarehouseHandler**
- **ApiServer** <-> **SupplierHandler**
- **ApiServer** <-> **OrderHandler**
- **ApiServer** <-> **ShipmentHandler**
- **ApiServer** <-> **RouteHandler**
- **ApiServer** <-> **AnalyticsHandler**
- **ApiServer** <-> **SystemHandler**
- **AuthHandler** <-> **ApiServer**
- **AuthHandler** <-> **AuthHandler**
- **NotificationHandler** <-> **ApiServer**
- **NotificationHandler** <-> **NotificationHandler**
- **OrderHandler** <-> **ApiServer**
- **OrderHandler** <-> **OrderHandler**
- **ProductHandler** <-> **ApiServer**
- **ProductHandler** <-> **ProductHandler**
- **RouteHandler** <-> **ApiServer**
- **RouteHandler** <-> **RouteHandler**
- **ShipmentHandler** <-> **ApiServer**
- **ShipmentHandler** <-> **ShipmentHandler**
- **SupplierHandler** <-> **ApiServer**
- **SupplierHandler** <-> **SupplierHandler**
- **SystemHandler** <-> **ApiServer**
- **SystemHandler** <-> **SystemHandler**
- **WarehouseHandler** <-> **ApiServer**
- **WarehouseHandler** <-> **WarehouseHandler**
- **Admin** <-> **Admin**
- **LogisticsManager** <-> **LogisticsManager**
- **SupplierUser** <-> **SupplierUser**
- **WarehouseManager** <-> **WarehouseManager**
- **LogisticsService** <-> **OrderService**
- **OrderService** <-> **LogisticsService**
- **ProductService** <-> **ReorderService**
- **ReorderService** <-> **ProductService**
