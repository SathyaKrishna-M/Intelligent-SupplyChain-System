import storage.FileManager;
import datastructures.Graph;
import datastructures.Dijkstra;
import models.Route;
import java.util.List;

public class GraphTest {
    public static void main(String[] args) {
        FileManager fm = new FileManager();
        Graph graph = new Graph();
        List<Route> routes = fm.loadRoutes();
        for (Route r : routes) {
            graph.addRoute(r);
        }

        System.out.println("TEST 1: Southern (W004) -> West Coast (W002)");
        Dijkstra.DijkstraResult res1 = Dijkstra.findShortestPath(graph, "W004", "W002");
        res1.printResult();

        System.out.println("\nTEST 2: West Coast (W002) -> Southern (W004)");
        Dijkstra.DijkstraResult res2 = Dijkstra.findShortestPath(graph, "W002", "W004");
        res2.printResult();
        
        System.out.println("\nTEST 3: Southern (W004) -> Central (W001)");
        Dijkstra.DijkstraResult res3 = Dijkstra.findShortestPath(graph, "W004", "W001");
        res3.printResult();
        
        System.out.println("\nTEST 4: Southern (W004) -> Midwest (W003) -> West Coast (W002)");
        // Just print path from W004 to W002 if that goes through Midwest? No, W004->W002 is direct.
    }
}
