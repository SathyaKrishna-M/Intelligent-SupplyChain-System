package utils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PaginationUtil {
    public static <T> List<T> paginate(List<T> list, Map<String, String> queryParams) {
        if (queryParams == null) return list;
        
        try {
            int page = queryParams.containsKey("page") ? Integer.parseInt(queryParams.get("page")) : 1;
            int size = queryParams.containsKey("size") ? Integer.parseInt(queryParams.get("size")) : list.size();

            if (page < 1) page = 1;
            if (size < 1) size = list.size();

            int start = (page - 1) * size;
            if (start >= list.size()) {
                return List.of();
            }
            return list.stream().skip(start).limit(size).collect(Collectors.toList());
        } catch (NumberFormatException e) {
            return list; // ignore bad pagination
        }
    }
}
