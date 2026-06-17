package services;

import models.Warehouse;
import models.WarehouseInventory;
import models.Product;
import storage.FileManager;
import java.util.ArrayList;
import java.util.List;

public class WarehouseService {
    private FileManager fileManager;
    private List<Warehouse> warehouses;
    private List<WarehouseInventory> inventoryRecords;
    private ProductService productService;

    public WarehouseService(FileManager fileManager, ProductService productService) {
        this.fileManager = fileManager;
        this.warehouses = fileManager.loadWarehouses();
        this.inventoryRecords = fileManager.loadWarehouseInventory();
        this.productService = productService;
    }

    public void addWarehouse(Warehouse w) {
        warehouses.add(w);
        fileManager.saveWarehouses(warehouses);
    }

    public boolean updateWarehouse(String warehouseId, String newName) {
        for (Warehouse w : warehouses) {
            if (w.getWarehouseId().equals(warehouseId)) {
                w.setWarehouseName(newName);
                fileManager.saveWarehouses(warehouses);
                return true;
            }
        }
        return false;
    }

    public Warehouse findWarehouse(String warehouseId) {
        for (Warehouse w : warehouses) {
            if (w.getWarehouseId().equals(warehouseId)) return w;
        }
        return null;
    }

    public List<Warehouse> getAllWarehouses() {
        return new ArrayList<>(warehouses);
    }

    public void assignProductToWarehouse(String warehouseId, String productId, int quantity) {
        WarehouseInventory record = findInventoryRecord(warehouseId, productId);
        if (record != null) {
            record.setQuantity(record.getQuantity() + quantity);
        } else {
            inventoryRecords.add(new WarehouseInventory(warehouseId, productId, quantity));
        }
        syncInventory();
        updateGlobalProductStock(productId);
    }

    public boolean increaseStock(String warehouseId, String productId, int amount) {
        WarehouseInventory record = findInventoryRecord(warehouseId, productId);
        if (record != null) {
            record.setQuantity(record.getQuantity() + amount);
            syncInventory();
            updateGlobalProductStock(productId);
            return true;
        }
        return false;
    }

    public boolean decreaseStock(String warehouseId, String productId, int amount) {
        WarehouseInventory record = findInventoryRecord(warehouseId, productId);
        if (record != null && record.getQuantity() >= amount) {
            record.setQuantity(record.getQuantity() - amount);
            syncInventory();
            updateGlobalProductStock(productId);
            return true;
        }
        return false;
    }

    public boolean transferStock(String sourceId, String destId, String productId, int amount) {
        if (decreaseStock(sourceId, productId, amount)) {
            assignProductToWarehouse(destId, productId, amount);
            return true;
        }
        return false;
    }

    public List<WarehouseInventory> getWarehouseInventory(String warehouseId) {
        List<WarehouseInventory> result = new ArrayList<>();
        for (WarehouseInventory wi : inventoryRecords) {
            if (wi.getWarehouseId().equals(warehouseId)) {
                result.add(wi);
            }
        }
        return result;
    }

    public void generateReport(String warehouseId) {
        Warehouse w = findWarehouse(warehouseId);
        if (w == null) {
            System.out.println("Warehouse not found.");
            return;
        }

        List<WarehouseInventory> records = getWarehouseInventory(warehouseId);
        System.out.println("\n--- Warehouse Report ---");
        System.out.println("Warehouse Name: " + w.getWarehouseName());
        System.out.println("Location: " + w.getLocation());
        System.out.println("Total Different Products Stored: " + records.size());

        int totalInventory = 0;
        int lowStockCount = 0;

        System.out.println("\nProducts:");
        System.out.printf("%-10s %-20s %-10s %-10s\n", "ID", "NAME", "STOCK", "STATUS");

        for (WarehouseInventory wi : records) {
            Product p = productService.searchProductById(wi.getProductId());
            String name = (p != null) ? p.getName() : "Unknown";
            int stock = wi.getQuantity();
            totalInventory += stock;
            String status = "OK";
            if (stock < 20) { // Assuming 20 is low stock threshold for warehouse report too
                lowStockCount++;
                status = "LOW STOCK";
            }
            System.out.printf("%-10s %-20s %-10d %-10s\n", wi.getProductId(), name, stock, status);
        }

        System.out.println("\nTotal Inventory Items: " + totalInventory);
        System.out.println("Low Stock Count: " + lowStockCount);
        System.out.println("------------------------\n");
    }

    private WarehouseInventory findInventoryRecord(String warehouseId, String productId) {
        for (WarehouseInventory wi : inventoryRecords) {
            if (wi.getWarehouseId().equals(warehouseId) && wi.getProductId().equals(productId)) {
                return wi;
            }
        }
        return null;
    }

    private void syncInventory() {
        fileManager.saveWarehouseInventory(inventoryRecords);
    }
    
    private void updateGlobalProductStock(String productId) {
        int total = 0;
        for (WarehouseInventory wi : inventoryRecords) {
            if (wi.getProductId().equals(productId)) {
                total += wi.getQuantity();
            }
        }
        productService.setProductStock(productId, total);
    }
}
