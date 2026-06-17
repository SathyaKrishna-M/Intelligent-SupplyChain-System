package services;

import models.Activity;
import models.User;
import storage.FileManager;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

public class ActivityService {
    private final FileManager fileManager;
    private final LinkedList<Activity> activities;
    private static final int MAX_ACTIVITIES = 50;

    public ActivityService(FileManager fileManager) {
        this.fileManager = fileManager;
        List<Activity> loaded = fileManager.loadActivities();
        this.activities = new LinkedList<>(loaded);
    }

    public void logActivity(User user, String action, String entityType, String entityId, String description) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String username = user != null ? user.getUsername() : "System";
        String role = user != null ? user.getRole().name() : "SYSTEM";
        
        Activity activity = new Activity(UUID.randomUUID().toString(), timestamp, username, role, action, entityType, entityId, description);
        
        activities.addFirst(activity);
        
        while (activities.size() > MAX_ACTIVITIES) {
            activities.removeLast();
        }
        
        fileManager.saveActivities(activities);
    }

    public List<Activity> getLatestActivities() {
        return Collections.unmodifiableList(activities);
    }
}
