package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import models.Supplier;
import services.SupplierService;
import utils.HttpUtil;
import utils.Logger;
import utils.PaginationUtil;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class SupplierHandler implements HttpHandler {
    private final SupplierService supplierService;

    public SupplierHandler(SupplierService supplierService) {
        this.supplierService = supplierService;
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
                    List<Supplier> all = supplierService.getAllSuppliers();
                    
                    if (queryParams.containsKey("q")) {
                        String q = queryParams.get("q").toLowerCase();
                        all = all.stream().filter(s -> s.getSupplierName().toLowerCase().contains(q) || s.getSupplierId().toLowerCase().contains(q)).collect(Collectors.toList());
                    }
                    if (queryParams.containsKey("rating")) {
                        try {
                            double rating = Double.parseDouble(queryParams.get("rating"));
                            all = all.stream().filter(s -> s.getRating() >= rating).collect(Collectors.toList());
                        } catch (Exception e) {}
                    }
                    
                    all = PaginationUtil.paginate(all, queryParams);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Suppliers retrieved", all));
                    
                } else if (parts.length == 4 && !path.endsWith("/search")) {
                    String id = parts[3];
                    Supplier s = supplierService.findSupplier(id);
                    if (s != null) {
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Supplier found", s));
                    } else {
                        ApiServer.sendResponse(exchange, 404, JsonUtil.error("Supplier Not Found"));
                    }
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                String body = ApiServer.readRequestBody(exchange);
                Map<String, Object> req = JsonUtil.parseMap(body);

                String id = (String) req.get("supplierId");
                String name = (String) req.get("supplierName");
                String contact = (String) req.get("contactInfo");
                double rating = req.get("rating") != null ? ((Number) req.get("rating")).doubleValue() : 0.0;

                try {
                    if (id == null || id.trim().isEmpty() || name == null || name.trim().isEmpty()) {
                        throw new IllegalArgumentException("ID and Name cannot be empty.");
                    }
                    if (rating < 0 || rating > 5) {
                        throw new IllegalArgumentException("Rating must be between 0 and 5.");
                    }
                    if (supplierService.findSupplier(id) != null) {
                        throw new IllegalArgumentException("Supplier ID already exists.");
                    }
                    Supplier s = new Supplier(id, name, contact, rating);
                    supplierService.addSupplier(s);
                    ApiServer.sendResponse(exchange, 201, JsonUtil.success("Supplier Created", s));
                    Logger.info("Created supplier: " + id);
                } catch (IllegalArgumentException e) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error(e.getMessage()));
                }

            } else if ("PUT".equalsIgnoreCase(method)) {
                if (parts.length == 4) {
                    String id = parts[3];
                    String body = ApiServer.readRequestBody(exchange);
                    Map<String, Object> req = JsonUtil.parseMap(body);

                    String contact = (String) req.get("contactInfo");
                    if (contact != null && contact.trim().isEmpty()) {
                        ApiServer.sendResponse(exchange, 400, JsonUtil.error("Contact info cannot be empty."));
                        return;
                    }

                    boolean updated = supplierService.updateSupplier(id, contact);
                    if (updated) {
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Supplier Updated"));
                        Logger.info("Updated supplier: " + id);
                    } else {
                        ApiServer.sendResponse(exchange, 404, JsonUtil.error("Supplier Not Found"));
                    }
                } else {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing supplier ID"));
                }
            } else {
                ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
            }
        } catch (Exception e) {
            Logger.error("Error in SupplierHandler: " + e.getMessage());
            ApiServer.sendResponse(exchange, 500, JsonUtil.error("Internal Server Error"));
        }
    }
}
