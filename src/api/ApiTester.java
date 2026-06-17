package api;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ApiTester {
    private static final String BASE_URL = "http://localhost:8080/api";
    private static final HttpClient client = HttpClient.newHttpClient();

    public static void main(String[] args) throws Exception {
        System.out.println("Starting API Tests...");
        
        test("GET /api/products", "GET", "/products", null);
        test("GET /api/warehouses", "GET", "/warehouses", null);
        test("GET /api/orders", "GET", "/orders", null);
        test("GET /api/analytics/dashboard", "GET", "/analytics/dashboard", null);
        
        String authPayload = "{\"username\":\"admin\",\"password\":\"admin\"}";
        test("POST /api/auth/login", "POST", "/auth/login", authPayload);

        System.out.println("Tests complete.");
    }

    private static void test(String testName, String method, String path, String body) {
        try {
            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL + path))
                    .header("Content-Type", "application/json");

            if ("POST".equals(method)) {
                builder.POST(HttpRequest.BodyPublishers.ofString(body != null ? body : "{}"));
            } else if ("PUT".equals(method)) {
                builder.PUT(HttpRequest.BodyPublishers.ofString(body != null ? body : "{}"));
            } else {
                builder.GET();
            }

            HttpResponse<String> response = client.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            System.out.println("[TEST] " + testName + " -> Status: " + response.statusCode());
            System.out.println("Response: " + response.body() + "\n");
        } catch (Exception e) {
            System.err.println("[TEST FAILED] " + testName + " -> " + e.getMessage());
        }
    }
}
