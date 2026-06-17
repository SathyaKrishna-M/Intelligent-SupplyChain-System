package models;

public class Supplier {
    private String supplierId;
    private String supplierName;
    private String contactInfo;
    private double rating;

    public Supplier(String supplierId, String supplierName, String contactInfo, double rating) {
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.contactInfo = contactInfo;
        this.rating = rating;
    }

    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
}
