package services;

import models.Product;
import java.util.ArrayList;
import java.util.List;

public class LowStockMonitor {
    private int threshold;

    public LowStockMonitor(int threshold) {
        this.threshold = threshold;
    }

    public void setThreshold(int threshold) {
        this.threshold = threshold;
    }

    public List<Product> checkLowStock(List<Product> products) {
        List<Product> lowStockProducts = new ArrayList<>();
        for (Product p : products) {
            if (p.getStockQuantity() < threshold) {
                lowStockProducts.add(p);
            }
        }
        return lowStockProducts;
    }
}
