package models;

public class SalesRecord {
    private String recordId;
    private String productId;
    private String warehouseId;
    private int quantitySold;
    private double revenue;
    private String date;

    public SalesRecord(String recordId, String productId, String warehouseId, int quantitySold, double revenue, String date) {
        this.recordId = recordId;
        this.productId = productId;
        this.warehouseId = warehouseId;
        this.quantitySold = quantitySold;
        this.revenue = revenue;
        this.date = date;
    }

    public String getRecordId() { return recordId; }
    public String getProductId() { return productId; }
    public String getWarehouseId() { return warehouseId; }
    public int getQuantitySold() { return quantitySold; }
    public double getRevenue() { return revenue; }
    public String getDate() { return date; }
}
