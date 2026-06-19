package utils;

import models.*;
import storage.FileManager;
import java.util.*;

public class DemoDataGenerator {
    
    private static final Random rand = new Random();

    public static void generateData(FileManager fileManager) {
        Logger.audit("DemoDataGenerator", "Started generating massive demo dataset.");

        // Clear existing files (overwrite with empty lists/maps first? Or just rely on fileManager to overwrite)
        // For pure wipe, we just pass new lists.
        
        List<Product> products = generateProducts(100);
        fileManager.saveProducts(products);

        List<Warehouse> warehouses = generateWarehouses(20);
        fileManager.saveWarehouses(warehouses);

        List<Supplier> suppliers = generateSuppliers(50);
        fileManager.saveSuppliers(suppliers);

        List<User> users = generateUsers();
        fileManager.saveUsers(users);

        List<Order> orders = generateOrders(500, suppliers, warehouses);
        fileManager.saveOrders(orders);

        List<Shipment> shipments = generateShipments(200, orders, warehouses);
        fileManager.saveShipments(shipments);

        List<Driver> drivers = generateDrivers(30);
        fileManager.saveDrivers(drivers);
        
        List<SalesRecord> sales = generateSalesRecords(1000, products);
        fileManager.saveSalesRecords(sales);
        
        List<Route> routes = generateRoutes(50, warehouses);
        fileManager.saveRoutes(routes);

        Logger.audit("DemoDataGenerator", "Successfully generated demo data. (100 Prod, 20 WH, 50 Sup, 500 Ord, 200 Ship)");
    }

    public static List<Product> generateProducts(int count) {
        List<Product> list = new ArrayList<>();
        String[] categories = {"Electronics", "Apparel", "Home & Garden", "Automotive", "Industrial", "Medical"};
        for (int i = 1; i <= count; i++) {
            String cat = categories[rand.nextInt(categories.length)];
            double cost = 10 + (2000 - 10) * rand.nextDouble();
            double sell = cost * (1.1 + rand.nextDouble());
            Product p = new Product("P" + String.format("%03d", i), cat + " Item " + i, cat, rand.nextInt(1000), cost, sell, "SUP" + (rand.nextInt(50) + 1));
            list.add(p);
        }
        return list;
    }

    public static List<Warehouse> generateWarehouses(int count) {
        List<Warehouse> list = new ArrayList<>();
        String[] cities = {"New York", "London", "Tokyo", "Berlin", "Sydney", "Mumbai", "Toronto", "Dubai", "Singapore", "Paris"};
        for (int i = 1; i <= count; i++) {
            Warehouse w = new Warehouse("WH" + String.format("%02d", i), "Regional Hub " + i, cities[rand.nextInt(cities.length)], 10000 + rand.nextInt(50000));
            list.add(w);
        }
        return list;
    }

    public static List<Supplier> generateSuppliers(int count) {
        List<Supplier> list = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            Supplier s = new Supplier("SUP" + String.format("%03d", i), "Global Vendor " + i, "+1-555-" + String.format("%04d", rand.nextInt(10000)), 3.0 + (2.0 * rand.nextDouble()));
            list.add(s);
        }
        return list;
    }

    public static List<User> generateUsers() {
        List<User> list = new ArrayList<>();
        list.add(new Admin("U1", "admin", "admin"));
        list.add(new WarehouseManager("U2", "wh_manager", "pass"));
        list.add(new LogisticsManager("U3", "logistics", "pass"));
        list.add(new SupplierUser("U4", "supplier_demo", "pass"));
        return list;
    }

    public static List<Order> generateOrders(int count, List<Supplier> suppliers, List<Warehouse> warehouses) {
        List<Order> list = new ArrayList<>();
        if (suppliers.isEmpty() || warehouses.isEmpty()) return list;
        OrderStatus[] statuses = OrderStatus.values();
        for (int i = 1; i <= count; i++) {
            String sid = suppliers.get(rand.nextInt(suppliers.size())).getSupplierId();
            String wid = warehouses.get(rand.nextInt(warehouses.size())).getWarehouseId();
            Order o = new Order(
                "ORD" + String.format("%04d", i),
                sid,
                wid,
                "2026-0" + (rand.nextInt(6) + 1) + "-" + String.format("%02d", rand.nextInt(28) + 1),
                "2026-0" + (rand.nextInt(6) + 1) + "-" + String.format("%02d", rand.nextInt(28) + 1),
                statuses[rand.nextInt(statuses.length)],
                1000 + rand.nextDouble() * 50000
            );
            list.add(o);
        }
        return list;
    }

    public static List<Shipment> generateShipments(int count, List<Order> orders, List<Warehouse> warehouses) {
        List<Shipment> list = new ArrayList<>();
        if (orders.isEmpty() || warehouses.isEmpty()) return list;
        ShipmentStatus[] statuses = ShipmentStatus.values();
        for (int i = 1; i <= count; i++) {
            String oid = orders.get(rand.nextInt(orders.size())).getOrderId();
            String w1 = warehouses.get(rand.nextInt(warehouses.size())).getWarehouseId();
            String w2 = warehouses.get(rand.nextInt(warehouses.size())).getWarehouseId();
            Shipment s = new Shipment(
                "SHP" + String.format("%04d", i),
                oid,
                w1,
                w2,
                "DRV" + (rand.nextInt(30) + 1),
                "RT" + (rand.nextInt(50) + 1),
                statuses[rand.nextInt(statuses.length)],
                "2026-06-11"
            );
            list.add(s);
        }
        return list;
    }

    public static List<Driver> generateDrivers(int count) {
        List<Driver> list = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            list.add(new Driver("DRV" + i, "Driver Name " + i, "555-010" + i, rand.nextBoolean() ? DriverStatus.AVAILABLE : DriverStatus.ON_TRIP));
        }
        return list;
    }

    public static List<SalesRecord> generateSalesRecords(int count, List<Product> products) {
        List<SalesRecord> list = new ArrayList<>();
        if (products.isEmpty()) return list;
        for (int i = 1; i <= count; i++) {
            String pid = products.get(rand.nextInt(products.size())).getProductId();
            list.add(new SalesRecord(pid, "2026-0" + (rand.nextInt(6)+1) + "-01", "Region", rand.nextInt(500), 5000 + rand.nextDouble()*20000, "Enterprise"));
        }
        return list;
    }

    public static List<Route> generateRoutes(int count, List<Warehouse> warehouses) {
        List<Route> list = new ArrayList<>();
        if (warehouses.size() < 2) return list; // Cannot connect less than 2 warehouses
        for (int i = 1; i <= count; i++) {
            String w1 = warehouses.get(rand.nextInt(warehouses.size())).getWarehouseId();
            String w2 = warehouses.get(rand.nextInt(warehouses.size())).getWarehouseId();
            if (!w1.equals(w2)) {
                list.add(new Route("RT" + i, w1, w2, 50 + rand.nextDouble()*1000, 100 + rand.nextDouble()*500));
            }
        }
        return list;
    }
}
