package services;

import storage.FileManager;
import datastructures.analytics.SegmentTree;
import datastructures.analytics.FenwickTree;
import models.SalesRecord;
import models.WarehouseInventory;
import java.util.List;

public class ExecutiveDashboardService {
    private FileManager fileManager;
    private FenwickTree revenueTree;
    private SegmentTree inventoryTree;

    public ExecutiveDashboardService(FileManager fileManager) {
        this.fileManager = fileManager;
        buildTrees();
    }

    public void printRebuildStatus() {
        System.out.println("Sales Records Loaded");
        System.out.println("Segment Tree Built");
        System.out.println("Fenwick Tree Built");
    }

    private void buildTrees() {
        List<SalesRecord> sales = fileManager.loadSalesRecords();
        revenueTree = new FenwickTree(Math.max(sales.size(), 100));
        int idx = 0;
        for (SalesRecord s : sales) {
            revenueTree.update(idx++, s.getRevenue());
        }

        List<WarehouseInventory> inventory = fileManager.loadWarehouseInventory();
        int[] invArr = new int[inventory.size()];
        for(int i=0; i<inventory.size(); i++) {
            invArr[i] = inventory.get(i).getQuantity();
        }
        inventoryTree = new SegmentTree(invArr);
    }

    public void showDashboard() {
        System.out.println("\n==============================================");
        System.out.println("         EXECUTIVE DASHBOARD");
        System.out.println("==============================================");
        System.out.println("Total Warehouses: " + fileManager.loadWarehouses().size());
        System.out.println("Total Suppliers: " + fileManager.loadSuppliers().size());
        System.out.println("Total Products: " + fileManager.loadProducts().size());
        System.out.println("Total Orders: " + fileManager.loadOrders().size());
        System.out.println("Active Shipments: " + fileManager.loadShipments().size());
        
        double totalRev = revenueTree.prefixSum(100); 
        System.out.printf("Total Global Revenue: $%.2f\n", totalRev);
        
        List<WarehouseInventory> inventory = fileManager.loadWarehouseInventory();
        if (!inventory.isEmpty()) {
            System.out.println("Max Stock Single Block: " + inventoryTree.rangeMax(0, inventory.size()-1));
            System.out.println("Min Stock Single Block: " + inventoryTree.rangeMin(0, inventory.size()-1));
            System.out.println("Total System Stock: " + inventoryTree.rangeSum(0, inventory.size()-1));
        }
        System.out.println("==============================================");
    }

    public FenwickTree getRevenueTree() {
        return revenueTree;
    }

    public SegmentTree getInventoryTree() {
        return inventoryTree;
    }

    public List<SalesRecord> getSalesRecords() {
        return fileManager.loadSalesRecords();
    }

    public List<WarehouseInventory> getWarehouseInventory() {
        return fileManager.loadWarehouseInventory();
    }
}
