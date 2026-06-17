package services;

import models.Product;
import java.util.List;
import java.util.PriorityQueue;

public class ReorderService {

    private ProductService productService;

    public void setProductService(ProductService productService) {
        this.productService = productService;
    }

    private static class ReorderItem implements Comparable<ReorderItem> {
        Product product;
        int priorityScore;
        int recommendedAmount;
        int predictedDemand;

        ReorderItem(Product product, int score, int amt, int demand) {
            this.product = product;
            this.priorityScore = score;
            this.recommendedAmount = amt;
            this.predictedDemand = demand;
        }

        @Override
        public int compareTo(ReorderItem other) {
            return Integer.compare(other.priorityScore, this.priorityScore); // High score first
        }
    }

    public void generateRecommendations(List<Product> lowStockProducts) {
        PriorityQueue<ReorderItem> pq = new PriorityQueue<>();
        for (Product p : lowStockProducts) {
            int currentStock = p.getStockQuantity();
            int predictedDemand = 0;
            if (productService != null) {
                predictedDemand = productService.predictDemand(p.getProductId());
            }

            int recommendedAmount = predictedDemand > 0 ? (predictedDemand - currentStock + 50) : 100;
            if (recommendedAmount < 50) recommendedAmount = 50;

            int score = 0;
            if (currentStock < (predictedDemand / 2)) score = 10;
            else if (currentStock < 10) score = 8;
            else score = 5;

            pq.offer(new ReorderItem(p, score, recommendedAmount, predictedDemand));
        }

        System.out.println("\n--- Smart Reorder Recommendations ---");
        if (pq.isEmpty()) {
            System.out.println("No products need reordering.");
            return;
        }

        while (!pq.isEmpty()) {
            ReorderItem item = pq.poll();
            Product p = item.product;
            String priority = item.priorityScore >= 8 ? "HIGH" : "NORMAL";
            
            System.out.println("LOW STOCK ALERT");
            System.out.println("Product: " + p.getName() + " (ID: " + p.getProductId() + ")");
            System.out.println("Current Stock: " + p.getStockQuantity());
            System.out.println("Predicted Demand: " + item.predictedDemand);
            System.out.println("Recommended Reorder: " + item.recommendedAmount);
            System.out.println("Priority: " + priority);
            System.out.println("-------------------------");
        }
    }
}
