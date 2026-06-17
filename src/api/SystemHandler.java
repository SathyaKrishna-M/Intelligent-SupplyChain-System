package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import storage.FileManager;
import utils.DemoDataGenerator;
import utils.Logger;
import java.io.IOException;

public class SystemHandler implements HttpHandler {
    
    private final FileManager fileManager;

    public SystemHandler(FileManager fileManager) {
        this.fileManager = fileManager;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        if (path.equals("/api/system/seed") && "POST".equals(method)) {
            DemoDataGenerator.generateData(fileManager);
            ApiServer.sendResponse(exchange, 200, "{\"success\": true, \"message\": \"Demo data generated successfully! Restart the backend or wait for reload.\"}");
        } 
        else if (path.equals("/api/system/health") && "GET".equals(method)) {
            Runtime runtime = Runtime.getRuntime();
            long memoryUsed = (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024);
            
            String json = String.format("{\"status\": \"ONLINE\", \"memoryUsedMb\": %d, \"products\": %d, \"warehouses\": %d, \"suppliers\": %d, \"orders\": %d, \"shipments\": %d}", 
                memoryUsed, 
                fileManager.loadProducts().size(),
                fileManager.loadWarehouses().size(),
                fileManager.loadSuppliers().size(),
                fileManager.loadOrders().size(),
                fileManager.loadShipments().size()
            );
            ApiServer.sendResponse(exchange, 200, json);
        }
        else if (path.equals("/api/health") && "GET".equals(method)) {
            ApiServer.sendResponse(exchange, 200, "{\"status\":\"UP\"}");
        }
        else if (path.equals("/api/system/audit") && "GET".equals(method)) {
            java.util.List<String> logs = Logger.getRecentAuditLogs();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < logs.size(); i++) {
                sb.append("\"").append(logs.get(i).replace("\"", "\\\"")).append("\"");
                if (i < logs.size() - 1) sb.append(",");
            }
            sb.append("]");
            ApiServer.sendResponse(exchange, 200, sb.toString());
        }
        else if (path.equals("/api/search") && "GET".equals(method)) {
            String query = getQueryParam(exchange, "q").toLowerCase();
            
            java.util.List<models.Product> pList = fileManager.loadProducts().stream().filter(p -> p.getName().toLowerCase().contains(query) || p.getProductId().toLowerCase().contains(query)).limit(5).collect(java.util.stream.Collectors.toList());
            java.util.List<models.Order> oList = fileManager.loadOrders().stream().filter(o -> o.getOrderId().toLowerCase().contains(query)).limit(5).collect(java.util.stream.Collectors.toList());
            java.util.List<models.Supplier> sList = fileManager.loadSuppliers().stream().filter(s -> s.getSupplierName().toLowerCase().contains(query) || s.getSupplierId().toLowerCase().contains(query)).limit(5).collect(java.util.stream.Collectors.toList());
            java.util.List<models.Warehouse> wList = fileManager.loadWarehouses().stream().filter(w -> w.getWarehouseName().toLowerCase().contains(query) || w.getWarehouseId().toLowerCase().contains(query)).limit(5).collect(java.util.stream.Collectors.toList());
            
            StringBuilder sb = new StringBuilder();
            sb.append("{");
            sb.append("\"products\": ").append(api.JsonUtil.toJson(pList)).append(",");
            sb.append("\"orders\": ").append(api.JsonUtil.toJson(oList)).append(",");
            sb.append("\"suppliers\": ").append(api.JsonUtil.toJson(sList)).append(",");
            sb.append("\"warehouses\": ").append(api.JsonUtil.toJson(wList));
            sb.append("}");
            ApiServer.sendResponse(exchange, 200, sb.toString());
        }
        else {
            ApiServer.sendResponse(exchange, 404, "{\"error\": \"System route not found\"}");
        }
    }
    
    private String getQueryParam(HttpExchange exchange, String key) {
        String query = exchange.getRequestURI().getQuery();
        if (query == null) return "";
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length > 1 && pair[0].equals(key)) {
                return pair[1];
            }
        }
        return "";
    }
}
