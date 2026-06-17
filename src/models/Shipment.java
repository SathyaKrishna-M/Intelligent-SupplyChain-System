package models;

public class Shipment {
    private String shipmentId;
    private String orderId;
    private String sourceWarehouseId;
    private String destinationWarehouseId;
    private String driverId;
    private String routeId;
    private ShipmentStatus status;
    private String createdDate;

    public Shipment(String shipmentId, String orderId, String sourceWarehouseId, String destinationWarehouseId, String driverId, String routeId, ShipmentStatus status, String createdDate) {
        this.shipmentId = shipmentId;
        this.orderId = orderId;
        this.sourceWarehouseId = sourceWarehouseId;
        this.destinationWarehouseId = destinationWarehouseId;
        this.driverId = driverId;
        this.routeId = routeId;
        this.status = status;
        this.createdDate = createdDate;
    }

    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getSourceWarehouseId() { return sourceWarehouseId; }
    public void setSourceWarehouseId(String sourceWarehouseId) { this.sourceWarehouseId = sourceWarehouseId; }
    public String getDestinationWarehouseId() { return destinationWarehouseId; }
    public void setDestinationWarehouseId(String destinationWarehouseId) { this.destinationWarehouseId = destinationWarehouseId; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getRouteId() { return routeId; }
    public void setRouteId(String routeId) { this.routeId = routeId; }
    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
}
