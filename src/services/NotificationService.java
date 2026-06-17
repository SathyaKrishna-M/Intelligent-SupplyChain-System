package services;

import models.Notification;
import models.Role;
import storage.FileManager;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class NotificationService {
    private final FileManager fileManager;
    private final List<Notification> notifications;

    public NotificationService(FileManager fileManager) {
        this.fileManager = fileManager;
        this.notifications = new ArrayList<>(fileManager.loadNotifications());
    }

    public void notify(Notification.Severity severity, String title, String message, Role targetRole) {
        String createdAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        Notification notif = new Notification(UUID.randomUUID().toString(), severity, title, message, createdAt, false, targetRole);
        notifications.add(notif);
        fileManager.saveNotifications(notifications);
    }

    public void markAsRead(String id) {
        for (Notification n : notifications) {
            if (n.getId().equals(id)) {
                n.setRead(true);
                fileManager.saveNotifications(notifications);
                break;
            }
        }
    }

    public List<Notification> getActiveNotificationsForRole(Role role) {
        return notifications.stream()
                .filter(n -> !n.isRead())
                .filter(n -> n.getTargetRole() == null || n.getTargetRole() == role || role == Role.ADMIN)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())) // newest first
                .collect(Collectors.toList());
    }
}
