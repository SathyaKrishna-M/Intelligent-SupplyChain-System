package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import datastructures.Dijkstra;
import models.Route;
import services.LogisticsService;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RouteHandler implements HttpHandler {
    private final LogisticsService logisticsService;

    public RouteHandler(LogisticsService logisticsService) {
        this.logisticsService = logisticsService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        try {
            if ("GET".equalsIgnoreCase(method)) {
                if (path.endsWith("/shortest")) {
                    String query = exchange.getRequestURI().getQuery();
                    Map<String, String> params = parseQuery(query);
                    String src = params.get("sourceWarehouseId");
                    String dest = params.get("destinationWarehouseId");

                    if (src == null || dest == null) {
                        ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing sourceWarehouseId or destinationWarehouseId"));
                        return;
                    }

                    Dijkstra.DijkstraResult result = logisticsService.findBestRoute(src, dest);
                    if (result.totalDistance != -1) {
                        Map<String, Object> resMap = new HashMap<>();
                        resMap.put("path", result.path);
                        resMap.put("distance", result.totalDistance);
                        resMap.put("cost", result.totalCost);
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Shortest route found", resMap));
                    } else {
                        ApiServer.sendResponse(exchange, 404, JsonUtil.error("No route found"));
                    }
                } else {
                    List<Route> routes = logisticsService.getGraph().getAllRoutes();
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Routes retrieved", routes));
                }
            } else {
                ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            ApiServer.sendResponse(exchange, 500, JsonUtil.error("Internal Server Error: " + e.getMessage()));
        }
    }

    private Map<String, String> parseQuery(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null || query.isEmpty()) return map;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=");
            if (kv.length == 2) {
                map.put(kv[0], kv[1]);
            }
        }
        return map;
    }
}
