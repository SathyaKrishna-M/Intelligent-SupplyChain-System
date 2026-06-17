package models;

public class Product {
    private String productId;
    private String name;
    private String category;
    private int stockQuantity;
    private double costPrice;
    private double sellingPrice;
    private String supplierId;

    public Product(String productId, String name, String category, int stockQuantity, double costPrice, double sellingPrice, String supplierId) {
        this.productId = productId;
        this.name = name;
        this.category = category;
        this.stockQuantity = stockQuantity;
        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
        this.supplierId = supplierId;
    }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
    public double getCostPrice() { return costPrice; }
    public void setCostPrice(double costPrice) { this.costPrice = costPrice; }
    public double getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(double sellingPrice) { this.sellingPrice = sellingPrice; }
    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }
}
