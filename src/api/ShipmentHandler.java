package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import models.Shipment;
import services.LogisticsService;
import utils.HttpUtil;
import utils.Logger;
import utils.PaginationUtil;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ShipmentHandler implements HttpHandler {
    private final LogisticsService logisticsService;

    public ShipmentHandler(LogisticsService logisticsService) {
        this.logisticsService = logisticsService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        String[] parts = path.split("/");
        Map<String, String> queryParams = HttpUtil.parseQuery(exchange.getRequestURI().getQuery());

        try {
            if ("GET".equalsIgnoreCase(method)) {
                if (parts.length == 3 || path.endsWith("/search")) {
                    List<Shipment> all = logisticsService.getAllShipments();
                    
                    if (queryParams.containsKey("status")) {
                        String status = queryParams.get("status").toUpperCase();
                        all = all.stream().filter(s -> s.getStatus().name().equals(status)).collect(Collectors.toList());
                    }
                    
                    all = PaginationUtil.paginate(all, queryParams);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Shipments retrieved", all));
                    
                } else if (parts.length == 4 && !path.endsWith("/search")) {
                    String id = parts[3];
                    Shipment s = logisticsService.getShipment(id);
                    if (s != null) {
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Shipment found", s));
                    } else {
                        ApiServer.sendResponse(exchange, 404, JsonUtil.error("Shipment Not Found"));
                    }
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                String body = ApiServer.readRequestBody(exchange);
                Map<String, Object> req = JsonUtil.parseMap(body);

                String orderId = (String) req.get("orderId");
                String sourceId = (String) req.get("sourceWarehouseId");
                String destId = (String) req.get("destinationWarehouseId");

                if (orderId == null || sourceId == null || destId == null) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing required fields: orderId, sourceWarehouseId, destinationWarehouseId"));
                    return;
                }

                Shipment s = logisticsService.createShipment(orderId, sourceId, destId);
                ApiServer.sendResponse(exchange, 201, JsonUtil.success("Shipment Created", s));
                Logger.info("Created shipment: " + s.getShipmentId());

            } else if ("PUT".equalsIgnoreCase(method)) {
                if (parts.length == 4) {
                    String id = parts[3];
                    String body = ApiServer.readRequestBody(exchange);
                    Map<String, Object> req = JsonUtil.parseMap(body);
                    String action = (String) req.get("action");

                    boolean success = false;
                    if ("assign".equalsIgnoreCase(action)) {
                        success = logisticsService.assignDriver(id);
                        if (success) {
                            ApiServer.sendResponse(exchange, 200, JsonUtil.success("Driver assigned successfully"));
                            Logger.info("Assigned driver to shipment: " + id);
                        } else {
                            ApiServer.sendResponse(exchange, 400, JsonUtil.error("Failed to assign driver. Route might not exist or no drivers available."));
                        }
                    } else if ("complete".equalsIgnoreCase(action)) {
                        success = logisticsService.completeDelivery(id);
                        if (success) {
                            ApiServer.sendResponse(exchange, 200, JsonUtil.success("Shipment completed"));
                            Logger.info("Completed shipment: " + id);
                        } else {
                            ApiServer.sendResponse(exchange, 400, JsonUtil.error("Failed to complete shipment"));
                        }
                    } else {
                        ApiServer.sendResponse(exchange, 400, JsonUtil.error("Invalid action"));
                    }
                } else {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing shipment ID"));
                }
            } else {
                ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
            }
        } catch (Exception e) {
            Logger.error("Error in ShipmentHandler: " + e.getMessage());
            ApiServer.sendResponse(exchange, 500, JsonUtil.error("Internal Server Error"));
        }
    }
}
