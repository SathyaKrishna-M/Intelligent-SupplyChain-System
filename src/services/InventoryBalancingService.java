package services;

import models.WarehouseInventory;
import datastructures.Graph;
import datastructures.Dijkstra;
import storage.FileManager;
import java.util.List;

public class InventoryBalancingService {
    private FileManager fileManager;
    private Graph graph;

    public InventoryBalancingService(FileManager fileManager, Graph graph) {
        this.fileManager = fileManager;
        this.graph = graph;
    }

    public void detectAndBalanceImbalance() {
        List<WarehouseInventory> inventory = fileManager.loadWarehouseInventory();
        System.out.println("\n--- Smart Inventory Balancing ---");
        
        boolean found = false;
        for (int i = 0; i < inventory.size(); i++) {
            for (int j = 0; j < inventory.size(); j++) {
                if (i != j && inventory.get(i).getProductId().equals(inventory.get(j).getProductId())) {
                    WarehouseInventory a = inventory.get(i);
                    WarehouseInventory b = inventory.get(j);
                    
                    if (a.getQuantity() > 800 && b.getQuantity() < 100) {
                        found = true;
                        int transferAmount = (a.getQuantity() - b.getQuantity()) / 2;
                        
                        System.out.println("Imbalance Detected: Product " + a.getProductId());
                        System.out.println("Warehouse " + a.getWarehouseId() + " (" + a.getQuantity() + ") -> Warehouse " + b.getWarehouseId() + " (" + b.getQuantity() + ")");
                        
                        Dijkstra.DijkstraResult res = Dijkstra.findShortestPath(graph, a.getWarehouseId(), b.getWarehouseId());
                        if (res.totalDistance > 0) {
                            System.out.println("Recommendation: Transfer " + transferAmount + " units.");
                            System.out.println("Estimated Distance: " + res.totalDistance + " km");
                            System.out.println("Estimated Cost: $" + res.totalCost);
                        } else {
                            System.out.println("Recommendation: Transfer " + transferAmount + " units, but NO VALID ROUTE EXISTS.");
                        }
                        System.out.println("-");
                    }
                }
            }
        }
        
        if (!found) {
            System.out.println("Inventory is well balanced across all regions.");
        }
    }
}
