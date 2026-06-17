package models;

public class SupplierUser extends User {
    public SupplierUser(String id, String username, String password) {
        super(id, username, password, Role.SUPPLIER);
    }
}
