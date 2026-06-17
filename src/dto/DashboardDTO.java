package dto;

public class DashboardDTO {
    public int totalProducts;
    public int totalWarehouses;
    public int totalSuppliers;
    public int totalOrders;
    public int pendingOrders;
    public int deliveredOrders;
    public double revenue;
    public int lowStockProducts;
    public int activeShipments;

    public DashboardDTO(int totalProducts, int totalWarehouses, int totalSuppliers, int totalOrders, int pendingOrders, int deliveredOrders, double revenue, int lowStockProducts, int activeShipments) {
        this.totalProducts = totalProducts;
        this.totalWarehouses = totalWarehouses;
        this.totalSuppliers = totalSuppliers;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.deliveredOrders = deliveredOrders;
        this.revenue = revenue;
        this.lowStockProducts = lowStockProducts;
        this.activeShipments = activeShipments;
    }
}
