# Project File Audit

## File: src\api\ActivityHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: JsonUtil, ApiServer, ActivityHandler, ActivityService
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\AnalyticsHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: DashboardDTO, ApiServer, JsonUtil, Logger, AnalyticsHandler, ProductService, WarehouseService, OrderService, LogisticsService, SupplierService, ExecutiveDashboardService, SalesRecord, WarehouseInventory, Supplier
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\ApiResponse.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: None
- **Status**: UNUSED
- **Removal Risk**: SAFE

## File: src\api\ApiServer.java
- **Purpose**: Backend Java Class
- **Dependencies**: ActivityHandler, NotificationHandler, AuthHandler, ProductHandler, WarehouseHandler, SupplierHandler, OrderHandler, ShipmentHandler, RouteHandler, AnalyticsHandler, SystemHandler, Logger, JsonUtil, AuthenticationService, ProductService, WarehouseService, SupplierService, OrderService, LogisticsService, FileManager, ExecutiveDashboardService, ActivityService, NotificationService
- **Used By**: ActivityHandler, AnalyticsHandler, AuthHandler, NotificationHandler, OrderHandler, ProductHandler, RouteHandler, ShipmentHandler, SupplierHandler, SystemHandler, WarehouseHandler, Main
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\ApiTester.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: None
- **Status**: UNUSED
- **Removal Risk**: SAFE

## File: src\api\AuthHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: ApiServer, JsonUtil, Role, AuthHandler, AuthenticationService, User
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\JsonUtil.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: ActivityHandler, AnalyticsHandler, ApiServer, AuthHandler, NotificationHandler, OrderHandler, ProductHandler, RouteHandler, ShipmentHandler, SupplierHandler, SystemHandler, WarehouseHandler
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\NotificationHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: Role, JsonUtil, ApiServer, NotificationHandler, NotificationService, Notification
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\OrderHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: OrderItem, HttpUtil, PaginationUtil, ApiServer, JsonUtil, Logger, OrderHandler, OrderService, Order
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\ProductHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: Product, HttpUtil, PaginationUtil, ApiServer, JsonUtil, Logger, ProductHandler, ProductService
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\RouteHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: ApiServer, JsonUtil, RouteHandler, LogisticsService
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\ShipmentHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: HttpUtil, PaginationUtil, ApiServer, JsonUtil, Logger, ShipmentHandler, LogisticsService, Shipment, Driver, Route
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\SupplierHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: Supplier, HttpUtil, PaginationUtil, ApiServer, JsonUtil, Logger, SupplierHandler, SupplierService
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\SystemHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: DemoDataGenerator, ApiServer, Logger, JsonUtil, SystemHandler, FileManager
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\api\WarehouseHandler.java
- **Purpose**: Backend Java Class
- **Dependencies**: Warehouse, HttpUtil, PaginationUtil, ApiServer, JsonUtil, Logger, WarehouseHandler, WarehouseService
- **Used By**: ApiServer
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\datastructures\analytics\FenwickTree.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: ExecutiveDashboardService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\datastructures\analytics\SegmentTree.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: ExecutiveDashboardService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\datastructures\AVLTree.java
- **Purpose**: Backend Java Class
- **Dependencies**: Product
- **Used By**: ProductService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\datastructures\BST.java
- **Purpose**: Backend Java Class
- **Dependencies**: Product
- **Used By**: ProductService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\datastructures\BTree.java
- **Purpose**: Backend Java Class
- **Dependencies**: Order
- **Used By**: OrderService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\datastructures\Dijkstra.java
- **Purpose**: Backend Java Class
- **Dependencies**: Graph
- **Used By**: GraphTest, InventoryBalancingService, LogisticsService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\datastructures\Graph.java
- **Purpose**: Backend Java Class
- **Dependencies**: Route
- **Used By**: Dijkstra, GraphTest, Main, InventoryBalancingService, LogisticsService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\dto\DashboardDTO.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: AnalyticsHandler
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\dto\UserDTO.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: None
- **Status**: UNUSED
- **Removal Risk**: SAFE

## File: src\GraphTest.java
- **Purpose**: Backend Java Class
- **Dependencies**: FileManager, Graph, Dijkstra, Route
- **Used By**: None
- **Status**: UNUSED
- **Removal Risk**: SAFE

## File: src\Main.java
- **Purpose**: Backend Java Class
- **Dependencies**: FileManager, ActivityService, NotificationService, AuthenticationService, ProductService, WarehouseService, SupplierService, OrderService, PurchaseRequestService, DriverService, Graph, LogisticsService, InventoryBalancingService, ExecutiveDashboardService, ApiServer, DataSeeder, Route
- **Used By**: None
- **Status**: ACTIVE
- **Removal Risk**: SAFE

## File: src\models\Activity.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: ActivityService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Admin.java
- **Purpose**: Backend Java Class
- **Dependencies**: User, Admin
- **Used By**: AuthenticationService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Delivery.java
- **Purpose**: Backend Java Class
- **Dependencies**: DeliveryStatus
- **Used By**: LogisticsService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\DeliveryStatus.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: Delivery, LogisticsService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Driver.java
- **Purpose**: Backend Java Class
- **Dependencies**: DriverStatus
- **Used By**: ShipmentHandler, DriverService, LogisticsService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\DriverStatus.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: Driver, DriverService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\LogisticsManager.java
- **Purpose**: Backend Java Class
- **Dependencies**: User, LogisticsManager
- **Used By**: AuthenticationService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Notification.java
- **Purpose**: Backend Java Class
- **Dependencies**: Role
- **Used By**: NotificationHandler, NotificationService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Order.java
- **Purpose**: Backend Java Class
- **Dependencies**: OrderStatus
- **Used By**: OrderHandler, BTree, OrderService, PurchaseRequestService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\OrderItem.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: OrderHandler, OrderService, PurchaseRequestService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\OrderStatus.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: Order, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Product.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: ProductHandler, AVLTree, BST, LowStockMonitor, ProductService, PurchaseRequestService, ReorderService, WarehouseService, FileManager, DataSeeder, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\PurchaseRequest.java
- **Purpose**: Backend Java Class
- **Dependencies**: RequestStatus
- **Used By**: PurchaseRequestService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\RequestStatus.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: PurchaseRequest, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Role.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: AuthHandler, NotificationHandler, Notification, User, AuthenticationService, NotificationService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Route.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: ShipmentHandler, Graph, GraphTest, Main, LogisticsService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\SalesRecord.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: AnalyticsHandler, ExecutiveDashboardService, ProductService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Shipment.java
- **Purpose**: Backend Java Class
- **Dependencies**: ShipmentStatus
- **Used By**: ShipmentHandler, LogisticsService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\ShipmentStatus.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: Shipment, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Supplier.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: AnalyticsHandler, SupplierHandler, SupplierService, FileManager, DataSeeder, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\SupplierUser.java
- **Purpose**: Backend Java Class
- **Dependencies**: User, SupplierUser
- **Used By**: AuthenticationService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\User.java
- **Purpose**: Backend Java Class
- **Dependencies**: Role
- **Used By**: AuthHandler, Admin, LogisticsManager, SupplierUser, WarehouseManager, ActivityService, AuthenticationService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\Warehouse.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: WarehouseHandler, WarehouseService, FileManager, DataSeeder, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\WarehouseInventory.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: AnalyticsHandler, InventoryBalancingService, WarehouseService, FileManager
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\models\WarehouseManager.java
- **Purpose**: Backend Java Class
- **Dependencies**: User, WarehouseManager
- **Used By**: AuthenticationService, FileManager, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\ActivityService.java
- **Purpose**: Backend Java Class
- **Dependencies**: Activity, FileManager, User
- **Used By**: ActivityHandler, ApiServer, Main, AuthenticationService, LogisticsService, OrderService, ProductService, PurchaseRequestService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\AuthenticationService.java
- **Purpose**: Backend Java Class
- **Dependencies**: Admin, WarehouseManager, LogisticsManager, SupplierUser, Logger, FileManager, ActivityService, User, Role
- **Used By**: ApiServer, AuthHandler, Main, DataSeeder
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\DriverService.java
- **Purpose**: Backend Java Class
- **Dependencies**: FileManager, Driver, DriverStatus
- **Used By**: Main, LogisticsService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\ExecutiveDashboardService.java
- **Purpose**: Backend Java Class
- **Dependencies**: FenwickTree, SegmentTree, FileManager, SalesRecord
- **Used By**: AnalyticsHandler, ApiServer, Main
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\InventoryBalancingService.java
- **Purpose**: Backend Java Class
- **Dependencies**: Dijkstra, FileManager, Graph, WarehouseInventory
- **Used By**: Main
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\LogisticsService.java
- **Purpose**: Backend Java Class
- **Dependencies**: Shipment, Logger, Dijkstra, FileManager, DriverService, OrderService, Graph, ActivityService, NotificationService, Driver, Delivery, DeliveryStatus, Route
- **Used By**: AnalyticsHandler, ApiServer, RouteHandler, ShipmentHandler, Main, OrderService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\LowStockMonitor.java
- **Purpose**: Backend Java Class
- **Dependencies**: Product
- **Used By**: ProductService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\NotificationService.java
- **Purpose**: Backend Java Class
- **Dependencies**: Notification, FileManager, Role
- **Used By**: ApiServer, NotificationHandler, Main, LogisticsService, OrderService, ProductService, PurchaseRequestService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\OrderService.java
- **Purpose**: Backend Java Class
- **Dependencies**: BTree, Order, Logger, FileManager, WarehouseService, LogisticsService, ActivityService, NotificationService, OrderItem
- **Used By**: AnalyticsHandler, ApiServer, OrderHandler, Main, LogisticsService, PurchaseRequestService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\ProductService.java
- **Purpose**: Backend Java Class
- **Dependencies**: BST, AVLTree, LowStockMonitor, ReorderService, Logger, FileManager, ActivityService, NotificationService, Product, SalesRecord
- **Used By**: AnalyticsHandler, ApiServer, ProductHandler, Main, PurchaseRequestService, ReorderService, WarehouseService, DataSeeder
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\PurchaseRequestService.java
- **Purpose**: Backend Java Class
- **Dependencies**: PurchaseRequest, OrderItem, FileManager, OrderService, ProductService, ActivityService, NotificationService, Product, Order
- **Used By**: Main
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\ReorderService.java
- **Purpose**: Backend Java Class
- **Dependencies**: ProductService, Product
- **Used By**: ProductService
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\SupplierService.java
- **Purpose**: Backend Java Class
- **Dependencies**: FileManager, Supplier
- **Used By**: AnalyticsHandler, ApiServer, SupplierHandler, Main, DataSeeder
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\services\WarehouseService.java
- **Purpose**: Backend Java Class
- **Dependencies**: WarehouseInventory, FileManager, ProductService, Warehouse, Product
- **Used By**: AnalyticsHandler, ApiServer, WarehouseHandler, Main, OrderService, DataSeeder
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\storage\FileManager.java
- **Purpose**: Backend Java Class
- **Dependencies**: Admin, WarehouseManager, LogisticsManager, SupplierUser, Product, Warehouse, Supplier, Order, OrderItem, PurchaseRequest, Delivery, WarehouseInventory, Driver, Route, Shipment, SalesRecord, Activity, Notification, Role, OrderStatus, RequestStatus, DeliveryStatus, DriverStatus, ShipmentStatus, User
- **Used By**: ApiServer, SystemHandler, GraphTest, Main, ActivityService, AuthenticationService, DriverService, ExecutiveDashboardService, InventoryBalancingService, LogisticsService, NotificationService, OrderService, ProductService, PurchaseRequestService, SupplierService, WarehouseService, DataSeeder, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\utils\DataSeeder.java
- **Purpose**: Backend Java Class
- **Dependencies**: Warehouse, Supplier, Product, Logger, FileManager, AuthenticationService, ProductService, WarehouseService, SupplierService
- **Used By**: Main
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\utils\DemoDataGenerator.java
- **Purpose**: Backend Java Class
- **Dependencies**: Product, Warehouse, Supplier, Admin, WarehouseManager, LogisticsManager, SupplierUser, Order, Shipment, Driver, SalesRecord, Route, Logger, OrderStatus, ShipmentStatus, FileManager
- **Used By**: SystemHandler
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\utils\HttpUtil.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: OrderHandler, ProductHandler, ShipmentHandler, SupplierHandler, WarehouseHandler
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\utils\Logger.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: AnalyticsHandler, ApiServer, OrderHandler, ProductHandler, ShipmentHandler, SupplierHandler, SystemHandler, WarehouseHandler, AuthenticationService, LogisticsService, OrderService, ProductService, DataSeeder, DemoDataGenerator
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: src\utils\PaginationUtil.java
- **Purpose**: Backend Java Class
- **Dependencies**: None
- **Used By**: OrderHandler, ProductHandler, ShipmentHandler, SupplierHandler, WarehouseHandler
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\App.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: AppRouter, ToastContext
- **Used By**: main
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\AnalyticsFilters.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react
- **Used By**: AnalyticsDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\ChartSkeleton.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react
- **Used By**: DemandForecastChart, InventoryDistributionChart, RevenueTrendChart, ShipmentStatusChart, SupplierPerformanceChart, WarehousePerformanceChart
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\DemandForecastChart.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, recharts, ChartSkeleton
- **Used By**: AnalyticsDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\ExecutiveInsightsPanel.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react
- **Used By**: AnalyticsDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\InventoryDistributionChart.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, recharts, ChartSkeleton
- **Used By**: AnalyticsDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\RevenueTrendChart.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, recharts, ChartSkeleton
- **Used By**: AnalyticsDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\ShipmentStatusChart.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, recharts, ChartSkeleton
- **Used By**: AnalyticsDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\SupplierPerformanceChart.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, recharts, ChartSkeleton
- **Used By**: AnalyticsDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\charts\WarehousePerformanceChart.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, recharts, ChartSkeleton
- **Used By**: AnalyticsDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\CustomNode.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, reactflow, lucide-react
- **Used By**: None
- **Status**: UNUSED
- **Removal Risk**: SAFE

## File: frontend\src\components\dashboard\ActivityTimeline.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, useAuth, framer-motion
- **Used By**: AdminDashboard, LogisticsDashboard, SupplierDashboard, WarehouseDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\dashboard\ChartCard.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react
- **Used By**: AdminDashboard, LogisticsDashboard, WarehouseDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\dashboard\DashboardHeader.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react
- **Used By**: AdminDashboard, LogisticsDashboard, SupplierDashboard, WarehouseDashboard, DsaStory
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\dashboard\KpiCard.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, framer-motion
- **Used By**: AdminDashboard, LogisticsDashboard, SupplierDashboard, WarehouseDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\dashboard\NotificationBell.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, useAuth
- **Used By**: None
- **Status**: UNUSED
- **Removal Risk**: SAFE

## File: frontend\src\components\dashboard\NotificationPanel.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, useAuth, framer-motion
- **Used By**: AdminDashboard, SupplierDashboard, WarehouseDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\dashboard\StatsGrid.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react
- **Used By**: AdminDashboard, LogisticsDashboard, SupplierDashboard, WarehouseDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\DataTable.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, framer-motion
- **Used By**: Inventory, Orders, Shipments, Suppliers, Warehouses
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\Modal.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react
- **Used By**: Inventory
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\components\StatusBadge.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react
- **Used By**: Orders, Shipments
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\contexts\AuthContext.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, api
- **Used By**: useAuth, AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\contexts\ThemeContext.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react
- **Used By**: TopNav, main
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\contexts\ToastContext.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react
- **Used By**: App, SystemHealth
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\hooks\useAuth.js
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, AuthContext
- **Used By**: ActivityTimeline, NotificationBell, NotificationPanel, Sidebar, TopNav, AdminDashboard, LogisticsDashboard, RoleDashboard, SupplierDashboard, WarehouseDashboard, Login, Register, ProtectedRoute
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\layouts\DashboardLayout.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react-router-dom, framer-motion, Sidebar, TopNav
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\layouts\Sidebar.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, react-router-dom, lucide-react, useAuth, framer-motion
- **Used By**: DashboardLayout
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\layouts\TopNav.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, useAuth, react-router-dom, api, framer-motion, ThemeContext
- **Used By**: DashboardLayout
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\main.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, react-dom/client, App, ThemeContext
- **Used By**: None
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\AboutSystem.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: lucide-react
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Analytics.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api
- **Used By**: None
- **Status**: UNUSED
- **Removal Risk**: SAFE

## File: frontend\src\pages\AnalyticsDashboard.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, api, AnalyticsFilters, ExecutiveInsightsPanel, RevenueTrendChart, InventoryDistributionChart, SupplierPerformanceChart, WarehousePerformanceChart, ShipmentStatusChart, DemandForecastChart, lucide-react
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\dashboard\AdminDashboard.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, DashboardHeader, StatsGrid, KpiCard, ActivityTimeline, NotificationPanel, ChartCard, useAuth, api
- **Used By**: RoleDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\dashboard\LogisticsDashboard.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, DashboardHeader, StatsGrid, KpiCard, ActivityTimeline, ChartCard, useAuth, api
- **Used By**: RoleDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\dashboard\RoleDashboard.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, useAuth, react-router-dom, AdminDashboard, WarehouseDashboard, LogisticsDashboard, SupplierDashboard
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\dashboard\SupplierDashboard.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, DashboardHeader, StatsGrid, KpiCard, ActivityTimeline, NotificationPanel, useAuth
- **Used By**: RoleDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\dashboard\WarehouseDashboard.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, DashboardHeader, StatsGrid, KpiCard, ActivityTimeline, NotificationPanel, ChartCard, useAuth, api
- **Used By**: RoleDashboard
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\DsaStory.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, framer-motion, lucide-react, DashboardHeader
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Forecasting.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Inventory.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, DataTable, Modal, export
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Login.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, react-router-dom, useAuth, lucide-react
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Logistics.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, RouteVisualization
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Orders.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, DataTable, StatusBadge, export
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Register.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, react-router-dom, useAuth, lucide-react
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Reports.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: lucide-react, api
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\RouteVisualization.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, react-cytoscapejs, cytoscape, cytoscape-dagre, framer-motion, api
- **Used By**: Logistics, AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Shipments.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, DataTable, StatusBadge
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Suppliers.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, DataTable, export
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\SystemHealth.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, ToastContext
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\pages\Warehouses.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react, lucide-react, api, DataTable, export
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\router\AppRouter.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react-router-dom, AuthContext, ProtectedRoute, DashboardLayout, Login, Register, RoleDashboard, Inventory, Warehouses, Suppliers, Orders, Shipments, Logistics, AnalyticsDashboard, Forecasting, Reports, SystemHealth, AboutSystem, DsaStory, RouteVisualization
- **Used By**: App
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\router\ProtectedRoute.jsx
- **Purpose**: Frontend React Component/Service
- **Dependencies**: react-router-dom, useAuth
- **Used By**: AppRouter
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\services\api.js
- **Purpose**: Frontend React Component/Service
- **Dependencies**: axios
- **Used By**: ActivityTimeline, NotificationBell, NotificationPanel, AuthContext, TopNav, Analytics, AnalyticsDashboard, AdminDashboard, LogisticsDashboard, WarehouseDashboard, Forecasting, Inventory, Orders, Reports, RouteVisualization, Shipments, Suppliers, SystemHealth, Warehouses
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

## File: frontend\src\utils\export.js
- **Purpose**: Frontend React Component/Service
- **Dependencies**: None
- **Used By**: Inventory, Orders, Suppliers, Warehouses
- **Status**: ACTIVE
- **Removal Risk**: NOT SAFE

