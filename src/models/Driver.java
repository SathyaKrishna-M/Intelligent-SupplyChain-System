package models;

public class Driver {
    private String driverId;
    private String driverName;
    private String phone;
    private DriverStatus availabilityStatus;

    public Driver(String driverId, String driverName, String phone, DriverStatus availabilityStatus) {
        this.driverId = driverId;
        this.driverName = driverName;
        this.phone = phone;
        this.availabilityStatus = availabilityStatus;
    }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public DriverStatus getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(DriverStatus availabilityStatus) { this.availabilityStatus = availabilityStatus; }
}
