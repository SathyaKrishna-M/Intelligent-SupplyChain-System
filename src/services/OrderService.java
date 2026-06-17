package services;

import datastructures.BTree;
import models.Order;
import models.OrderItem;
import models.OrderStatus;
import storage.FileManager;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OrderService {
    private FileManager fileManager;
    private BTree orderTree;
    private List<Order> allOrders;
    private List<OrderItem> allOrderItems;
    private WarehouseService warehouseService;
    private LogisticsService logisticsService;
    private ActivityService activityService;
    private NotificationService notificationService;

    public OrderService(FileManager fileManager, WarehouseService warehouseService) {
        this.fileManager = fileManager;
        this.warehouseService = warehouseService;
        this.allOrders = fileManager.loadOrders();
        this.allOrderItems = fileManager.loadOrderItems();
        this.orderTree = new BTree(3); // Degree 3 BTree

        // Rebuild BTree
        for (Order o : allOrders) {
            orderTree.insert(o);
        }
    }

    public void setLogisticsService(LogisticsService logisticsService) {
        this.logisticsService = logisticsService;
    }

    public void setActivityService(ActivityService activityService) {
        this.activityService = activityService;
    }

    public void setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public void printRebuildStatus() {
        System.out.println("Orders Loaded: " + allOrders.size());
        System.out.println("BTree Rebuilt for Orders");
    }

    public Order createOrder(String supplierId, String warehouseId, String orderDate, String deliveryDate, List<OrderItem> items) {
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        double totalCost = 0;
        
        for (OrderItem item : items) {
            item.setOrderId(orderId);
            totalCost += (item.getQuantity() * item.getUnitPrice());
            allOrderItems.add(item);
        }

        Order order = new Order(orderId, supplierId, warehouseId, orderDate, deliveryDate, OrderStatus.PENDING, totalCost);
        allOrders.add(order);
        orderTree.insert(order);

        fileManager.saveOrders(allOrders);
        fileManager.saveOrderItems(allOrderItems);
        utils.Logger.audit("ORDER_CREATED", "Order created: " + orderId + " for Supplier: " + supplierId);
        
        if (activityService != null) {
            activityService.logActivity(null, "Order Created", "Order", orderId, "Created order " + orderId + " for supplier " + supplierId);
        }
        if (notificationService != null) {
            notificationService.notify(models.Notification.Severity.INFO, "Pending Order", "New order " + orderId + " is pending approval.", models.Role.SUPPLIER);
        }
        
        return order;
    }

    public boolean approveOrder(String orderId) {
        Order o = orderTree.search(orderId);
        if (o != null && o.getStatus() == OrderStatus.PENDING) {
            o.setStatus(OrderStatus.APPROVED);
            fileManager.saveOrders(allOrders);
            return true;
        }
        return false;
    }

    public boolean rejectOrder(String orderId) {
        Order o = orderTree.search(orderId);
        if (o != null && o.getStatus() == OrderStatus.PENDING) {
            o.setStatus(OrderStatus.REJECTED);
            fileManager.saveOrders(allOrders);
            return true;
        }
        return false;
    }

    public boolean markProcessing(String orderId) {
        Order o = orderTree.search(orderId);
        if (o != null && o.getStatus() == OrderStatus.APPROVED) {
            o.setStatus(OrderStatus.PROCESSING);
            fileManager.saveOrders(allOrders);
            return true;
        }
        return false;
    }

    public boolean markShipped(String orderId) {
        Order o = orderTree.search(orderId);
        if (o != null && (o.getStatus() == OrderStatus.PROCESSING || o.getStatus() == OrderStatus.APPROVED)) {
            o.setStatus(OrderStatus.SHIPPED);
            fileManager.saveOrders(allOrders);

            // Trigger Automatic Shipment Creation
            if (logisticsService != null) {
                logisticsService.createShipment(orderId, o.getSupplierId(), o.getWarehouseId());
                System.out.println("Automatic Shipment Created for Order: " + orderId);
            }
            return true;
        }
        return false;
    }

    public boolean markDelivered(String orderId) {
        Order o = orderTree.search(orderId);
        if (o != null && o.getStatus() == OrderStatus.SHIPPED) {
            o.setStatus(OrderStatus.DELIVERED);
            fileManager.saveOrders(allOrders);

            // Trigger Automatic Inventory Update
            List<OrderItem> items = getItemsForOrder(orderId);
            for (OrderItem item : items) {
                warehouseService.assignProductToWarehouse(o.getWarehouseId(), item.getProductId(), item.getQuantity());
            }
            return true;
        }
        return false;
    }

    public Order searchOrder(String orderId) {
        return orderTree.search(orderId);
    }

    public List<Order> viewOrderHistory() {
        return orderTree.traverse();
    }

    public List<OrderItem> getItemsForOrder(String orderId) {
        List<OrderItem> list = new ArrayList<>();
        for (OrderItem oi : allOrderItems) {
            if (oi.getOrderId().equals(orderId)) {
                list.add(oi);
            }
        }
        return list;
    }

    public List<Order> searchOrdersBySupplier(String supplierId) {
        List<Order> list = new ArrayList<>();
        for (Order o : orderTree.traverse()) {
            if (o.getSupplierId().equals(supplierId)) {
                list.add(o);
            }
        }
        return list;
    }

    public List<Order> searchOrdersByWarehouse(String warehouseId) {
        List<Order> list = new ArrayList<>();
        for (Order o : orderTree.traverse()) {
            if (o.getWarehouseId().equals(warehouseId)) {
                list.add(o);
            }
        }
        return list;
    }

    public double calculateOrderCost(String orderId) {
        Order o = searchOrder(orderId);
        return o != null ? o.getTotalCost() : 0.0;
    }

    public List<Order> getAllOrders() {
        return allOrders;
    }
}
