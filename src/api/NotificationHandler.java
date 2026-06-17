package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import models.Role;
import services.NotificationService;
import java.io.IOException;

public class NotificationHandler implements HttpHandler {
    private final NotificationService notificationService;

    public NotificationHandler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if ("GET".equalsIgnoreCase(method)) {
            // Check for role header
            String roleStr = exchange.getRequestHeaders().getFirst("X-User-Role");
            Role role = null;
            if (roleStr != null && !roleStr.isEmpty()) {
                try {
                    role = Role.valueOf(roleStr.toUpperCase());
                } catch (Exception e) {}
            }
            if (role == null) {
                // Default to admin to see everything if role isn't clear
                role = Role.ADMIN;
            }
            
            String json = JsonUtil.toJson(notificationService.getActiveNotificationsForRole(role));
            ApiServer.sendResponse(exchange, 200, json);
            
        } else if ("PUT".equalsIgnoreCase(method)) {
            // Path: /api/notifications/{id}/read
            if (path.endsWith("/read")) {
                String[] parts = path.split("/");
                if (parts.length >= 4) {
                    String id = parts[3];
                    notificationService.markAsRead(id);
                    ApiServer.sendResponse(exchange, 200, JsonUtil.success("Notification marked as read"));
                } else {
                    ApiServer.sendResponse(exchange, 400, JsonUtil.error("Invalid notification ID"));
                }
            } else {
                ApiServer.sendResponse(exchange, 404, JsonUtil.error("Endpoint not found"));
            }
        } else {
            ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
        }
    }
}
