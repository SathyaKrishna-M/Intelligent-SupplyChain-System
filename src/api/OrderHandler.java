package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import models.Order;
import models.OrderItem;
import services.OrderService;
import utils.HttpUtil;
import utils.Logger;
import utils.PaginationUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class OrderHandler implements HttpHandler {
    private final OrderService orderService;

    public OrderHandler(OrderService orderService) {
        this.orderService = orderService;
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
                    List<Order> all = orderService.getAllOrders();
                    
                    if (queryParams.containsKey("q")) {
                        String q = queryParams.get("q").toLowerCase();
                        all = all.stream().filter(o -> o.getOrderId().toLowerCase().contains(q) || o.getSupplierId().toLowerCase().contains(q)).collect(Collectors.toList());
                    }
                    if (queryParams.containsKey("status")) {
                        String status = queryParams.get("status").toUpperCase();
                        all = all.stream().filter(o -> o.getStatus().name().equals(status)).collect(Collectors.toList());
                    }
                    
                    all = PaginationUtil.paginate(all, queryParams);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Orders retrieved", all));
                    
                } else if (parts.length == 4 && !path.endsWith("/search")) {
                    String id = parts[3];
                    Order o = orderService.searchOrder(id);
                    if (o != null) {
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Order found", o));
                    } else {
                        ApiServer.sendResponse(exchange, 404, JsonUtil.error("Order Not Found"));
                    }
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                String body = ApiServer.readRequestBody(exchange);
                Map<String, Object> req = JsonUtil.parseMap(body);

                String supplierId = (String) req.get("supplierId");
                String warehouseId = (String) req.get("warehouseId");
                String orderDate = (String) req.get("orderDate");
                String deliveryDate = (String) req.get("deliveryDate");

                if (supplierId == null || supplierId.trim().isEmpty() || warehouseId == null || warehouseId.trim().isEmpty()) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Supplier ID and Warehouse ID are required"));
                    return;
                }

                @SuppressWarnings("unchecked")
                List<Object> itemsObj = (List<Object>) req.get("items");
                List<OrderItem> items = new ArrayList<>();
                if (itemsObj != null) {
                    for (Object itemObj : itemsObj) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> itemMap = (Map<String, Object>) itemObj;
                        String productId = (String) itemMap.get("productId");
                        int quantity = itemMap.get("quantity") != null ? ((Number) itemMap.get("quantity")).intValue() : 0;
                        double unitPrice = itemMap.get("unitPrice") != null ? ((Number) itemMap.get("unitPrice")).doubleValue() : 0.0;
                        if (productId == null || productId.trim().isEmpty() || quantity <= 0 || unitPrice < 0) {
                             ApiServer.sendResponse(exchange, 400, JsonUtil.error("Invalid item details"));
                             return;
                        }
                        items.add(new OrderItem("", productId, quantity, unitPrice));
                    }
                }

                if (items.isEmpty()) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Order must contain at least one item"));
                    return;
                }

                try {
                    Order o = orderService.createOrder(supplierId, warehouseId, orderDate, deliveryDate, items);
                    ApiServer.sendResponse(exchange, 201, JsonUtil.success("Order Created", o));
                    Logger.info("Created order: " + o.getOrderId());
                } catch (Exception e) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Failed to create order: " + e.getMessage()));
                }

            } else if ("PUT".equalsIgnoreCase(method)) {
                if (parts.length == 4) {
                    String id = parts[3];
                    String body = ApiServer.readRequestBody(exchange);
                    Map<String, Object> req = JsonUtil.parseMap(body);

                    String status = (String) req.get("status");
                    boolean updated = false;
                    
                    if ("APPROVED".equalsIgnoreCase(status)) updated = orderService.approveOrder(id);
                    else if ("REJECTED".equalsIgnoreCase(status)) updated = orderService.rejectOrder(id);
                    else if ("PROCESSING".equalsIgnoreCase(status)) updated = orderService.markProcessing(id);
                    else if ("SHIPPED".equalsIgnoreCase(status)) updated = orderService.markShipped(id);
                    else if ("DELIVERED".equalsIgnoreCase(status)) updated = orderService.markDelivered(id);
                    else {
                        ApiServer.sendResponse(exchange, 400, JsonUtil.error("Invalid status"));
                        return;
                    }

                    if (updated) {
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Order Updated"));
                        Logger.info("Updated order status: " + id + " -> " + status);
                    } else {
                        ApiServer.sendResponse(exchange, 400, JsonUtil.error("Failed to update order status or order not found"));
                    }
                } else {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing order ID"));
                }
            } else {
                ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
            }
        } catch (Exception e) {
            Logger.error("Error in OrderHandler: " + e.getMessage());
            ApiServer.sendResponse(exchange, 500, JsonUtil.error("Internal Server Error"));
        }
    }
}
