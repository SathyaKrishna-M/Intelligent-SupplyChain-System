package services;

import datastructures.Graph;
import datastructures.Dijkstra;
import models.*;
import storage.FileManager;
import java.util.List;
import java.util.UUID;

public class LogisticsService {
    private FileManager fileManager;
    private List<Shipment> allShipments;
    private List<Delivery> deliveries;
    private DriverService driverService;
    private OrderService orderService;
    private Graph graph;
    private ActivityService activityService;
    private NotificationService notificationService;

    public LogisticsService(FileManager fileManager, DriverService driverService, OrderService orderService, Graph graph) {
        this.fileManager = fileManager;
        this.allShipments = fileManager.loadShipments();
        this.deliveries = fileManager.loadDeliveries();
        this.driverService = driverService;
        this.orderService = orderService;
        this.graph = graph;
    }

    public void setActivityService(ActivityService activityService) {
        this.activityService = activityService;
    }

    public void setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public void printRebuildStatus() {
        System.out.println("Shipments Loaded: " + allShipments.size());
    }

    public Shipment createShipment(String orderId, String sourceWarehouseId, String destinationWarehouseId) {
        String shipmentId = "SHP-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        Shipment shipment = new Shipment(shipmentId, orderId, sourceWarehouseId, destinationWarehouseId, "UNASSIGNED", "PENDING_ROUTE", ShipmentStatus.CREATED, java.time.LocalDate.now().toString());
        allShipments.add(shipment);
        fileManager.saveShipments(allShipments);
        utils.Logger.audit("SHIPMENT_CREATED", "Shipment created: " + shipmentId + " for Order: " + orderId);
        
        if (activityService != null) {
            activityService.logActivity(null, "Shipment Created", "Shipment", shipmentId, "Created shipment for order " + orderId);
        }
        
        return shipment;
    }

    public Dijkstra.DijkstraResult findBestRoute(String sourceWarehouseId, String destinationWarehouseId) {
        return Dijkstra.findShortestPath(graph, sourceWarehouseId, destinationWarehouseId);
    }

    public boolean assignDriver(String shipmentId) {
        Shipment s = getShipment(shipmentId);
        if (s == null || s.getStatus() != ShipmentStatus.CREATED) return false;

        List<Driver> availableDrivers = driverService.viewAvailableDrivers();
        if (availableDrivers.isEmpty()) {
            System.out.println("No drivers available at the moment.");
            return false;
        }

        Dijkstra.DijkstraResult result = findBestRoute(s.getSourceWarehouseId(), s.getDestinationWarehouseId());
        if (result.totalDistance == -1) {
            System.out.println("No valid route found between " + s.getSourceWarehouseId() + " and " + s.getDestinationWarehouseId());
            return false;
        }

        Driver bestDriver = availableDrivers.get(0);
        bestDriver.setAvailabilityStatus(DriverStatus.ON_TRIP);
        driverService.updateDriverStatus(bestDriver.getDriverId(), DriverStatus.ON_TRIP);

        s.setDriverId(bestDriver.getDriverId());
        s.setRouteId("ROUTE-" + result.path.hashCode());
        s.setStatus(ShipmentStatus.IN_TRANSIT);
        
        fileManager.saveShipments(allShipments);

        System.out.println("Best Driver Assigned: " + bestDriver.getDriverName() + " (ID: " + bestDriver.getDriverId() + ")");
        System.out.println("Estimated Travel Distance: " + result.totalDistance + " km");
        return true;
    }

    public Shipment getShipment(String shipmentId) {
        for (Shipment s : allShipments) {
            if (s.getShipmentId().equals(shipmentId)) return s;
        }
        return null;
    }

    public List<Shipment> getAllShipments() {
        return allShipments;
    }

    public boolean completeDelivery(String shipmentId) {
        Shipment s = getShipment(shipmentId);
        if (s != null && s.getStatus() == ShipmentStatus.IN_TRANSIT) {
            s.setStatus(ShipmentStatus.DELIVERED);
            fileManager.saveShipments(allShipments);

            driverService.updateDriverStatus(s.getDriverId(), DriverStatus.AVAILABLE);
            orderService.markDelivered(s.getOrderId());
            utils.Logger.audit("SHIPMENT_DELIVERED", "Shipment delivered: " + shipmentId);
            
            return true;
        }
        return false;
    }

    public void createDelivery(Delivery d) {
        deliveries.add(d);
        fileManager.saveDeliveries(deliveries);
    }

    public boolean updateDeliveryStatus(String deliveryId, DeliveryStatus status) {
        for (Delivery d : deliveries) {
            if (d.getDeliveryId().equals(deliveryId)) {
                d.setStatus(status);
                fileManager.saveDeliveries(deliveries);
                return true;
            }
        }
        return false;
    }

    public void addRoute(Route r) {
        graph.addRoute(r);
        fileManager.saveRoutes(graph.getAllRoutes());
    }

    public void removeRoute(String routeId) {
        graph.removeRoute(routeId);
        fileManager.saveRoutes(graph.getAllRoutes());
    }

    public Graph getGraph() {
        return graph;
    }
}
