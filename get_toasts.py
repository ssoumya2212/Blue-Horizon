from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
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

driver.get('https://blue-horizon.trackmybus.workers.dev/login')
time.sleep(3)

try:
    allow_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Allow')]")
    for btn in allow_buttons:
        btn.click()
        time.sleep(1)
except:
    pass

try:
    email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email']")))
    ActionChains(driver).move_to_element(email_input).click().send_keys("soumyaselvam12@gmail.com").perform()
    time.sleep(1)
    
    password_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='password']")))
    ActionChains(driver).move_to_element(password_input).click().send_keys("123456SZ").perform()
    time.sleep(1)
    
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'LOGIN')]")
    ActionChains(driver).move_to_element(login_button).click().perform()
    
    time.sleep(3)
    
    # Check for toasts
    toasts = driver.find_elements(By.CSS_SELECTOR, "[data-sonner-toast]")
    for toast in toasts:
        print("TOAST MESSAGE:", toast.text)
        
    print("CURRENT URL:", driver.current_url)

except Exception as e:
    print("Error:", e)

driver.quit()
