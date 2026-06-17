package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import services.ActivityService;
import java.io.IOException;

public class ActivityHandler implements HttpHandler {
    private final ActivityService activityService;

    public ActivityHandler(ActivityService activityService) {
        this.activityService = activityService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if ("GET".equalsIgnoreCase(method)) {
            String json = JsonUtil.toJson(activityService.getLatestActivities());
            ApiServer.sendResponse(exchange, 200, json);
        } else {
            ApiServer.sendResponse(exchange, 405, JsonUtil.error("Method Not Allowed"));
        }
    }
}
