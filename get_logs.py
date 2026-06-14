from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
import json

options = Options()
options.add_argument('--headless=new')
options.add_argument('--disable-dev-shm-usage')
prefs = {
    "profile.default_content_setting_values.geolocation": 1,
    "profile.default_content_setting_values.notifications": 1
}
options.add_experimental_option("prefs", prefs)
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

driver = webdriver.Chrome(options=options)
driver.get('https://blue-horizon.trackmybus.workers.dev/login')
time.sleep(3)

try:
    allow_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Allow')]")
    for btn in allow_buttons:
        btn.click()
        time.sleep(1)
except:
    pass

time.sleep(2)

try:
    email_input = driver.find_element(By.CSS_SELECTOR, "input[name='email']")
    driver.execute_script("arguments[0].value = 'soumyaselvam12@gmail.com'; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", email_input)
    
    password_input = driver.find_element(By.CSS_SELECTOR, "input[name='password']")
    driver.execute_script("arguments[0].value = '123456SZ'; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", password_input)
    
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'LOGIN')]")
    driver.execute_script("arguments[0].click();", login_button)
    time.sleep(5)
except Exception as e:
    print("Error:", e)

logs = driver.get_log('browser')
for log in logs:
    print(log)

driver.quit()
