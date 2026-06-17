package models;

public class WarehouseManager extends User {
    public WarehouseManager(String id, String username, String password) {
        super(id, username, password, Role.WAREHOUSE_MANAGER);
    }
}
