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
            Logger.info("Seeding initial data...");
            // Warehouses
            warehouseService.addWarehouse(new Warehouse("W1", "Central Hub", "New York", 10000));
            warehouseService.addWarehouse(new Warehouse("W2", "West Coast Hub", "Los Angeles", 8000));
            warehouseService.addWarehouse(new Warehouse("W3", "European Hub", "London", 5000));

            // Suppliers
            supplierService.addSupplier(new Supplier("S1", "Techtronics Inc", "contact@techtronics.com", 4.5));
            supplierService.addSupplier(new Supplier("S2", "Global Components", "sales@globalcomp.com", 4.0));
            supplierService.addSupplier(new Supplier("S3", "FastShipping Logistics", "info@fastshipping.com", 4.8));

            // Products
            productService.addProduct(new Product("P1", "Laptop Pro", "Electronics", 150, 800.0, 1200.0, "S1"));
            productService.addProduct(new Product("P2", "Wireless Mouse", "Electronics", 500, 15.0, 30.0, "S2"));
            productService.addProduct(new Product("P3", "Mechanical Keyboard", "Electronics", 300, 45.0, 90.0, "S1"));
            productService.addProduct(new Product("P4", "USB-C Hub", "Accessories", 1000, 10.0, 25.0, "S2"));
            productService.addProduct(new Product("P5", "Ergonomic Chair", "Furniture", 50, 120.0, 250.0, "S3"));
            productService.addProduct(new Product("P6", "Standing Desk", "Furniture", 20, 200.0, 450.0, "S3"));
            
            Logger.info("Initial data seeded.");
        }
    }
}
