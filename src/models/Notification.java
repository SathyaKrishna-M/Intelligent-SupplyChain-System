package models;

public class Notification {
    public enum Severity {
        INFO, WARNING, ERROR, SUCCESS
    }

    private String id;
    private Severity severity;
    private String title;
    private String message;
    private String createdAt;
    private boolean read;
    private Role targetRole;

    public Notification(String id, Severity severity, String title, String message, String createdAt, boolean read, Role targetRole) {
        this.id = id;
        this.severity = severity;
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
        this.read = read;
        this.targetRole = targetRole;
    }

    public String getId() { return id; }
    public Severity getSeverity() { return severity; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getCreatedAt() { return createdAt; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public Role getTargetRole() { return targetRole; }
}
