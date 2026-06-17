package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import models.Warehouse;
import services.WarehouseService;
import utils.HttpUtil;
import utils.Logger;
import utils.PaginationUtil;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class WarehouseHandler implements HttpHandler {
    private final WarehouseService warehouseService;

    public WarehouseHandler(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
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
                    List<Warehouse> all = warehouseService.getAllWarehouses();
                    
                    if (queryParams.containsKey("q")) {
                        String q = queryParams.get("q").toLowerCase();
                        all = all.stream().filter(w -> w.getWarehouseName().toLowerCase().contains(q) || w.getWarehouseId().toLowerCase().contains(q)).collect(Collectors.toList());
                    }
                    if (queryParams.containsKey("location")) {
                        String loc = queryParams.get("location").toLowerCase();
                        all = all.stream().filter(w -> w.getLocation().toLowerCase().contains(loc)).collect(Collectors.toList());
                    }
                    
                    all = PaginationUtil.paginate(all, queryParams);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Warehouses retrieved", all));
                    
                } else if (parts.length == 4 && !path.endsWith("/search")) {
                    String id = parts[3];
                    Warehouse w = warehouseService.findWarehouse(id);
                    if (w != null) {
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Warehouse found", w));
                    } else {
                        ApiServer.sendResponse(exchange, 404, JsonUtil.error("Warehouse Not Found"));
                    }
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                String body = ApiServer.readRequestBody(exchange);
                Map<String, Object> req = JsonUtil.parseMap(body);

                String id = (String) req.get("warehouseId");
                String name = (String) req.get("warehouseName");
                String location = (String) req.get("location");
                int capacity = req.get("capacity") != null ? ((Number) req.get("capacity")).intValue() : 0;

                try {
                    if (id == null || id.trim().isEmpty() || name == null || name.trim().isEmpty() || location == null || location.trim().isEmpty()) {
                        throw new IllegalArgumentException("Fields cannot be empty.");
                    }
                    Warehouse w = new Warehouse(id, name, location, capacity);
                    warehouseService.addWarehouse(w);
                    ApiServer.sendResponse(exchange, 201, JsonUtil.success("Warehouse Created", w));
                    Logger.info("Created warehouse: " + id);
                } catch (IllegalArgumentException e) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error(e.getMessage()));
                }

            } else if ("PUT".equalsIgnoreCase(method)) {
                if (parts.length == 4) {
                    String id = parts[3];
                    String body = ApiServer.readRequestBody(exchange);
                    Map<String, Object> req = JsonUtil.parseMap(body);

                    String newName = (String) req.get("warehouseName");
                    
                    if (newName != null && newName.trim().isEmpty()) {
                        ApiServer.sendResponse(exchange, 400, JsonUtil.error("Warehouse name cannot be empty."));
                        return;
                    }

                    boolean updated = warehouseService.updateWarehouse(id, newName);
                    if (updated) {
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Warehouse Updated"));
                        Logger.info("Updated warehouse: " + id);
                    } else {
                        ApiServer.sendResponse(exchange, 404, JsonUtil.error("Warehouse Not Found"));
                    }
                } else {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing warehouse ID"));
                }
            } else {
                ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
            }
        } catch (Exception e) {
            Logger.error("Error in WarehouseHandler: " + e.getMessage());
            ApiServer.sendResponse(exchange, 500, JsonUtil.error("Internal Server Error"));
        }
    }
}
