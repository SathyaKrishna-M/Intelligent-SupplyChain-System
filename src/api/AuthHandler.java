package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import models.Role;
import models.User;
import services.AuthenticationService;

import java.io.IOException;
import java.util.Map;

public class AuthHandler implements HttpHandler {
    private final AuthenticationService authService;

    public AuthHandler(AuthenticationService authService) {
        this.authService = authService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if ("POST".equalsIgnoreCase(method)) {
            String body = ApiServer.readRequestBody(exchange);
            Map<String, Object> req = JsonUtil.parseMap(body);

            if (path.endsWith("/login")) {
                String username = (String) req.get("username");
                String password = (String) req.get("password");

                User user = authService.login(username, password);
                if (user != null) {
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Login successful", user));
                } else {
                    ApiServer.sendResponse(exchange, 401, JsonUtil.error("Invalid credentials"));
                }
            } else if (path.endsWith("/register")) {
                String id = (String) req.get("id");
                String username = (String) req.get("username");
                String password = (String) req.get("password");
                String roleStr = (String) req.get("role");

                if (id == null || username == null || password == null || roleStr == null) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Missing fields: id, username, password, or role"));
                    return;
                }

                try {
                    Role role = Role.valueOf(roleStr.toUpperCase());
                    User newUser = authService.register(id, username, password, role);
                    if (newUser != null) {
                        ApiServer.sendResponse(exchange, 201, JsonUtil.success("User registered successfully", newUser));
                    } else {
                        ApiServer.sendResponse(exchange, 400, JsonUtil.error("Username already exists"));
                    }
                } catch (IllegalArgumentException e) {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Invalid role"));
                }
            } else {
                ApiServer.sendResponse(exchange, 404, JsonUtil.error("Not Found"));
            }
        } else {
            ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
        }
    }
}
