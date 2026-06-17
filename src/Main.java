import models.*;
import services.*;
import storage.FileManager;
import datastructures.Graph;
import api.ApiServer;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        FileManager fileManager = new FileManager();
        ActivityService activityService = new ActivityService(fileManager);
        NotificationService notificationService = new NotificationService(fileManager);

        AuthenticationService authService = new AuthenticationService(fileManager);
        authService.setActivityService(activityService);

        ProductService productService = new ProductService(fileManager);
        productService.setActivityService(activityService);
        productService.setNotificationService(notificationService);

        WarehouseService warehouseService = new WarehouseService(fileManager, productService);
        SupplierService supplierService = new SupplierService(fileManager);
        
        utils.DataSeeder.seedIfNeeded(fileManager, authService, productService, warehouseService, supplierService);

        OrderService orderService = new OrderService(fileManager, warehouseService);
        orderService.setActivityService(activityService);
        orderService.setNotificationService(notificationService);

        PurchaseRequestService purchaseRequestService = new PurchaseRequestService(fileManager, orderService, productService);
        purchaseRequestService.setActivityService(activityService);
        purchaseRequestService.setNotificationService(notificationService);
        
        DriverService driverService = new DriverService(fileManager);
        
        // Build Graph
        Graph graph = new Graph();
        java.util.List<Route> routes = fileManager.loadRoutes();
        for (Route r : routes) {
            graph.addRoute(r);
        }
        
        LogisticsService logisticsService = new LogisticsService(fileManager, driverService, orderService, graph);
        logisticsService.setActivityService(activityService);
        logisticsService.setNotificationService(notificationService);
        
        orderService.setLogisticsService(logisticsService); // connect circular dependency

        // Business Intelligence
        InventoryBalancingService inventoryBalancingService = new InventoryBalancingService(fileManager, graph);
        ExecutiveDashboardService executiveDashboardService = new ExecutiveDashboardService(fileManager);

        System.out.println("\n--- SYSTEM STARTUP ---");
        System.out.println("Products Loaded");
        System.out.println("BST Rebuilt");
        System.out.println("AVL Rebuilt");
        System.out.println("Warehouse Records Loaded");
        orderService.printRebuildStatus();
        purchaseRequestService.printRebuildStatus();
        driverService.printRebuildStatus();
        logisticsService.printRebuildStatus();
        executiveDashboardService.printRebuildStatus();
        System.out.println("Graph Rebuilt (Nodes: " + graph.getAllWarehouses().size() + ", Edges: " + routes.size() + ")");
        System.out.println("----------------------\n");

        if (authService.login("admin", "admin") == null && fileManager.loadUsers().isEmpty()) {
            authService.register("U1", "admin", "admin", Role.ADMIN);
            System.out.println("System info: Default admin user created. Username: admin, Password: admin");
        }

        // Start API Server
        try {
            int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8081"));
            ApiServer apiServer = new ApiServer(port, authService, productService, warehouseService, supplierService, orderService, logisticsService, fileManager, executiveDashboardService);
            apiServer.setActivityService(activityService);
            apiServer.setNotificationService(notificationService);
            apiServer.start(); // Block main thread
        } catch (Exception e) {
            System.err.println("Failed to start API Server: " + e.getMessage());
        }
    }
}
