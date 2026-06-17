package models;

public class Order {
    private String orderId;
    private String supplierId;
    private String warehouseId;
    private String orderDate;
    private String deliveryDate;
    private OrderStatus status;
    private double totalCost;

    public Order(String orderId, String supplierId, String warehouseId, String orderDate, String deliveryDate, OrderStatus status, double totalCost) {
        this.orderId = orderId;
        this.supplierId = supplierId;
        this.warehouseId = warehouseId;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.status = status;
        this.totalCost = totalCost;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }
    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
    public String getOrderDate() { return orderDate; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }
    public String getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }
}
