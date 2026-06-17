package services;

import models.*;
import storage.FileManager;
import java.util.List;

public class AuthenticationService {
    private FileManager fileManager;
    private List<User> users;
    private ActivityService activityService;

    public AuthenticationService(FileManager fileManager) {
        this.fileManager = fileManager;
        this.users = fileManager.loadUsers();
    }

    public void setActivityService(ActivityService activityService) {
        this.activityService = activityService;
    }

    public User register(String id, String username, String password, Role role) {
        for (User u : users) {
            if (u.getUsername().equals(username)) return null;
        }
        User newUser = null;
        switch(role) {
            case ADMIN: newUser = new Admin(id, username, password); break;
            case WAREHOUSE_MANAGER: newUser = new WarehouseManager(id, username, password); break;
            case LOGISTICS_MANAGER: newUser = new LogisticsManager(id, username, password); break;
            case SUPPLIER: newUser = new SupplierUser(id, username, password); break;
        }
        if (newUser != null) {
            users.add(newUser);
            fileManager.saveUsers(users);
        }
        return newUser;
    }

    public User login(String username, String password) {
        for (User u : users) {
            if (u.getUsername().equals(username) && u.getPassword().equals(password)) {
                utils.Logger.audit("USER_LOGIN", "User logged in: " + username + " (" + u.getRole() + ")");
                if (activityService != null) {
                    activityService.logActivity(u, "User Login", "User", u.getId(), "User logged into the system");
                }
                return u;
            }
        }
        return null;
    }
}
