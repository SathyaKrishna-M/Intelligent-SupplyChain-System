package services;

import models.PurchaseRequest;
import models.RequestStatus;
import models.OrderItem;
import models.Order;
import models.Product;
import storage.FileManager;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class PurchaseRequestService {
    private FileManager fileManager;
    private List<PurchaseRequest> allRequests;
    private OrderService orderService;
    private ProductService productService;
    private ActivityService activityService;
    private NotificationService notificationService;

    public PurchaseRequestService(FileManager fileManager, OrderService orderService, ProductService productService) {
        this.fileManager = fileManager;
        this.allRequests = fileManager.loadPurchaseRequests();
        this.orderService = orderService;
        this.productService = productService;
    }

    public void printRebuildStatus() {
        System.out.println("Purchase Requests Loaded: " + allRequests.size());
    }

    public void setActivityService(ActivityService activityService) {
        this.activityService = activityService;
    }

    public void setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public PurchaseRequest createRequest(String warehouseId, String productId, int requestedQuantity, String requestDate) {
        String reqId = "REQ-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        PurchaseRequest req = new PurchaseRequest(reqId, warehouseId, productId, requestedQuantity, requestDate, RequestStatus.PENDING);
        allRequests.add(req);
        fileManager.savePurchaseRequests(allRequests);
        
        if (activityService != null) {
            activityService.logActivity(null, "Purchase Request Created", "PurchaseRequest", reqId, "Created request for product " + productId);
        }
        if (notificationService != null) {
            Product p = productService.searchProductById(productId);
            if (p != null) {
                notificationService.notify(models.Notification.Severity.INFO, "Pending Supplier Request", "New purchase request " + reqId + " pending approval.", models.Role.SUPPLIER);
            }
        }
        return req;
    }

    public boolean approveRequest(String requestId) {
        for (PurchaseRequest req : allRequests) {
            if (req.getRequestId().equals(requestId) && req.getStatus() == RequestStatus.PENDING) {
                req.setStatus(RequestStatus.APPROVED);
                fileManager.savePurchaseRequests(allRequests);
                if (activityService != null) {
                    activityService.logActivity(null, "Purchase Request Approved", "PurchaseRequest", requestId, "Approved request " + requestId);
                }
                return true;
            }
        }
        return false;
    }

    public boolean rejectRequest(String requestId) {
        for (PurchaseRequest req : allRequests) {
            if (req.getRequestId().equals(requestId) && req.getStatus() == RequestStatus.PENDING) {
                req.setStatus(RequestStatus.REJECTED);
                fileManager.savePurchaseRequests(allRequests);
                return true;
            }
        }
        return false;
    }

    public Order convertRequestToOrder(String requestId, String supplierId, String deliveryDate) {
        for (PurchaseRequest req : allRequests) {
            if (req.getRequestId().equals(requestId) && req.getStatus() == RequestStatus.APPROVED) {
                Product p = productService.searchProductById(req.getProductId());
                double price = p != null ? p.getCostPrice() : 0.0;
                
                List<OrderItem> items = new ArrayList<>();
                items.add(new OrderItem("", req.getProductId(), req.getRequestedQuantity(), price));
                
                Order order = orderService.createOrder(supplierId, req.getWarehouseId(), java.time.LocalDate.now().toString(), deliveryDate, items);
                
                req.setStatus(RequestStatus.FULFILLED);
                fileManager.savePurchaseRequests(allRequests);
                return order;
            }
        }
        return null;
    }

    public List<PurchaseRequest> viewRequests() {
        return allRequests;
    }

    public List<PurchaseRequest> viewSupplierRequests(String supplierId) {
        List<PurchaseRequest> supplierReqs = new ArrayList<>();
        for (PurchaseRequest req : allRequests) {
            Product p = productService.searchProductById(req.getProductId());
            if (p != null && p.getSupplierId().equals(supplierId)) {
                supplierReqs.add(req);
            }
        }
        return supplierReqs;
    }
    
    public PurchaseRequest searchRequest(String requestId) {
        for (PurchaseRequest req : allRequests) {
            if (req.getRequestId().equals(requestId)) return req;
        }
        return null;
    }
}
