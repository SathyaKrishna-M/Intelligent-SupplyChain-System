package services;

import models.Supplier;
import storage.FileManager;
import java.util.List;

public class SupplierService {
    private FileManager fileManager;
    private List<Supplier> suppliers;

    public SupplierService(FileManager fileManager) {
        this.fileManager = fileManager;
        this.suppliers = fileManager.loadSuppliers();
    }

    public List<Supplier> getAllSuppliers() {
        return new java.util.ArrayList<>(suppliers);
    }

    public Supplier findSupplier(String supplierId) {
        for (Supplier s : suppliers) {
            if (s.getSupplierId().equals(supplierId)) return s;
        }
        return null;
    }

    public void addSupplier(Supplier s) {
        suppliers.add(s);
        fileManager.saveSuppliers(suppliers);
    }

    public boolean updateSupplier(String supplierId, String contactInfo) {
        for (Supplier s : suppliers) {
            if (s.getSupplierId().equals(supplierId)) {
                s.setContactInfo(contactInfo);
                fileManager.saveSuppliers(suppliers);
                return true;
            }
        }
        return false;
    }
}
