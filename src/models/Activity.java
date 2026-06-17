package models;

public class Activity {
    private String id;
    private String timestamp;
    private String user;
    private String role;
    private String action;
    private String entityType;
    private String entityId;
    private String description;

    public Activity(String id, String timestamp, String user, String role, String action, String entityType, String entityId, String description) {
        this.id = id;
        this.timestamp = timestamp;
        this.user = user;
        this.role = role;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.description = description;
    }

    public String getId() { return id; }
    public String getTimestamp() { return timestamp; }
    public String getUser() { return user; }
    public String getRole() { return role; }
    public String getAction() { return action; }
    public String getEntityType() { return entityType; }
    public String getEntityId() { return entityId; }
    public String getDescription() { return description; }
}
