package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import services.*;
import utils.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class ApiServer {
    private final int port;
    private final HttpServer server;
    
    private final AuthenticationService authService;
    private final ProductService productService;
    private final WarehouseService warehouseService;
    private final SupplierService supplierService;
    private final OrderService orderService;
    private final LogisticsService logisticsService;
    private final storage.FileManager fileManager;
    private final ExecutiveDashboardService executiveDashboardService;

    public ApiServer(int port, 
                     AuthenticationService authService,
                     ProductService productService,
                     WarehouseService warehouseService,
                     SupplierService supplierService,
                     OrderService orderService,
                     LogisticsService logisticsService,
                     storage.FileManager fileManager,
                     ExecutiveDashboardService executiveDashboardService) throws IOException {
        this.port = port;
        this.authService = authService;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.supplierService = supplierService;
        this.orderService = orderService;
        this.logisticsService = logisticsService;
        this.fileManager = fileManager;
        this.executiveDashboardService = executiveDashboardService;
        
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        registerRoutes();
    }

    public void setActivityService(ActivityService activityService) {
        server.createContext("/api/activity", corsWrapper(new ActivityHandler(activityService)));
    }

    public void setNotificationService(NotificationService notificationService) {
        server.createContext("/api/notifications", corsWrapper(new NotificationHandler(notificationService)));
    }

    private void registerRoutes() {
        // We will add actual Handlers here later.
        // For now, attaching dummy handlers just to get the server running.
        server.createContext("/api/auth", corsWrapper(new AuthHandler(authService)));
        server.createContext("/api/products", corsWrapper(new ProductHandler(productService)));
        server.createContext("/api/warehouses", corsWrapper(new WarehouseHandler(warehouseService)));
        server.createContext("/api/suppliers", corsWrapper(new SupplierHandler(supplierService)));
        server.createContext("/api/orders", corsWrapper(new OrderHandler(orderService)));
        server.createContext("/api/shipments", corsWrapper(new ShipmentHandler(logisticsService)));
        server.createContext("/api/routes", corsWrapper(new RouteHandler(logisticsService)));
        AnalyticsHandler analyticsHandler = new AnalyticsHandler(productService, warehouseService, orderService, logisticsService, supplierService, executiveDashboardService);
        server.createContext("/api/analytics", corsWrapper(analyticsHandler));
        server.createContext("/api/dashboard", corsWrapper(analyticsHandler));
        server.createContext("/api/stats", corsWrapper(analyticsHandler));
        server.createContext("/api/inventory", corsWrapper(analyticsHandler));
        
        SystemHandler systemHandler = new SystemHandler(fileManager);
        server.createContext("/api/system/seed", corsWrapper(systemHandler));
        server.createContext("/api/system/health", corsWrapper(systemHandler));
        server.createContext("/api/system/audit", corsWrapper(systemHandler));
        server.createContext("/api/search", corsWrapper(systemHandler));
        server.createContext("/api/health", corsWrapper(systemHandler));
    }

    public void start() {
        server.setExecutor(null); // creates a default executor
        server.start();
        Logger.info("[API] HTTP Server started on port " + port);
        Logger.info("[API] Frontend can connect at http://localhost:" + port + "/api");
    }

    public void stop() {
        server.stop(0);
        Logger.info("[API] HTTP Server stopped.");
    }

    // CORS Wrapper
    private HttpHandler corsWrapper(HttpHandler handler) {
        return exchange -> {
            Logger.info("Received " + exchange.getRequestMethod() + " request to " + exchange.getRequestURI());
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Id, X-User-Role");
            
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            try {
                handler.handle(exchange);
            } catch (Exception e) {
                e.printStackTrace();
                sendResponse(exchange, 500, JsonUtil.error("Internal Server Error: " + e.getMessage()));
            }
        };
    }

    // Utility for Handlers
    public static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
    
    public static String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
