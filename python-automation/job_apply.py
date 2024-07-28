from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

# Path to your ChromeDriver
chrome_driver_path = './chromedriver/chromedriver.exe'

# Path to your extension
extension_path = 'C:/Users/bryan/AppData/Local/Google/Chrome/User Data/Default/Extensions/pbanhockgagggenencehbnadejlgchfc/2.0.19_0'

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument(f'--disable-extensions-except={extension_path}')
chrome_options.add_argument(f'--load-extension={extension_path}')
chrome_options.add_argument('--start-maximized')
chrome_options.add_argument('--remote-debugging-port=9222')

# Initialize the ChromeDriver service
service = Service(executable_path=chrome_driver_path)

try:
    # Start ChromeDriver
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.get('https://job-boards.greenhouse.io/chapter/jobs/4450052005?utm_source=himalayas.app&utm_medium=himalayas.app&utm_campaign=himalayas.app&ref=himalayas.app&source=himalayas.app')

    # Wait for the extension to load
    time.sleep(15)

    # Interact with the page
    elements = driver.find_elements(
        By.XPATH, "//*[contains(text(), 'Apply with Simplify')]")
    for element in elements:
        print(element.text)

    driver.quit()
except Exception as e:
    print(f'An error occurred while initializing ChromeDriver: {e}')
