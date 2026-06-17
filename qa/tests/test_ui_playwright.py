import pytest
from playwright.sync_api import sync_playwright
import os
import time
from config.settings import UI_BASE_URL, ADMIN_CREDS

# Create screenshots directory if it doesn't exist
SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), '..', 'reports', 'screenshots')
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

@pytest.fixture(scope="module")
def browser_context():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        yield context
        browser.close()

def test_login_flow_and_dashboard(browser_context):
    page = browser_context.new_page()
    page.goto(f"{UI_BASE_URL}/login")
    
    # Wait for the login form to be visible
    page.wait_for_selector('input[type="text"]')
    
    # Attempt login
    page.fill('input[type="text"]', ADMIN_CREDS["username"])
    page.fill('input[type="password"]', ADMIN_CREDS["password"])
    page.click('button[type="submit"]')
    
    # Wait for dashboard to load
    page.wait_for_selector('text=Executive Dashboard', timeout=5000)
    
    # Take Dashboard Screenshot
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, 'dashboard.png'))
    
    # Navigate to Inventory
    page.click('text=Inventory')
    page.wait_for_selector('text=Inventory Management', timeout=5000)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, 'inventory.png'))
    
    # Navigate to Orders
    page.click('text=Orders')
    page.wait_for_selector('text=Track and manage procurement orders.', timeout=5000)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, 'orders.png'))
    
    # Navigate to Analytics
    page.click('text=Analytics')
    page.wait_for_selector('text=Business Intelligence & Analytics', timeout=5000)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, 'analytics.png'))
    
    # Navigate to Reports
    page.click('text=Reports')
    page.wait_for_selector('text=Executive Data Export', timeout=5000)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, 'reports.png'))
    
    page.close()
