package services;

import storage.FileManager;
import datastructures.analytics.SegmentTree;
import datastructures.analytics.FenwickTree;
import models.SalesRecord;
import models.Shipment;
import models.WarehouseInventory;
import java.util.List;

public class ExecutiveDashboardService {
    private FileManager fileManager;
    private FenwickTree revenueFenwick;
    private FenwickTree volumeFenwick;
    private FenwickTree shipmentFenwick;
    private SegmentTree revenueSegment;
    private SegmentTree inventorySegment;

    public ExecutiveDashboardService(FileManager fileManager) {
        this.fileManager = fileManager;
        buildTrees();
    }

    public void printRebuildStatus() {
        System.out.println("Sales Records Loaded");
        System.out.println("Segment Trees Built (Inventory, Revenue)");
        System.out.println("Fenwick Trees Built (Revenue, Volume, Shipments)");
    }

    private void buildTrees() {
        List<SalesRecord> sales = fileManager.loadSalesRecords();
        int nSales = Math.max(sales.size(), 1);
        
        revenueFenwick = new FenwickTree(nSales);
        volumeFenwick = new FenwickTree(nSales);
        int[] revArr = new int[nSales];
        
        int idx = 0;
        for (SalesRecord s : sales) {
            revenueFenwick.update(idx, s.getRevenue());
            volumeFenwick.update(idx, s.getQuantitySold());
            revArr[idx] = (int) s.getRevenue(); // SegmentTree handles ints
            idx++;
        }
        revenueSegment = new SegmentTree(revArr);

        List<WarehouseInventory> inventory = fileManager.loadWarehouseInventory();
        int[] invArr = new int[Math.max(inventory.size(), 1)];
        for(int i=0; i<inventory.size(); i++) {
            invArr[i] = inventory.get(i).getQuantity();
        }
        inventorySegment = new SegmentTree(invArr);

        List<Shipment> shipments = fileManager.loadShipments();
        int nShipments = Math.max(shipments.size(), 1);
        shipmentFenwick = new FenwickTree(nShipments);
        for (int i = 0; i < shipments.size(); i++) {
            shipmentFenwick.update(i, 1.0); // Each shipment counts as 1
        }
    }

    // --- DSA Range Query API ---
    
    public double getCumulativeRevenue(int dayIndex) {
        if (dayIndex < 0) return 0;
        return revenueFenwick.prefixSum(dayIndex);
    }
    
    public double getSalesVolumeRange(int start, int end) {
        return volumeFenwick.rangeSum(start, end);
    }
    
    public int getRunningShipments(int dayIndex) {
        if (dayIndex < 0) return 0;
        return (int) shipmentFenwick.prefixSum(dayIndex);
    }
    
    public double getRevenueRangeSum(int start, int end) {
        return revenueSegment.rangeSum(start, end);
    }
    
    public int getInventoryMax(int start, int end) {
        return inventorySegment.rangeMax(start, end);
    }
    
    public int getInventoryMin(int start, int end) {
        return inventorySegment.rangeMin(start, end);
    }
    
    public int getInventorySum(int start, int end) {
        return inventorySegment.rangeSum(start, end);
    }

    // --- Legacy / UI Methods ---

    public void showDashboard() {
        System.out.println("\n==============================================");
        System.out.println("         EXECUTIVE DASHBOARD");
        System.out.println("==============================================");
        System.out.println("Total Warehouses: " + fileManager.loadWarehouses().size());
        
        List<SalesRecord> sales = getSalesRecords();
        if (!sales.isEmpty()) {
            double totalRev = getCumulativeRevenue(sales.size() - 1); 
            System.out.printf("Total Global Revenue: $%.2f\n", totalRev);
        }
        
        List<WarehouseInventory> inventory = getWarehouseInventory();
        if (!inventory.isEmpty()) {
            System.out.println("Max Stock Single Block: " + getInventoryMax(0, inventory.size()-1));
            System.out.println("Min Stock Single Block: " + getInventoryMin(0, inventory.size()-1));
            System.out.println("Total System Stock: " + getInventorySum(0, inventory.size()-1));
        }
        System.out.println("==============================================");
    }

    public List<SalesRecord> getSalesRecords() {
        return fileManager.loadSalesRecords();
    }

    public List<WarehouseInventory> getWarehouseInventory() {
        return fileManager.loadWarehouseInventory();
    }
}
