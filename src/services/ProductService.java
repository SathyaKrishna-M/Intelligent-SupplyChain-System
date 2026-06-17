package services;

import models.Product;
import models.SalesRecord;
import datastructures.BST;
import datastructures.AVLTree;
import storage.FileManager;
import java.util.List;
import java.util.stream.Collectors;

public class ProductService {
    private FileManager fileManager;
    private BST productBST;
    private AVLTree productAVL;
    private LowStockMonitor lowStockMonitor;
    private ReorderService reorderService;
    private ActivityService activityService;
    private NotificationService notificationService;

    public ProductService(FileManager fileManager) {
        this.fileManager = fileManager;
        this.productBST = new BST();
        this.productAVL = new AVLTree();
        this.lowStockMonitor = new LowStockMonitor(20);
        this.reorderService = new ReorderService();
        this.reorderService.setProductService(this);
        
        List<Product> loadedProducts = fileManager.loadProducts();
        for (Product p : loadedProducts) {
            productBST.insert(p);
            productAVL.insert(p);
        }
    }

    public void setActivityService(ActivityService activityService) {
        this.activityService = activityService;
    }

    public void setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public void addProduct(Product p) throws IllegalArgumentException {
        if (p.getName() == null || p.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty.");
        }
        if (p.getStockQuantity() < 0) {
            throw new IllegalArgumentException("Stock cannot be negative.");
        }
        if (p.getSellingPrice() <= 0 || p.getCostPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0.");
        }
        if (productBST.search(p.getProductId()) != null) {
            throw new IllegalArgumentException("Duplicate Product ID not allowed.");
        }
        if (productAVL.search(p.getName()) != null) {
            throw new IllegalArgumentException("Duplicate Product Name not allowed.");
        }

        productBST.insert(p);
        productAVL.insert(p);
        syncToFile();
        utils.Logger.audit("PRODUCT_ADDED", "Product added: " + p.getProductId() + " - " + p.getName());
        if (activityService != null) {
            activityService.logActivity(null, "Product Added", "Product", p.getProductId(), "Added " + p.getName() + " to inventory");
        }
    }

    public void updateProduct(String productId, String newName, double newPrice) throws IllegalArgumentException {
        Product p = productBST.search(productId);
        if (p == null) {
            throw new IllegalArgumentException("Product not found.");
        }
        if (newPrice <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0.");
        }
        
        if (newName != null && !newName.trim().isEmpty() && !newName.equalsIgnoreCase(p.getName())) {
            if (productAVL.search(newName) != null) {
                throw new IllegalArgumentException("Duplicate Product Name not allowed.");
            }
            productAVL.delete(p.getName());
            p.setName(newName);
            productAVL.insert(p);
        }
        
        p.setSellingPrice(newPrice);
        syncToFile();
        if (activityService != null) {
            activityService.logActivity(null, "Product Updated", "Product", p.getProductId(), "Updated details for " + p.getName());
        }
    }

    public void deleteProduct(String productId) throws IllegalArgumentException {
        Product p = productBST.search(productId);
        if (p == null) {
            throw new IllegalArgumentException("Product not found.");
        }
        productBST.delete(productId);
        productAVL.delete(p.getName());
        syncToFile();
        utils.Logger.audit("PRODUCT_DELETED", "Product deleted: " + productId);
        if (activityService != null) {
            activityService.logActivity(null, "Product Deleted", "Product", productId, "Deleted product " + p.getName());
        }
    }

    public Product searchProductById(String productId) {
        return productBST.search(productId);
    }

    public Product searchProductByName(String name) {
        return productAVL.search(name);
    }

    public List<Product> listAllProducts() {
        return productBST.inorderTraversal();
    }

    public List<Product> getLowStockProducts() {
        return lowStockMonitor.checkLowStock(listAllProducts());
    }

    public void generateReorderSuggestions() {
        List<Product> lowStock = getLowStockProducts();
        reorderService.generateRecommendations(lowStock);
    }

    public void setProductStock(String productId, int newStock) {
        Product p = productBST.search(productId);
        if (p != null) {
            p.setStockQuantity(newStock);
            syncToFile();
            if (activityService != null) {
                activityService.logActivity(null, "Stock Updated", "Product", productId, "Stock for " + p.getName() + " updated to " + newStock);
            }
            if (newStock < 20 && notificationService != null) {
                notificationService.notify(models.Notification.Severity.WARNING, "Low Stock Alert", p.getName() + " is running low (" + newStock + " left).", models.Role.WAREHOUSE_MANAGER);
            }
        }
    }

    public int predictDemand(String productId) {
        List<SalesRecord> sales = fileManager.loadSalesRecords();
        List<SalesRecord> productSales = sales.stream()
            .filter(s -> s.getProductId().equals(productId))
            .collect(Collectors.toList());

        if (productSales.isEmpty()) return 0;
        
        int totalQty = 0;
        for (SalesRecord sr : productSales) {
            totalQty += sr.getQuantitySold();
        }
        
        return totalQty / productSales.size(); 
    }

    private void syncToFile() {
        fileManager.saveProducts(listAllProducts());
    }
}
