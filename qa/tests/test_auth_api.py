import requests
from config.settings import API_BASE_URL

def test_login_success():
    resp = requests.post(f"{API_BASE_URL}/auth/login", json={"username": "admin", "password": "admin"})
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("username") == "admin"
    assert data.get("role") == "ADMIN"

def test_login_invalid():
    resp = requests.post(f"{API_BASE_URL}/auth/login", json={"username": "invalid", "password": "123"})
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("success") is False
    assert "error" in data

def test_register_user():
    # Register a test user
    payload = {
        "id": "QA_USER_1",
        "username": "qa_tester",
        "password": "pwd",
        "role": "SUPPLIER"
    }
    resp = requests.post(f"{API_BASE_URL}/auth/register", json=payload)
    assert resp.status_code == 200
    
    # Try to log in with new user
    login_resp = requests.post(f"{API_BASE_URL}/auth/login", json={"username": "qa_tester", "password": "pwd"})
    data = login_resp.json()
    assert data.get("role") == "SUPPLIER"
