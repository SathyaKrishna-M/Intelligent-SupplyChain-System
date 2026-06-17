package api;

import java.util.List;

public class ApiResponse {
    public boolean success;
    public String message;
    public Object data;
    public List<String> errors;

    public ApiResponse(boolean success, String message, Object data, List<String> errors) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }
}
