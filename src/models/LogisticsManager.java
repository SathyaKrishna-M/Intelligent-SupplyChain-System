package models;

public class LogisticsManager extends User {
    public LogisticsManager(String id, String username, String password) {
        super(id, username, password, Role.LOGISTICS_MANAGER);
    }
}
