import requests
import uuid
from config.settings import API_BASE_URL

def test_create_and_read_product():
    test_id = f"QA_PROD_{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "productId": test_id,
        "name": f"Test Product {test_id}",
        "category": "QA Testing",
        "stockQuantity": 150,
        "costPrice": 10.50,
        "sellingPrice": 25.00,
        "supplierId": "SUP001"
    }

    # Create Product
    create_resp = requests.post(f"{API_BASE_URL}/products", json=payload)
    assert create_resp.status_code == 200

    # Read Products to verify insertion and BST/AVL indexing
    read_resp = requests.get(f"{API_BASE_URL}/products")
    assert read_resp.status_code == 200
    products = read_resp.json()
    
    # Assert product is in the list
    found = next((p for p in products if p["productId"] == test_id), None)
    assert found is not None
    assert found["name"] == payload["name"]

def test_delete_product():
    test_id = f"QA_PROD_DEL_{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "productId": test_id,
        "name": f"Delete Me {test_id}",
        "category": "QA Testing",
        "stockQuantity": 10,
        "costPrice": 1.0,
        "sellingPrice": 2.0,
        "supplierId": "SUP001"
    }

    requests.post(f"{API_BASE_URL}/products", json=payload)
    
    # Delete Product
    del_resp = requests.delete(f"{API_BASE_URL}/products/{test_id}")
    assert del_resp.status_code == 200
    
    # Verify Deletion
    read_resp = requests.get(f"{API_BASE_URL}/products")
    products = read_resp.json()
    found = next((p for p in products if p["productId"] == test_id), None)
    assert found is None
