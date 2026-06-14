from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--disable-dev-shm-usage')
prefs = {
    "profile.default_content_setting_values.geolocation": 1,
    "profile.default_content_setting_values.notifications": 1
}
options.add_experimental_option("prefs", prefs)

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 15)

print("Navigating to login...")
driver.get('https://blue-horizon.trackmybus.workers.dev/login')
time.sleep(3)

try:
    allow_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Allow')]")
    for btn in allow_buttons:
        btn.click()
        time.sleep(1)
except:
    pass

print("Filling email...")
email_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='email']")))
email_input.click()
time.sleep(0.5)
email_input.send_keys("soumyaselvam12@gmail.com")

print("Filling password...")
password_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='password']")))
password_input.click()
time.sleep(0.5)
password_input.send_keys("123456SZ")

print("Submitting form...")
password_input.submit()

time.sleep(5)

print("Checking toasts...")
toasts = driver.find_elements(By.CSS_SELECTOR, "[data-sonner-toast]")
for toast in toasts:
    print("TOAST MESSAGE:", toast.text)
    
print("CURRENT URL:", driver.current_url)

driver.quit()
