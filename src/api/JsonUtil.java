package api;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.*;

public class JsonUtil {

    // Standard Success Response
    public static String success(String message) {
        return "{\"success\":true,\"message\":\"" + escapeJson(message) + "\",\"data\":null,\"errors\":[]}";
    }

    public static String success(String message, Object data) {
        return "{\"success\":true,\"message\":\"" + escapeJson(message) + "\",\"data\":" + toJson(data) + ",\"errors\":[]}";
    }

    // Standard Error Response
    public static String error(String message) {
        return "{\"success\":false,\"message\":\"" + escapeJson(message) + "\",\"data\":null,\"errors\":[\"" + escapeJson(message) + "\"]}";
    }

    public static String error(String message, List<String> errors) {
        return "{\"success\":false,\"message\":\"" + escapeJson(message) + "\",\"data\":null,\"errors\":" + toJson(errors) + "}";
    }

    // Serialize Object to JSON
    public static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String) return "\"" + escapeJson((String) obj) + "\"";
        if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
        if (obj.getClass().isEnum()) return "\"" + obj.toString() + "\"";
        
        if (obj instanceof Collection) {
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            for (Object item : (Collection<?>) obj) {
                if (!first) sb.append(",");
                sb.append(toJson(item));
                first = false;
            }
            sb.append("]");
            return sb.toString();
        }
        
        if (obj.getClass().isArray()) {
            StringBuilder sb = new StringBuilder("[");
            int length = Array.getLength(obj);
            for (int i = 0; i < length; i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(Array.get(obj, i)));
            }
            sb.append("]");
            return sb.toString();
        }
        
        if (obj instanceof Map) {
            StringBuilder sb = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<?, ?> entry : ((Map<?, ?>) obj).entrySet()) {
                if (!first) sb.append(",");
                sb.append("\"").append(escapeJson(entry.getKey().toString())).append("\":").append(toJson(entry.getValue()));
                first = false;
            }
            sb.append("}");
            return sb.toString();
        }
        
        // Reflection for custom objects
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        Class<?> clazz = obj.getClass();
        while (clazz != null && clazz != Object.class) {
            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true);
                try {
                    Object value = field.get(obj);
                    if (!first) sb.append(",");
                    sb.append("\"").append(field.getName()).append("\":").append(toJson(value));
                    first = false;
                } catch (IllegalAccessException e) {
                    // Ignore
                }
            }
            clazz = clazz.getSuperclass();
        }
        sb.append("}");
        return sb.toString();
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    // --- Basic JSON Parser ---
    
    @SuppressWarnings("unchecked")
    public static Map<String, Object> parseMap(String json) {
        Object parsed = parse(json);
        if (parsed instanceof Map) {
            return (Map<String, Object>) parsed;
        }
        return Collections.emptyMap();
    }
    
    public static Object parse(String json) {
        if (json == null || json.trim().isEmpty()) return null;
        json = json.trim();
        Parser parser = new Parser(json);
        return parser.parseValue();
    }

    private static class Parser {
        private String s;
        private int pos = 0;

        public Parser(String s) {
            this.s = s;
        }

        public Object parseValue() {
            skipWhitespace();
            if (pos >= s.length()) return null;
            char c = s.charAt(pos);
            if (c == '{') return parseObject();
            if (c == '[') return parseArray();
            if (c == '"') return parseString();
            if (c == 't' || c == 'f') return parseBoolean();
            if (c == 'n') return parseNull();
            if (c == '-' || Character.isDigit(c)) return parseNumber();
            throw new RuntimeException("Unexpected character at " + pos + ": " + c);
        }

        private Map<String, Object> parseObject() {
            Map<String, Object> map = new LinkedHashMap<>();
            pos++; // skip '{'
            skipWhitespace();
            if (pos < s.length() && s.charAt(pos) == '}') {
                pos++;
                return map;
            }
            while (pos < s.length()) {
                skipWhitespace();
                String key = parseString();
                skipWhitespace();
                if (s.charAt(pos) != ':') throw new RuntimeException("Expected ':' at " + pos);
                pos++; // skip ':'
                Object value = parseValue();
                map.put(key, value);
                skipWhitespace();
                if (pos >= s.length()) break;
                if (s.charAt(pos) == '}') {
                    pos++;
                    break;
                }
                if (s.charAt(pos) == ',') {
                    pos++;
                } else {
                    throw new RuntimeException("Expected ',' or '}' at " + pos);
                }
            }
            return map;
        }

        private List<Object> parseArray() {
            List<Object> list = new ArrayList<>();
            pos++; // skip '['
            skipWhitespace();
            if (pos < s.length() && s.charAt(pos) == ']') {
                pos++;
                return list;
            }
            while (pos < s.length()) {
                list.add(parseValue());
                skipWhitespace();
                if (pos >= s.length()) break;
                if (s.charAt(pos) == ']') {
                    pos++;
                    break;
                }
                if (s.charAt(pos) == ',') {
                    pos++;
                } else {
                    throw new RuntimeException("Expected ',' or ']' at " + pos);
                }
            }
            return list;
        }

        private String parseString() {
            pos++; // skip '"'
            StringBuilder sb = new StringBuilder();
            while (pos < s.length()) {
                char c = s.charAt(pos++);
                if (c == '"') break;
                if (c == '\\') {
                    if (pos >= s.length()) break;
                    char n = s.charAt(pos++);
                    if (n == '"') sb.append('"');
                    else if (n == '\\') sb.append('\\');
                    else if (n == '/') sb.append('/');
                    else if (n == 'b') sb.append('\b');
                    else if (n == 'f') sb.append('\f');
                    else if (n == 'n') sb.append('\n');
                    else if (n == 'r') sb.append('\r');
                    else if (n == 't') sb.append('\t');
                    else if (n == 'u') {
                        sb.append((char) Integer.parseInt(s.substring(pos, pos + 4), 16));
                        pos += 4;
                    }
                } else {
                    sb.append(c);
                }
            }
            return sb.toString();
        }

        private Boolean parseBoolean() {
            if (s.startsWith("true", pos)) {
                pos += 4;
                return true;
            }
            if (s.startsWith("false", pos)) {
                pos += 5;
                return false;
            }
            throw new RuntimeException("Invalid boolean at " + pos);
        }

        private Object parseNull() {
            if (s.startsWith("null", pos)) {
                pos += 4;
                return null;
            }
            throw new RuntimeException("Invalid null at " + pos);
        }

        private Number parseNumber() {
            int start = pos;
            while (pos < s.length()) {
                char c = s.charAt(pos);
                if (Character.isDigit(c) || c == '-' || c == '+' || c == '.' || c == 'e' || c == 'E') {
                    pos++;
                } else {
                    break;
                }
            }
            String numStr = s.substring(start, pos);
            if (numStr.contains(".") || numStr.contains("e") || numStr.contains("E")) {
                return Double.parseDouble(numStr);
            }
            long l = Long.parseLong(numStr);
            if (l >= Integer.MIN_VALUE && l <= Integer.MAX_VALUE) {
                return (int) l;
            }
            return l;
        }

        private void skipWhitespace() {
            while (pos < s.length() && Character.isWhitespace(s.charAt(pos))) {
                pos++;
            }
        }
    }
}
