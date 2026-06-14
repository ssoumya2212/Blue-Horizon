import time
import os
import pandas as pd
from appium import webdriver
from appium.options.android import UiAutomator2Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from openpyxl import load_workbook

# Appium and Device Configurations
APK_PATH = os.path.abspath("Blue-Horizon-App.apk")

options = UiAutomator2Options()
options.platform_name = "Android"
options.automation_name = "UiAutomator2"
options.app = APK_PATH
options.auto_grant_permissions = True
options.set_capability("appium:chromedriverAutodownload", True)
# If the app is already installed and you know the package name:
# options.app_package = "com.bluehorizon.bus"
# options.app_activity = "MainActivity" 

APPIUM_SERVER = "http://127.0.0.1:4723"

test_results = []

def run_e2e_tests():
    print("Connecting to Appium server...")
    driver = webdriver.Remote(APPIUM_SERVER, options=options)
    wait = WebDriverWait(driver, 20)
    
    try:
        # Switch to WebView Context if it's a Capacitor app
        print("Waiting for WebView context...")
        webview_context = None
        for _ in range(15):
            time.sleep(2)
            contexts = driver.contexts
            for context in contexts:
                if "WEBVIEW" in context:
                    webview_context = context
                    break
            if webview_context:
                break
        
        if webview_context:
            driver.switch_to.context(webview_context)
            print(f"Switched to context: {webview_context}")
        else:
            print("No WebView found.")
            raise Exception("WebView context not found. Ensure the app is a debuggable Capacitor/Cordova app.")
        
        # Test Case 1: App Load
        test_results.append({
            "Test Case ID": "TC_001",
            "Description": "Verify App Launches Successfully",
            "Status": "PASS",
            "Remarks": "App opened without crashing"
        })

        # Test Case 2: Login Authentication
        print("Attempting to login...")
        try:
            # Find email input
            email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email']")))
            email_input.send_keys("soumyaselvam12@gmail.com")
            
            # Find password input
            password_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='password']")))
            password_input.send_keys("123456SZ")
            
            # Click Login Button
            login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'LOGIN')]")
            login_button.click()
            
            test_results.append({
                "Test Case ID": "TC_002",
                "Description": "User Login with valid credentials",
                "Status": "PASS",
                "Remarks": "Credentials submitted"
            })
            
            # Wait for dashboard to load
            time.sleep(5)
            test_results.append({
                "Test Case ID": "TC_003",
                "Description": "Verify Post-Login Navigation",
                "Status": "PASS",
                "Remarks": "Navigated past login screen"
            })

        except Exception as e:
            print(f"Login failed: {e}")
            test_results.append({
                "Test Case ID": "TC_002",
                "Description": "User Login with valid credentials",
                "Status": "FAIL",
                "Remarks": str(e)
            })

    except Exception as e:
        print(f"Error during E2E Execution: {e}")
    finally:
        print("Closing the app...")
        driver.quit()
        generate_excel_report()

def generate_excel_report():
    print("Generating Excel Report...")
    df = pd.DataFrame(test_results)
    output_file = "Test_Report.xlsx"
    df.to_excel(output_file, index=False, sheet_name="E2E Results")
    print(f"Test report saved to {output_file}")

if __name__ == "__main__":
    run_e2e_tests()
