package models;

public class WarehouseInventory {
    private String warehouseId;
    private String productId;
    private int quantity;

    public WarehouseInventory(String warehouseId, String productId, int quantity) {
        this.warehouseId = warehouseId;
        this.productId = productId;
        this.quantity = quantity;
    }

    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
