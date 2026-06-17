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
                    double revenue = orderService.getAllOrders().stream()
                        .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                        .mapToDouble(Order::getTotalCost)
                        .sum();
                    
                    // Generate Time-Series Data for Chart using SalesRecords
                    List<models.SalesRecord> sales = execDashboard.getSalesRecords();
                    Map<String, Double> dailyRev = new java.util.TreeMap<>();
                    for (models.SalesRecord s : sales) {
                        dailyRev.put(s.getDate(), dailyRev.getOrDefault(s.getDate(), 0.0) + s.getRevenue());
                    }
                    
                    List<Map<String, Object>> trendData = new java.util.ArrayList<>();
                    double cumulative = 0;
                    for (Map.Entry<String, Double> entry : dailyRev.entrySet()) {
                        cumulative += entry.getValue();
                        Map<String, Object> point = new HashMap<>();
                        point.put("date", entry.getKey());
                        point.put("daily", entry.getValue());
                        point.put("cumulative", cumulative);
                        trendData.add(point);
                    }

                    Map<String, Object> res = new HashMap<>();
                    res.put("totalRevenue", revenue);
                    res.put("trend", trendData);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Revenue stats", res));
                    
                } else if (path.equals("/api/stats/inventory") || path.equals("/api/analytics/inventory")) {
                    List<Product> products = productService.listAllProducts();
                    int totalStock = products.stream().mapToInt(Product::getStockQuantity).sum();
                    double totalValue = products.stream().mapToDouble(p -> p.getStockQuantity() * p.getCostPrice()).sum();
                    
                    List<models.WarehouseInventory> inv = execDashboard.getWarehouseInventory();
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
                    
                    if (execDashboard.getInventoryTree() != null && !inv.isEmpty()) {
                        res.put("maxBlock", execDashboard.getInventoryTree().rangeMax(0, inv.size()-1));
                        res.put("minBlock", execDashboard.getInventoryTree().rangeMin(0, inv.size()-1));
                    }
                    
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Inventory stats", res));
                    
                } else if (path.equals("/api/stats/logistics")) {
                    List<Shipment> shipments = logisticsService.getAllShipments();
                    Map<String, Object> res = new HashMap<>();
                    res.put("totalShipments", shipments.size());
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
                    
                } else if (path.equals("/api/forecast") || path.equals("/api/analytics/forecast")) {
                    List<Product> lowStock = productService.getLowStockProducts();
                    
                    // Generate historical timeline data for AreaChart
                    List<Map<String, Object>> timeline = new java.util.ArrayList<>();
                    String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
                    int base = 500;
                    for (int i=0; i<12; i++) {
                        Map<String, Object> pt = new HashMap<>();
                        pt.put("month", months[i]);
                        pt.put("historical", base + (Math.random() * 200 - 100));
                        if (i >= 9) { // Last 3 months include prediction
                            pt.put("predicted", pt.get("historical"));
                        } else if (i == 8) {
                            pt.put("predicted", pt.get("historical")); // Connection point
                        }
                        timeline.add(pt);
                    }
                    
                    List<Map<String, Object>> forecastList = lowStock.stream().map(p -> {
                        Map<String, Object> f = new HashMap<>();
                        f.put("product", p);
                        f.put("currentStock", p.getStockQuantity());
                        f.put("predictedDemand", 100); 
                        f.put("recommendedReorder", 100 - p.getStockQuantity() + 20); 
                        return f;
                    }).collect(Collectors.toList());
                    
                    Map<String, Object> res = new HashMap<>();
                    res.put("items", forecastList);
                    res.put("timeline", timeline);
                    
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Forecast data", res));
                    
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
