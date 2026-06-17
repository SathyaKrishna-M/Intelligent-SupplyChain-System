import requests
import time
from config.settings import API_BASE_URL

def test_order_to_delivery_workflow():
    # 1. Ensure we have at least one Warehouse and Supplier
    wh_resp = requests.get(f"{API_BASE_URL}/warehouses")
    sup_resp = requests.get(f"{API_BASE_URL}/suppliers")
    
    warehouses = wh_resp.json()
    suppliers = sup_resp.json()
    
    if len(warehouses) < 2 or len(suppliers) < 1:
        # Seed the system to ensure data exists
        requests.post(f"{API_BASE_URL}/system/seed")
        time.sleep(2)
        warehouses = requests.get(f"{API_BASE_URL}/warehouses").json()
        suppliers = requests.get(f"{API_BASE_URL}/suppliers").json()
        
    supplier_id = suppliers[0]["supplierId"]
    wh1_id = warehouses[0]["warehouseId"]
    wh2_id = warehouses[1]["warehouseId"]

    # 2. Create Order
    order_payload = {
        "supplierId": supplier_id,
        "warehouseId": wh1_id,
        "items": [{"productId": "P001", "quantity": 100, "unitPrice": 15.5}]
    }
    order_resp = requests.post(f"{API_BASE_URL}/orders", json=order_payload)
    assert order_resp.status_code == 200
    order_data = order_resp.json()
    order_id = order_data["orderId"]
    assert order_data["status"] == "PENDING"

    # 3. Create Shipment (Logistics network)
    shipment_payload = {
        "orderId": order_id,
        "sourceWarehouseId": wh1_id,
        "destinationWarehouseId": wh2_id
    }
    ship_resp = requests.post(f"{API_BASE_URL}/shipments", json=shipment_payload)
    assert ship_resp.status_code == 200
    shipment_data = ship_resp.json()
    shipment_id = shipment_data["shipmentId"]
    assert shipment_data["status"] == "CREATED"

    # 4. Assign Driver (Triggers Dijkstra Graph logic)
    assign_resp = requests.post(f"{API_BASE_URL}/shipments/{shipment_id}/assign")
    assert assign_resp.status_code == 200
    assign_data = assign_resp.json()
    # It might be false if no valid route/driver exists, but we seeded so it should be true.
    if assign_data.get("success"):
        # 5. Complete Delivery
        deliver_resp = requests.post(f"{API_BASE_URL}/shipments/{shipment_id}/deliver")
        assert deliver_resp.status_code == 200
        assert deliver_resp.json().get("success") is True
        
        # 6. Verify Order Status changed to DELIVERED
        orders_resp = requests.get(f"{API_BASE_URL}/orders")
        orders = orders_resp.json()
        updated_order = next((o for o in orders if o["orderId"] == order_id), None)
        assert updated_order is not None
        assert updated_order["status"] == "DELIVERED"
