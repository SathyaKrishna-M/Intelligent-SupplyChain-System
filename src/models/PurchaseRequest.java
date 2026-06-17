package models;

public class PurchaseRequest {
    private String requestId;
    private String warehouseId;
    private String productId;
    private int requestedQuantity;
    private String requestDate;
    private RequestStatus status;

    public PurchaseRequest(String requestId, String warehouseId, String productId, int requestedQuantity, String requestDate, RequestStatus status) {
        this.requestId = requestId;
        this.warehouseId = warehouseId;
        this.productId = productId;
        this.requestedQuantity = requestedQuantity;
        this.requestDate = requestDate;
        this.status = status;
    }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public int getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(int requestedQuantity) { this.requestedQuantity = requestedQuantity; }
    public String getRequestDate() { return requestDate; }
    public void setRequestDate(String requestDate) { this.requestDate = requestDate; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
}
