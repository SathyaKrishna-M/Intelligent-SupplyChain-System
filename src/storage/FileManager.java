package storage;

import models.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class FileManager {
    private static final String DATA_DIR;
    private static final String REPORTS_DIR;

    static {
        // Handle being run from either project root or inside src/
        if (new java.io.File("src/data").exists()) {
            DATA_DIR = "src/data/";
            REPORTS_DIR = "reports/";
        } else if (new java.io.File("data").exists()) {
            DATA_DIR = "data/";
            REPORTS_DIR = "../reports/";
        } else {
            DATA_DIR = "src/data/"; // Fallback
            REPORTS_DIR = "reports/";
        }
    }

    private static final String USERS_FILE = DATA_DIR + "users.txt";
    private static final String PRODUCTS_FILE = DATA_DIR + "products.txt";
    private static final String WAREHOUSES_FILE = DATA_DIR + "warehouses.txt";
    private static final String SUPPLIERS_FILE = DATA_DIR + "suppliers.txt";
    private static final String ORDERS_FILE = DATA_DIR + "orders.txt";
    private static final String DELIVERIES_FILE = DATA_DIR + "deliveries.txt";
    private static final String WAREHOUSE_INVENTORY_FILE = DATA_DIR + "warehouse_inventory.txt";
    private static final String PURCHASE_REQUESTS_FILE = DATA_DIR + "purchase_requests.txt";
    private static final String ORDER_ITEMS_FILE = DATA_DIR + "order_items.txt";
    private static final String DRIVERS_FILE = DATA_DIR + "drivers.txt";
    private static final String ROUTES_FILE = DATA_DIR + "routes.txt";
    private static final String SHIPMENTS_FILE = DATA_DIR + "shipments.txt";
    private static final String SALES_FILE = DATA_DIR + "sales.txt";
    private static final String ACTIVITIES_FILE = DATA_DIR + "activities.txt";
    private static final String NOTIFICATIONS_FILE = DATA_DIR + "notifications.txt";

    public FileManager() {
        File dir = new File(DATA_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        File rDir = new File(REPORTS_DIR);
        if (!rDir.exists()) {
            rDir.mkdirs();
        }
    }

    // Users
    public List<User> loadUsers() {
        List<User> users = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(USERS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length >= 4) {
                    Role role = Role.valueOf(parts[3]);
                    switch (role) {
                        case ADMIN: users.add(new Admin(parts[0], parts[1], parts[2])); break;
                        case WAREHOUSE_MANAGER: users.add(new WarehouseManager(parts[0], parts[1], parts[2])); break;
                        case LOGISTICS_MANAGER: users.add(new LogisticsManager(parts[0], parts[1], parts[2])); break;
                        case SUPPLIER: users.add(new SupplierUser(parts[0], parts[1], parts[2])); break;
                    }
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return users;
    }

    public void saveUsers(List<User> users) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(USERS_FILE))) {
            for (User u : users) {
                bw.write(u.getId() + "," + u.getUsername() + "," + u.getPassword() + "," + u.getRole().name());
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Products
    public List<Product> loadProducts() {
        List<Product> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(PRODUCTS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 7) {
                    list.add(new Product(p[0], p[1], p[2], Integer.parseInt(p[3]), 
                        Double.parseDouble(p[4]), Double.parseDouble(p[5]), p[6]));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveProducts(List<Product> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(PRODUCTS_FILE))) {
            for (Product p : list) {
                bw.write(String.join(",", p.getProductId(), p.getName(), p.getCategory(), 
                    String.valueOf(p.getStockQuantity()), String.valueOf(p.getCostPrice()), 
                    String.valueOf(p.getSellingPrice()), p.getSupplierId()));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Warehouses
    public List<Warehouse> loadWarehouses() {
        List<Warehouse> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(WAREHOUSES_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 4) {
                    list.add(new Warehouse(p[0], p[1], p[2], Integer.parseInt(p[3])));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveWarehouses(List<Warehouse> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(WAREHOUSES_FILE))) {
            for (Warehouse w : list) {
                bw.write(String.join(",", w.getWarehouseId(), w.getWarehouseName(), w.getLocation(), String.valueOf(w.getCapacity())));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Suppliers
    public List<Supplier> loadSuppliers() {
        List<Supplier> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(SUPPLIERS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length >= 3) {
                    double rating = p.length > 3 ? Double.parseDouble(p[3]) : 0.0;
                    list.add(new Supplier(p[0], p[1], p[2], rating));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveSuppliers(List<Supplier> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(SUPPLIERS_FILE))) {
            for (Supplier s : list) {
                bw.write(String.join(",", s.getSupplierId(), s.getSupplierName(), s.getContactInfo(), String.valueOf(s.getRating())));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Orders
    public List<Order> loadOrders() {
        List<Order> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(ORDERS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 7) {
                    list.add(new Order(p[0], p[1], p[2], p[3], p[4], OrderStatus.valueOf(p[5]), Double.parseDouble(p[6])));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveOrders(List<Order> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(ORDERS_FILE))) {
            for (Order o : list) {
                bw.write(String.join(",", o.getOrderId(), o.getSupplierId(), o.getWarehouseId(), 
                    o.getOrderDate(), o.getDeliveryDate(), o.getStatus().name(), String.valueOf(o.getTotalCost())));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // OrderItems
    public List<OrderItem> loadOrderItems() {
        List<OrderItem> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(ORDER_ITEMS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 4) {
                    list.add(new OrderItem(p[0], p[1], Integer.parseInt(p[2]), Double.parseDouble(p[3])));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveOrderItems(List<OrderItem> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(ORDER_ITEMS_FILE))) {
            for (OrderItem oi : list) {
                bw.write(String.join(",", oi.getOrderId(), oi.getProductId(), String.valueOf(oi.getQuantity()), String.valueOf(oi.getUnitPrice())));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Purchase Requests
    public List<PurchaseRequest> loadPurchaseRequests() {
        List<PurchaseRequest> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(PURCHASE_REQUESTS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 6) {
                    list.add(new PurchaseRequest(p[0], p[1], p[2], Integer.parseInt(p[3]), p[4], RequestStatus.valueOf(p[5])));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void savePurchaseRequests(List<PurchaseRequest> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(PURCHASE_REQUESTS_FILE))) {
            for (PurchaseRequest pr : list) {
                bw.write(String.join(",", pr.getRequestId(), pr.getWarehouseId(), pr.getProductId(), 
                    String.valueOf(pr.getRequestedQuantity()), pr.getRequestDate(), pr.getStatus().name()));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Deliveries
    public List<Delivery> loadDeliveries() {
        List<Delivery> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(DELIVERIES_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 7) {
                    list.add(new Delivery(p[0], p[1], p[2], p[3], DeliveryStatus.valueOf(p[4]), p[5], p[6]));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveDeliveries(List<Delivery> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(DELIVERIES_FILE))) {
            for (Delivery d : list) {
                bw.write(String.join(",", d.getDeliveryId(), d.getOrderId(), d.getSourceWarehouse(), 
                    d.getDestinationWarehouse(), d.getStatus().name(), d.getEstimatedDeliveryDate(), d.getActualDeliveryDate()));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Warehouse Inventory
    public List<WarehouseInventory> loadWarehouseInventory() {
        List<WarehouseInventory> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(WAREHOUSE_INVENTORY_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 3) {
                    list.add(new WarehouseInventory(p[0], p[1], Integer.parseInt(p[2])));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveWarehouseInventory(List<WarehouseInventory> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(WAREHOUSE_INVENTORY_FILE))) {
            for (WarehouseInventory wi : list) {
                bw.write(String.join(",", wi.getWarehouseId(), wi.getProductId(), String.valueOf(wi.getQuantity())));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Drivers
    public List<Driver> loadDrivers() {
        List<Driver> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(DRIVERS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 4) {
                    list.add(new Driver(p[0], p[1], p[2], DriverStatus.valueOf(p[3])));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveDrivers(List<Driver> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(DRIVERS_FILE))) {
            for (Driver d : list) {
                bw.write(String.join(",", d.getDriverId(), d.getDriverName(), d.getPhone(), d.getAvailabilityStatus().name()));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Routes
    public List<Route> loadRoutes() {
        List<Route> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(ROUTES_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 5) {
                    list.add(new Route(p[0], p[1], p[2], Double.parseDouble(p[3]), Double.parseDouble(p[4])));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveRoutes(List<Route> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(ROUTES_FILE))) {
            for (Route r : list) {
                bw.write(String.join(",", r.getRouteId(), r.getSourceWarehouseId(), r.getDestinationWarehouseId(), 
                    String.valueOf(r.getDistance()), String.valueOf(r.getTransportCost())));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Shipments
    public List<Shipment> loadShipments() {
        List<Shipment> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(SHIPMENTS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 8) {
                    list.add(new Shipment(p[0], p[1], p[2], p[3], p[4], p[5], ShipmentStatus.valueOf(p[6]), p[7]));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveShipments(List<Shipment> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(SHIPMENTS_FILE))) {
            for (Shipment s : list) {
                bw.write(String.join(",", s.getShipmentId(), s.getOrderId(), s.getSourceWarehouseId(), 
                    s.getDestinationWarehouseId(), s.getDriverId(), s.getRouteId(), s.getStatus().name(), s.getCreatedDate()));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Sales Records
    public List<SalesRecord> loadSalesRecords() {
        List<SalesRecord> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(SALES_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                if (p.length == 6) {
                    list.add(new SalesRecord(p[0], p[1], p[2], Integer.parseInt(p[3]), Double.parseDouble(p[4]), p[5]));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveSalesRecords(List<SalesRecord> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(SALES_FILE))) {
            for (SalesRecord s : list) {
                bw.write(String.join(",", s.getRecordId(), s.getProductId(), s.getWarehouseId(), 
                    String.valueOf(s.getQuantitySold()), String.valueOf(s.getRevenue()), s.getDate()));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Activities
    public List<Activity> loadActivities() {
        List<Activity> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(ACTIVITIES_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",", -1);
                if (p.length >= 8) {
                    list.add(new Activity(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveActivities(List<Activity> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(ACTIVITIES_FILE))) {
            for (Activity a : list) {
                bw.write(String.join(",", a.getId(), a.getTimestamp(), a.getUser(), a.getRole(), 
                    a.getAction(), a.getEntityType(), a.getEntityId(), a.getDescription()));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    // Notifications
    public List<Notification> loadNotifications() {
        List<Notification> list = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(NOTIFICATIONS_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",", -1);
                if (p.length >= 7) {
                    Role role = "ALL".equals(p[6]) ? null : Role.valueOf(p[6]);
                    list.add(new Notification(p[0], Notification.Severity.valueOf(p[1]), p[2], p[3], p[4], Boolean.parseBoolean(p[5]), role));
                }
            }
        } catch (FileNotFoundException e) {} catch (IOException e) { e.printStackTrace(); }
        return list;
    }

    public void saveNotifications(List<Notification> list) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(NOTIFICATIONS_FILE))) {
            for (Notification n : list) {
                String roleStr = n.getTargetRole() == null ? "ALL" : n.getTargetRole().name();
                bw.write(String.join(",", n.getId(), n.getSeverity().name(), n.getTitle(), n.getMessage(), n.getCreatedAt(), String.valueOf(n.isRead()), roleStr));
                bw.newLine();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }
}
