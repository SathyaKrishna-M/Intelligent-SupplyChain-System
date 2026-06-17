import requests
from config.settings import API_BASE_URL

def test_fetch_warehouses():
    resp = requests.get(f"{API_BASE_URL}/warehouses")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)

def test_fetch_suppliers():
    resp = requests.get(f"{API_BASE_URL}/suppliers")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)

def test_analytics_and_forecast_endpoints():
    # Verify Segment Tree / Fenwick tree outputs are returned
    dash_resp = requests.get(f"{API_BASE_URL}/dashboard")
    assert dash_resp.status_code == 200
    dash_data = dash_resp.json()
    assert "totalRevenue" in dash_data
    
    stat_resp = requests.get(f"{API_BASE_URL}/stats")
    assert stat_resp.status_code == 200
    
def test_global_search():
    # Ensure unified search parses across domains
    search_resp = requests.get(f"{API_BASE_URL}/search?q=QA")
    assert search_resp.status_code == 200
    data = search_resp.json()
    assert "products" in data
    assert "orders" in data
    assert "suppliers" in data
    assert "warehouses" in data
