package services;

import models.Driver;
import models.DriverStatus;
import storage.FileManager;
import java.util.ArrayList;
import java.util.List;

public class DriverService {
    private FileManager fileManager;
    private List<Driver> allDrivers;

    public DriverService(FileManager fileManager) {
        this.fileManager = fileManager;
        this.allDrivers = fileManager.loadDrivers();
    }

    public void printRebuildStatus() {
        System.out.println("Drivers Loaded: " + allDrivers.size());
    }

    public void addDriver(Driver driver) {
        allDrivers.add(driver);
        fileManager.saveDrivers(allDrivers);
    }

    public boolean removeDriver(String driverId) {
        boolean removed = allDrivers.removeIf(d -> d.getDriverId().equals(driverId));
        if (removed) {
            fileManager.saveDrivers(allDrivers);
        }
        return removed;
    }

    public boolean updateDriverStatus(String driverId, DriverStatus status) {
        for (Driver d : allDrivers) {
            if (d.getDriverId().equals(driverId)) {
                d.setAvailabilityStatus(status);
                fileManager.saveDrivers(allDrivers);
                return true;
            }
        }
        return false;
    }

    public List<Driver> viewDrivers() {
        return allDrivers;
    }

    public List<Driver> viewAvailableDrivers() {
        List<Driver> available = new ArrayList<>();
        for (Driver d : allDrivers) {
            if (d.getAvailabilityStatus() == DriverStatus.AVAILABLE) {
                available.add(d);
            }
        }
        return available;
    }
}
