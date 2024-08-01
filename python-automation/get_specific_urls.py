from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

file_path = 'C:/Users/bryan/Desktop/companyDataOutput.json'
try:
    with open(file_path, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"File not found: {file_path}")
    data = {}
except json.JSONDecodeError:
    print("Failed to decode JSON from the file.")
    data = {}
except Exception as e:
    print(f"An error occurred: {e}")
    data = {}

values = list(data.values())[:5]
urls = list(map(lambda elem: elem["jobs"][0]["url"], values))

# Set up Chrome options
options = Options()
options.headless = False  # Run in non-headless mode to see the browser window
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920x1080')

# Set up ChromeDriver service
chrome_driver_path = './chromedriver/chromedriver.exe'
service = Service(chrome_driver_path)

# Initialize the Chrome driver
driver = webdriver.Chrome(service=service, options=options)

# Loop through each URL
for url in urls:
    try:
        # Open a new tab and switch to it
        driver.execute_script("window.open('');")
        driver.switch_to.window(driver.window_handles[-1])

        # Open the URL
        driver.get(url)

        # Adjust the zoom level
        driver.execute_script("document.body.style.zoom='10%'")

        # Wait for the "Apply" button to be present
        try:
            apply_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//a[contains(text(), 'Apply')]"))
            )
            application_url = apply_button.get_attribute('href')
            print(f"Application URL: {application_url}")
        except Exception as e:
            print("Apply button not found.")

        # Close the current tab
        driver.close()

        # Switch back to the original tab
        driver.switch_to.window(driver.window_handles[0])

    except Exception as e:
        print(f"An error occurred: {e}")

# Quit the driver
driver.quit()
