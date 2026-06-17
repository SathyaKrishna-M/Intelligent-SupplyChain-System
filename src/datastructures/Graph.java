package datastructures;

import models.Route;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Graph {
    public static class Edge {
        public String target;
        public double distance;
        public double cost;
        public Route originalRoute;

        public Edge(String target, double distance, double cost, Route originalRoute) {
            this.target = target;
            this.distance = distance;
            this.cost = cost;
            this.originalRoute = originalRoute;
        }
    }

    private Map<String, List<Edge>> adjList;
    private List<Route> allRoutes;

    public Graph() {
        this.adjList = new HashMap<>();
        this.allRoutes = new ArrayList<>();
    }

    public void addWarehouse(String warehouseId) {
        if (!adjList.containsKey(warehouseId)) {
            adjList.put(warehouseId, new ArrayList<>());
        }
    }

    public void addRoute(Route r) {
        addWarehouse(r.getSourceWarehouseId());
        addWarehouse(r.getDestinationWarehouseId());
        
        // Add graph edges for bidirectional pathfinding
        adjList.get(r.getSourceWarehouseId()).add(new Edge(r.getDestinationWarehouseId(), r.getDistance(), r.getTransportCost(), r));
        adjList.get(r.getDestinationWarehouseId()).add(new Edge(r.getSourceWarehouseId(), r.getDistance(), r.getTransportCost(), r));
        
        // Maintain pure business route collection
        if (!allRoutes.contains(r)) {
            allRoutes.add(r);
        }
    }

    public void removeRoute(String routeId) {
        for (List<Edge> edges : adjList.values()) {
            edges.removeIf(e -> e.originalRoute.getRouteId().equals(routeId));
        }
        allRoutes.removeIf(r -> r.getRouteId().equals(routeId));
    }

    public List<Edge> getNeighbors(String warehouseId) {
        return adjList.getOrDefault(warehouseId, new ArrayList<>());
    }

    public List<String> getAllWarehouses() {
        return new ArrayList<>(adjList.keySet());
    }

    public List<Route> getAllRoutes() {
        return new ArrayList<>(allRoutes);
    }
}
