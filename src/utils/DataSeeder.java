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
        
        if (routesCorrupted) {
            Logger.info("Corrupted routes detected. Wiping network graph so it can be built manually...");
            fm.saveRoutes(new java.util.ArrayList<>());
        }
    }
}
