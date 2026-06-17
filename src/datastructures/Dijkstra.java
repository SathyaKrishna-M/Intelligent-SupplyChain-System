package datastructures;

import models.Route;
import java.util.*;

public class Dijkstra {
    
    public static class DijkstraResult {
        public List<String> path;
        public double totalDistance;
        public double totalCost;

        public DijkstraResult(List<String> path, double totalDistance, double totalCost) {
            this.path = path;
            this.totalDistance = totalDistance;
            this.totalCost = totalCost;
        }
        
        public void printResult() {
            if (path == null || path.isEmpty()) {
                System.out.println("No route found.");
                return;
            }
            System.out.println(String.join(" -> ", path));
            System.out.println("Distance = " + totalDistance + " km");
            System.out.println("Cost = $" + totalCost);
        }
    }

    private static class PQNode {
        String id;
        double dist;
        PQNode(String id, double dist) {
            this.id = id;
            this.dist = dist;
        }
    }

    public static DijkstraResult findShortestPath(Graph graph, String sourceId, String destId) {
        Map<String, Double> dist = new HashMap<>();
        Map<String, Double> cost = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        PriorityQueue<PQNode> pq = new PriorityQueue<>(Comparator.comparingDouble(n -> n.dist));

        for (String node : graph.getAllWarehouses()) {
            dist.put(node, Double.MAX_VALUE);
            cost.put(node, 0.0);
        }

        if (!dist.containsKey(sourceId)) {
            return new DijkstraResult(new ArrayList<>(), -1, -1);
        }

        dist.put(sourceId, 0.0);
        pq.add(new PQNode(sourceId, 0.0));

        while (!pq.isEmpty()) {
            PQNode current = pq.poll();
            String u = current.id;

            if (current.dist > dist.get(u)) continue;

            if (u.equals(destId)) break;

            for (Graph.Edge edge : graph.getNeighbors(u)) {
                String v = edge.target;
                double alt = dist.get(u) + edge.distance;
                if (alt < dist.get(v)) {
                    dist.put(v, alt);
                    cost.put(v, cost.get(u) + edge.cost);
                    prev.put(v, u);
                    pq.add(new PQNode(v, alt));
                }
            }
        }

        if (dist.get(destId) == null || dist.get(destId) == Double.MAX_VALUE) {
            return new DijkstraResult(new ArrayList<>(), -1, -1);
        }

        List<String> path = new ArrayList<>();
        String curr = destId;
        while (curr != null) {
            path.add(0, curr);
            curr = prev.get(curr);
        }

        return new DijkstraResult(path, dist.get(destId), cost.get(destId));
    }
}
