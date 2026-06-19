package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dto.DashboardDTO;
import models.Order;
import models.OrderStatus;
import models.Product;
import models.Shipment;
import models.ShipmentStatus;
import services.LogisticsService;
import services.OrderService;
import services.ProductService;
import services.WarehouseService;
import services.SupplierService;
import utils.Logger;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AnalyticsHandler implements HttpHandler {
    private final ProductService productService;
    private final WarehouseService warehouseService;
    private final OrderService orderService;
    private final LogisticsService logisticsService;
    private final SupplierService supplierService;
    private final services.ExecutiveDashboardService execDashboard;

    public AnalyticsHandler(ProductService productService, WarehouseService warehouseService, OrderService orderService, LogisticsService logisticsService, SupplierService supplierService, services.ExecutiveDashboardService execDashboard) {
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.orderService = orderService;
        this.logisticsService = logisticsService;
        this.supplierService = supplierService;
        this.execDashboard = execDashboard;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        try {
            if ("GET".equalsIgnoreCase(method)) {
                if (path.equals("/api/dashboard") || path.equals("/api/analytics/dashboard")) {
                    int totalProducts = productService.listAllProducts().size();
                    int totalWarehouses = warehouseService.getAllWarehouses().size();
                    int totalSuppliers = supplierService.getAllSuppliers().size();
                    
                    List<Order> orders = orderService.getAllOrders();
                    int totalOrders = orders.size();
                    int pendingOrders = (int) orders.stream().filter(o -> o.getStatus() == OrderStatus.PROCESSING || o.getStatus() == OrderStatus.APPROVED).count();
                    int deliveredOrders = (int) orders.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED).count();
                    
                    double revenue = orders.stream()
                        .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                        .mapToDouble(Order::getTotalCost)
                        .sum();
                    
                    int lowStock = productService.getLowStockProducts().size();
                    int activeShipments = (int) logisticsService.getAllShipments().stream()
                        .filter(s -> s.getStatus() == ShipmentStatus.IN_TRANSIT).count();

                    DashboardDTO dto = new DashboardDTO(totalProducts, totalWarehouses, totalSuppliers, totalOrders, pendingOrders, deliveredOrders, revenue, lowStock, activeShipments);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Dashboard data", dto));
                    Logger.info("Dashboard data requested");
                    
                } else if (path.equals("/api/stats/revenue") || path.equals("/api/analytics/revenue")) {
                    List<models.SalesRecord> sales = execDashboard.getSalesRecords();
                    int lastIdx = Math.max(0, sales.size() - 1);
                    double revenue = sales.isEmpty() ? 0 : execDashboard.getCumulativeRevenue(lastIdx); // Fenwick Tree!
                    
                    List<Map<String, Object>> trendData = new java.util.ArrayList<>();
                    
                    // Use FenwickTree for O(log N) cumulative sum instead of manual accumulator
                    for (int i = 0; i < sales.size(); i++) {
                        models.SalesRecord s = sales.get(i);
                        Map<String, Object> point = new HashMap<>();
                        point.put("date", s.getDate());
                        point.put("daily", s.getRevenue());
                        point.put("cumulative", execDashboard.getCumulativeRevenue(i)); // Fenwick Query
                        point.put("rangeSumExample", execDashboard.getRevenueRangeSum(Math.max(0, i-5), i)); // Segment Query
                        trendData.add(point);
                    }

                    Map<String, Object> res = new HashMap<>();
                    res.put("totalRevenue", revenue);
                    res.put("trend", trendData);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Revenue stats", res));
                    
                } else if (path.equals("/api/stats/inventory") || path.equals("/api/analytics/inventory")) {
                    List<Product> products = productService.listAllProducts();
                    double totalValue = products.stream().mapToDouble(p -> p.getStockQuantity() * p.getCostPrice()).sum();
                    
                    List<models.WarehouseInventory> inv = execDashboard.getWarehouseInventory();
                    int lastIdx = Math.max(0, inv.size() - 1);
                    int totalStock = inv.isEmpty() ? 0 : execDashboard.getInventorySum(0, lastIdx); // Segment Tree Query!
                    
                    Map<String, Integer> whStock = new HashMap<>();
                    for (models.WarehouseInventory wi : inv) {
                        whStock.put(wi.getWarehouseId(), whStock.getOrDefault(wi.getWarehouseId(), 0) + wi.getQuantity());
                    }
                    
                    List<Map<String, Object>> distribution = new java.util.ArrayList<>();
                    for (Map.Entry<String, Integer> entry : whStock.entrySet()) {
                        Map<String, Object> point = new HashMap<>();
                        point.put("warehouse", entry.getKey());
                        point.put("stock", entry.getValue());
                        distribution.add(point);
                    }

                    Map<String, Object> res = new HashMap<>();
                    res.put("totalItems", products.size());
                    res.put("totalStock", totalStock);
                    res.put("totalValue", totalValue);
                    res.put("distribution", distribution);
                    
                    if (!inv.isEmpty()) {
                        res.put("maxBlock", execDashboard.getInventoryMax(0, lastIdx)); // Segment Tree Query!
                        res.put("minBlock", execDashboard.getInventoryMin(0, lastIdx)); // Segment Tree Query!
                    }
                    
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Inventory stats", res));
                    
                } else if (path.equals("/api/stats/logistics")) {
                    List<Shipment> shipments = logisticsService.getAllShipments();
                    int totalShipments = shipments.isEmpty() ? 0 : execDashboard.getRunningShipments(shipments.size() - 1); // Fenwick Tree Query!
                    
                    Map<String, Object> res = new HashMap<>();
                    res.put("totalShipments", totalShipments);
                    long inTransit = shipments.stream().filter(s -> s.getStatus() == ShipmentStatus.IN_TRANSIT).count();
                    long delivered = shipments.stream().filter(s -> s.getStatus() == ShipmentStatus.DELIVERED).count();
                    long pending = shipments.stream().filter(s -> s.getStatus() == ShipmentStatus.CREATED || s.getStatus() == ShipmentStatus.ASSIGNED).count();
                    
                    res.put("inTransit", inTransit);
                    res.put("delivered", delivered);
                    
                    List<Map<String, Object>> statusData = new java.util.ArrayList<>();
                    statusData.add(Map.of("name", "Delivered", "value", delivered));
                    statusData.add(Map.of("name", "In Transit", "value", inTransit));
                    statusData.add(Map.of("name", "Pending", "value", pending));
                    res.put("statusBreakdown", statusData);

                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Logistics stats", res));
                    
                } else if (path.equals("/api/stats/suppliers")) {
                    List<models.Supplier> suppliers = supplierService.getAllSuppliers();
                    List<Map<String, Object>> ranking = new java.util.ArrayList<>();
                    
                    for (models.Supplier s : suppliers) {
                        Map<String, Object> point = new HashMap<>();
                        point.put("name", s.getSupplierName());
                        // Mock metrics for supplier ranking showcase
                        point.put("score", 70 + (Math.random() * 25));
                        point.put("fulfillmentRate", 80 + (Math.random() * 20));
                        point.put("avgDeliveryDays", 2 + (Math.random() * 5));
                        ranking.add(point);
                    }
                    // Sort descending by score
                    ranking.sort((a, b) -> Double.compare((Double)b.get("score"), (Double)a.get("score")));

                    Map<String, Object> res = new HashMap<>();
                    res.put("totalSuppliers", suppliers.size());
                    res.put("ranking", ranking);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Supplier stats", res));
                    
                } else if (path.equals("/api/inventory/low-stock")) {
                    List<Product> lowStock = productService.getLowStockProducts();
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Low stock products", lowStock));
                } else {
                    ApiServer.sendResponse(exchange, 404, JsonUtil.error("Not Found"));
                }
            } else {
                ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
            }
        } catch (Exception e) {
            Logger.error("Error in AnalyticsHandler: " + e.getMessage());
            ApiServer.sendResponse(exchange, 500, JsonUtil.error("Internal Server Error"));
        }
    }
}
