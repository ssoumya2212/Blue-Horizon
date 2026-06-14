import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def run_web_e2e_tests():
    print("Initializing Mobile Web E2E Test...")
    
    # Setup Chrome options for Headless mode and Mobile emulation
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--window-size=390,844") # Mobile viewport (iPhone 12/13/14)
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    prefs = {
        "profile.default_content_setting_values.geolocation": 1,
        "profile.default_content_setting_values.notifications": 1
    }
    chrome_options.add_experimental_option("prefs", prefs)
    
    # Set mobile user agent
    mobile_emulation = {
        "deviceMetrics": { "width": 390, "height": 844, "pixelRatio": 3.0 },
        "userAgent": "Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
    }
    chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)

    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 15)
    test_results = []
    
    try:
        # Test Case 1: App/Web Load
        print("Loading Blue Horizon URL...")
        driver.get("https://blue-horizon.trackmybus.workers.dev/login")
        
        # Give it a moment to render
        time.sleep(3)
        
        # Bypass "Allow" permissions onboarding screens
        print("Checking for permissions screen...")
        try:
            allow_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Allow')]")
            for btn in allow_buttons:
                btn.click()
                time.sleep(1)
        except Exception as e:
            print("No onboarding screen or couldn't click allow", e)
        
        test_results.append({
            "Test Case ID": "TC_001",
            "Description": "Verify Web App Launches Successfully",
            "Status": "PASS",
            "Remarks": "Successfully loaded the login page URL"
        })

        roles = ["parent", "driver", "admin"]
        
        for idx, role in enumerate(roles):
            print(f"Attempting to login as {role}...")
            try:
                driver.get("https://blue-horizon.trackmybus.workers.dev/login")
                time.sleep(3)
                
                # Click the role tab
                if role != "parent":
                    try:
                        tab_button = wait.until(EC.element_to_be_clickable((By.XPATH, f"//button[@role='tab' and text()='{role}']")))
                        tab_button.click()
                        time.sleep(1)
                    except Exception as e:
                        print(f"Failed to click tab {role}: {e}")

                # Find email input
                email_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='email']")))
                email_input.clear()
                email_input.send_keys("soumyaselvam12@gmail.com")
                
                # Find password input
                password_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='password']")))
                password_input.clear()
                password_input.send_keys("123456SZ")
                
                # Click Login Button
                login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'LOGIN')]")
                login_button.click()
                
                # Wait for URL to change or for an element on the dashboard
                time.sleep(5)
                current_url = driver.current_url
                
                if "login" not in current_url:
                    test_results.append({
                        "Test Case ID": f"TC_00{2+idx}",
                        "Description": f"User Login with valid credentials ({role})",
                        "Status": "PASS",
                        "Remarks": f"Successfully logged into dashboard for {role}"
                    })
                else:
                    # Check for toast errors
                    page_source = driver.page_source
                    driver.save_screenshot(f"login_failed_{role}.png")
                    with open(f'login_failed_{role}.html', 'w', encoding='utf-8') as f:
                        f.write(page_source)
                    error_msg = "Unknown Error - Login Rejected (Check Credentials)"
                    if "Incorrect password" in page_source:
                        error_msg = "Incorrect password or email"
                    elif "Account exists but is registered as" in page_source:
                        error_msg = "Wrong role selected"
                    
                    test_results.append({
                        "Test Case ID": f"TC_00{2+idx}",
                        "Description": f"User Login with valid credentials ({role})",
                        "Status": "FAIL",
                        "Remarks": error_msg
                    })

            except Exception as e:
                print(f"Login failed for {role}: {e}")
                driver.save_screenshot(f"error_screenshot_{role}.png")
                test_results.append({
                    "Test Case ID": f"TC_00{2+idx}",
                    "Description": f"User Login with valid credentials ({role})",
                    "Status": "FAIL",
                    "Remarks": str(e)
                })

    except Exception as e:
        print(f"Error during E2E Execution: {e}")
    finally:
        print("Closing the browser...")
        driver.quit()
        generate_excel_report(test_results)

def generate_excel_report(results):
    print("Generating Excel Report...")
    df = pd.DataFrame(results)
    output_file = "Test_Report.xlsx"
    df.to_excel(output_file, index=False, sheet_name="E2E Results")
    print(f"Test report saved to {output_file}")

if __name__ == "__main__":
    run_web_e2e_tests()
