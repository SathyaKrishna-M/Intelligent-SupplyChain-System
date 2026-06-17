package models;

public class Delivery {
    private String deliveryId;
    private String orderId;
    private String sourceWarehouse;
    private String destinationWarehouse;
    private DeliveryStatus status;
    private String estimatedDeliveryDate;
    private String actualDeliveryDate;

    public Delivery(String deliveryId, String orderId, String sourceWarehouse, String destinationWarehouse, DeliveryStatus status, String estimatedDeliveryDate, String actualDeliveryDate) {
        this.deliveryId = deliveryId;
        this.orderId = orderId;
        this.sourceWarehouse = sourceWarehouse;
        this.destinationWarehouse = destinationWarehouse;
        this.status = status;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.actualDeliveryDate = actualDeliveryDate;
    }

    public String getDeliveryId() { return deliveryId; }
    public void setDeliveryId(String deliveryId) { this.deliveryId = deliveryId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getSourceWarehouse() { return sourceWarehouse; }
    public void setSourceWarehouse(String sourceWarehouse) { this.sourceWarehouse = sourceWarehouse; }
    public String getDestinationWarehouse() { return destinationWarehouse; }
    public void setDestinationWarehouse(String destinationWarehouse) { this.destinationWarehouse = destinationWarehouse; }
    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }
    public String getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(String estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getActualDeliveryDate() { return actualDeliveryDate; }
    public void setActualDeliveryDate(String actualDeliveryDate) { this.actualDeliveryDate = actualDeliveryDate; }
}
