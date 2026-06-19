package utils;

import models.Admin;
import models.LogisticsManager;
import models.Role;
import models.SupplierUser;
import models.User;
import models.WarehouseManager;
import services.AuthenticationService;
import services.ProductService;
import services.WarehouseService;
import services.SupplierService;
import storage.FileManager;
import models.Product;
import models.Warehouse;
import models.Supplier;

import java.io.File;
import java.util.List;

public class DataSeeder {

    public static void seedIfNeeded(FileManager fm, AuthenticationService authService, ProductService productService, WarehouseService warehouseService, SupplierService supplierService) {
        boolean usersExist = !fm.loadUsers().isEmpty();
        boolean productsExist = !fm.loadProducts().isEmpty();

        if (!usersExist) {
            Logger.info("Seeding initial users...");
            authService.register("u1", "admin", "admin123", Role.ADMIN);
            authService.register("u2", "manager", "manager123", Role.WAREHOUSE_MANAGER);
            authService.register("u3", "logistics", "log123", Role.LOGISTICS_MANAGER);
            authService.register("u4", "supplier", "sup123", Role.SUPPLIER);
        }

        if (!productsExist) {
            Logger.info("Seeding robust initial demo data...");
            DemoDataGenerator.generateData(fm);
            Logger.info("Massive demo dataset seeded successfully.");
        } else {
            // Check if specific files are missing (like sales or shipments) and seed them so charts load
            boolean salesExist = !fm.loadSalesRecords().isEmpty();
            boolean shipmentsExist = !fm.loadShipments().isEmpty();
            
            if (!salesExist) {
                Logger.info("Seeding missing sales data for charts...");
                fm.saveSalesRecords(DemoDataGenerator.generateSalesRecords(200, fm.loadProducts()));
            }
            if (!shipmentsExist) {
                Logger.info("Seeding missing shipments data for charts...");
                fm.saveShipments(DemoDataGenerator.generateShipments(50, fm.loadOrders(), fm.loadWarehouses()));
            }

            // Self-healing: Check if routes are corrupted (referencing non-existent warehouses) due to the old bug
            List<models.Route> routes = fm.loadRoutes();
            List<Warehouse> whs = fm.loadWarehouses();
            boolean routesCorrupted = false;
            for (models.Route r : routes) {
                boolean srcFound = false;
                boolean destFound = false;
                for (Warehouse w : whs) {
                    if (w.getWarehouseId().equals(r.getSourceWarehouseId())) srcFound = true;
                    if (w.getWarehouseId().equals(r.getDestinationWarehouseId())) destFound = true;
                }
                if (!srcFound || !destFound) {
                    routesCorrupted = true;
                    break;
                }
            }
            
            if (routesCorrupted || routes.isEmpty()) {
                Logger.info("Corrupted or empty routes detected. Self-healing network graph...");
                fm.saveRoutes(DemoDataGenerator.generateRoutes(50, whs));
            }
        }
    }
}
