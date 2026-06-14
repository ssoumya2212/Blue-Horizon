from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

options = Options()
options.add_argument('--headless=new')
prefs = {
    "profile.default_content_setting_values.geolocation": 1,
    "profile.default_content_setting_values.notifications": 1
}
options.add_experimental_option("prefs", prefs)

driver = webdriver.Chrome(options=options)
driver.get('https://blue-horizon.trackmybus.workers.dev/login')
time.sleep(3)

# Find all Allow buttons
buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Allow')]")
for btn in buttons:
    try:
        btn.click()
        time.sleep(1)
    except:
        pass

time.sleep(3)
with open('page2.html', 'w', encoding='utf-8') as f:
    f.write(driver.page_source)

# If there is a continue button
try:
    cont = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
    cont.click()
    time.sleep(3)
    with open('page3.html', 'w', encoding='utf-8') as f:
        f.write(driver.page_source)
except:
    pass

driver.quit()
