package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import models.Product;
import services.ProductService;
import utils.HttpUtil;
import utils.Logger;
import utils.PaginationUtil;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProductHandler implements HttpHandler {
    private final ProductService productService;

    public ProductHandler(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        String[] parts = path.split("/");
        Map<String, String> queryParams = HttpUtil.parseQuery(exchange.getRequestURI().getQuery());

        try {
            if ("GET".equalsIgnoreCase(method)) {
                if (parts.length == 3) {
                    List<Product> all = productService.listAllProducts();
                    
                    // Filter by search term
                    if (queryParams.containsKey("q")) {
                        String q = queryParams.get("q").toLowerCase();
                        all = all.stream().filter(p -> p.getName().toLowerCase().contains(q) || p.getProductId().toLowerCase().contains(q)).collect(Collectors.toList());
                    }
                    // Filter by category
                    if (queryParams.containsKey("category")) {
                        String cat = queryParams.get("category");
                        all = all.stream().filter(p -> p.getCategory().equalsIgnoreCase(cat)).collect(Collectors.toList());
                    }
                    
                    // Paginate
                    all = PaginationUtil.paginate(all, queryParams);
                    
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Products retrieved", all));
                    Logger.info("Retrieved " + all.size() + " products");
                    
                } else if (parts.length == 4) {
                    if (path.endsWith("/search")) {
                        // handled by ?q= above usually, but if they strictly call /search?q=
                        String q = queryParams.get("q");
                        if (q == null) q = "";
                        final String search = q.toLowerCase();
                        List<Product> found = productService.listAllProducts().stream()
                            .filter(p -> p.getName().toLowerCase().contains(search) || p.getProductId().toLowerCase().contains(search))
                            .collect(Collectors.toList());
                        found = PaginationUtil.paginate(found, queryParams);
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Search results", found));
                    } else {
                        String id = parts[3];
                        Product p = productService.searchProductById(id);
                        if (p != null) {
                            ApiServer.sendResponse(exchange, 200, JsonUtil.success("Product found", p));
                        } else {
                            ApiServer.sendResponse(exchange, 404, JsonUtil.error("Product Not Found"));
                        }
                    }
                }
            } else if ("POST".equalsIgnoreCase(method)) {
                String body = ApiServer.readRequestBody(exchange);
                Map<String, Object> req = JsonUtil.parseMap(body);

                String productId = (String) req.get("productId");
                String name = (String) req.get("name");
                String category = (String) req.get("category");
                int stock = req.get("stockQuantity") != null ? ((Number) req.get("stockQuantity")).intValue() : 0;
                double cost = req.get("costPrice") != null ? ((Number) req.get("costPrice")).doubleValue() : 0.0;
                double price = req.get("sellingPrice") != null ? ((Number) req.get("sellingPrice")).doubleValue() : 0.0;
                String supplierId = (String) req.get("supplierId");

                try {
                    Product p = new Product(productId, name, category, stock, cost, price, supplierId);
                    productService.addProduct(p);
                    ApiServer.sendResponse(exchange, 201, JsonUtil.success("Product Created", p));
                    Logger.info("Created product: " + productId);
                } catch (IllegalArgumentException e) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Validation failed: " + e.getMessage()));
                } catch (Exception e) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Failed to add product: " + e.getMessage()));
                }

            } else if ("PUT".equalsIgnoreCase(method)) {
                if (parts.length == 4) {
                    String id = parts[3];
                    String body = ApiServer.readRequestBody(exchange);
                    Map<String, Object> req = JsonUtil.parseMap(body);

                    String newName = (String) req.get("name");
                    double newPrice = req.get("price") != null ? ((Number) req.get("price")).doubleValue() : -1;

                    try {
                        productService.updateProduct(id, newName, newPrice);
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Product Updated"));
                        Logger.info("Updated product: " + id);
                    } catch (IllegalArgumentException e) {
                        ApiServer.sendResponse(exchange, 400, JsonUtil.error(e.getMessage()));
                    }
                } else {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing product ID"));
                }
            } else if ("DELETE".equalsIgnoreCase(method)) {
                if (parts.length == 4) {
                    String id = parts[3];
                    try {
                        productService.deleteProduct(id);
                        ApiServer.sendResponse(exchange, 200, JsonUtil.success("Product Deleted"));
                        Logger.info("Deleted product: " + id);
                    } catch (IllegalArgumentException e) {
                        ApiServer.sendResponse(exchange, 404, JsonUtil.error("Product Not Found"));
                    }
                } else {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing product ID"));
                }
            } else {
                ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
            }
        } catch (Exception e) {
            Logger.error("Error in ProductHandler: " + e.getMessage());
            ApiServer.sendResponse(exchange, 500, JsonUtil.error("Internal Server Error"));
        }
    }
}
