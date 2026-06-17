package models;

public class Route {
    private String routeId;
    private String sourceWarehouseId;
    private String destinationWarehouseId;
    private double distance;
    private double transportCost;

    public Route(String routeId, String sourceWarehouseId, String destinationWarehouseId, double distance, double transportCost) {
        this.routeId = routeId;
        this.sourceWarehouseId = sourceWarehouseId;
        this.destinationWarehouseId = destinationWarehouseId;
        this.distance = distance;
        this.transportCost = transportCost;
    }

    public String getRouteId() { return routeId; }
    public void setRouteId(String routeId) { this.routeId = routeId; }
    public String getSourceWarehouseId() { return sourceWarehouseId; }
    public void setSourceWarehouseId(String sourceWarehouseId) { this.sourceWarehouseId = sourceWarehouseId; }
    public String getDestinationWarehouseId() { return destinationWarehouseId; }
    public void setDestinationWarehouseId(String destinationWarehouseId) { this.destinationWarehouseId = destinationWarehouseId; }
    public double getDistance() { return distance; }
    public void setDistance(double distance) { this.distance = distance; }
    public double getTransportCost() { return transportCost; }
    public void setTransportCost(double transportCost) { this.transportCost = transportCost; }
}
